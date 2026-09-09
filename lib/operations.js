import { open, link, mkdir, rename, rm, stat } from "node:fs/promises";
import { dirname, join, basename } from "node:path";
import { randomBytes } from "node:crypto";
import { canonicalText, validateMemoryRecord } from "./core.js";

export async function atomicWrite(path, content, { overwrite = false } = {}) {
  await mkdir(dirname(path), { recursive: true });
  const temporary = join(dirname(path), `.${basename(path)}.${process.pid}.${randomBytes(6).toString("hex")}.tmp`);
  let handle;
  try {
    handle = await open(temporary, "wx", 0o600);
    await handle.writeFile(content, "utf8");
    await handle.sync();
    await handle.close();
    handle = null;
    if (overwrite) {
      await rename(temporary, path);
    } else {
      await link(temporary, path);
      await rm(temporary);
    }
  } finally {
    if (handle) await handle.close().catch(() => {});
    await rm(temporary, { force: true }).catch(() => {});
  }
}

export async function writeJsonl(records, output) {
  const lines = [];
  for (const [index, record] of records.entries()) {
    const errors = validateMemoryRecord(record);
    if (errors.length) throw new Error(`record ${index} is not canonical: ${errors.join(", ")}`);
    lines.push(JSON.stringify(record));
  }
  await atomicWrite(output, lines.length ? `${lines.join("\n")}\n` : "");
  return lines.length;
}

function similarity(left, right) {
  const a = canonicalText(left).toLocaleLowerCase("en-US");
  const b = canonicalText(right).toLocaleLowerCase("en-US");
  if (a === b) return 1;
  if (!a.length || !b.length) return 0;
  let previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let row = 1; row <= a.length; row += 1) {
    const current = [row];
    for (let column = 1; column <= b.length; column += 1) {
      current[column] = Math.min(
        current[column - 1] + 1,
        previous[column] + 1,
        previous[column - 1] + (a[row - 1] === b[column - 1] ? 0 : 1),
      );
    }
    previous = current;
  }
  return 1 - previous[b.length] / Math.max(a.length, b.length);
}

function sortedCounts(values) {
  return Object.fromEntries([...values.reduce((map, value) => map.set(value, (map.get(value) || 0) + 1), new Map())]
    .sort(([left], [right]) => String(left).localeCompare(String(right), "en")));
}

export function auditRecords(records, {
  approximateThreshold = 0.9,
  maxComparisons = 10_000,
  maxTextLength = 10_000,
} = {}) {
  if (!(approximateThreshold >= 0 && approximateThreshold <= 1)) {
    throw new RangeError("approximateThreshold must be between 0 and 1");
  }
  if (!Number.isSafeInteger(maxComparisons) || maxComparisons < 0) {
    throw new RangeError("maxComparisons must be a non-negative safe integer");
  }
  const ids = records.filter((record) => record.source_id).map((record) => record.source_id);
  const duplicateIds = Object.entries(sortedCounts(ids)).filter(([, count]) => count > 1).map(([id]) => id);
  const hashes = new Map();
  records.forEach((record, index) => hashes.set(record.content_hash, [...(hashes.get(record.content_hash) || []), index]));
  const exactGroups = [...hashes.values()].filter((group) => group.length > 1).sort((a, b) => a[0] - b[0]);
  const approximate = [];
  let comparisons = 0;
  outer: for (let left = 0; left < records.length; left += 1) {
    for (let right = left + 1; right < records.length; right += 1) {
      if (records[left].content_hash === records[right].content_hash) continue;
      if (comparisons >= maxComparisons) break outer;
      comparisons += 1;
      const score = similarity(records[left].text.slice(0, maxTextLength), records[right].text.slice(0, maxTextLength));
      if (score >= approximateThreshold) {
        approximate.push({ indices: [left, right], similarity: Number(score.toFixed(4)) });
      }
    }
  }
  const allNonExactPairs = records.length * (records.length - 1) / 2
    - [...hashes.values()].reduce((total, group) => total + group.length * (group.length - 1) / 2, 0);
  return {
    total: records.length,
    counts: {
      source: sortedCounts(records.map((record) => record.source)),
      scope: sortedCounts(records.map((record) => record.scope)),
      category: sortedCounts(records.map((record) => record.category)),
    },
    missing_source_ids: records.filter((record) => record.source_id === null).length,
    duplicate_source_ids: duplicateIds,
    exact_text_duplicates: exactGroups,
    approximate_text_duplicates: approximate,
    approximate_threshold: approximateThreshold,
    approximate_comparisons: {
      performed: comparisons,
      limit: maxComparisons,
      total_candidates: allNonExactPairs,
      truncated: comparisons < allNonExactPairs,
    },
  };
}

function markdownText(text) {
  return String(text).replaceAll("\r", "").trim();
}

function provenanceMarker(record) {
  const evidence = {
    schema_version: record.schema_version,
    source: record.source,
    scope: record.scope,
    source_id: record.source_id,
    timestamp: record.timestamp,
    category: record.category,
    importance: record.importance,
    content_hash: record.content_hash,
  };
  const json = JSON.stringify(evidence).replaceAll("--", "\\u002d\\u002d");
  return `<!-- openclaw-memory-migrator ${json} -->`;
}

export function renderMemoryCore(records) {
  const durable = [];
  const daily = new Map();
  const durableCategories = new Set(["preference", "preferences", "decision", "profile"]);
  for (const record of records) {
    const date = /^\d{4}-\d{2}-\d{2}/u.exec(record.timestamp || "")?.[0] ?? null;
    const category = record.category.toLowerCase();
    const isDurable = durableCategories.has(category)
      || record.metadata.durable === true
      || (record.importance !== null && record.importance >= 0.8);
    if (isDurable) durable.push(record);
    else daily.set(date || "undated", [...(daily.get(date || "undated") || []), record]);
  }
  const durableLines = [
    "# Durable Memories",
    "",
    "<!-- Generated by openclaw-memory-migrator; MEMORY.md is never modified. -->",
    "",
  ];
  if (!durable.length) durableLines.push("_None._", "");
  for (const record of durable) {
    durableLines.push(
      `## ${record.category || "memory"}`,
      "",
      provenanceMarker(record),
      markdownText(record.text),
      "",
    );
  }
  const files = { "durable.md": `${durableLines.join("\n").trimEnd()}\n` };
  for (const [date, values] of [...daily].sort(([left], [right]) => left.localeCompare(right))) {
    const lines = [
      `# Memories for ${date}`,
      "",
      "<!-- Generated by openclaw-memory-migrator; MEMORY.md is never modified. -->",
      "",
      ...values.flatMap((record) => [
        provenanceMarker(record),
        `- ${markdownText(record.text)}`,
      ]),
      "",
    ];
    files[`${date}.md`] = `${lines.join("\n").trimEnd()}\n`;
  }
  return files;
}

export async function writeMemoryCore(records, outputDirectory) {
  if (basename(outputDirectory).toLowerCase() === "memory.md") {
    throw new Error("refusing to write MEMORY.md; choose a separate output directory");
  }
  const files = renderMemoryCore(records);
  try {
    await stat(outputDirectory);
    throw new Error(`refusing to overwrite existing render output: ${outputDirectory}`);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  await mkdir(dirname(outputDirectory), { recursive: true });
  const temporary = join(
    dirname(outputDirectory),
    `.${basename(outputDirectory)}.${process.pid}.${randomBytes(6).toString("hex")}.tmp`,
  );
  await mkdir(temporary, { mode: 0o700 });
  try {
    for (const name of Object.keys(files).sort()) {
      if (name.toLowerCase() === "memory.md") throw new Error("refusing to write MEMORY.md");
      await atomicWrite(join(temporary, name), files[name]);
    }
    await rename(temporary, outputDirectory);
  } finally {
    await rm(temporary, { recursive: true, force: true }).catch(() => {});
  }
  return Object.keys(files).sort();
}
