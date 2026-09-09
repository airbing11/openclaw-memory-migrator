import { readFile, stat } from "node:fs/promises";
import { extname, basename } from "node:path";
import { createMemoryRecord, stripSensitive, validateMemoryRecord } from "./core.js";

export const ADAPTERS = new Set([
  "canonical-v1",
  "lancedb-pro",
  "markdown",
  "qmd",
  "lancedb-official-list-beta",
]);

async function requireExplicitFile(path, extensions, adapter) {
  let details;
  try {
    details = await stat(path);
  } catch {
    throw new Error(`${adapter} input does not exist: ${path}`);
  }
  if (!details.isFile() || !extensions.includes(extname(path).toLowerCase())) {
    throw new Error(`${adapter} requires an explicit ${extensions.join(" or ")} export file`);
  }
}

async function jsonItems(path) {
  const raw = await readFile(path, "utf8");
  if (extname(path).toLowerCase() === ".jsonl") {
    return raw.split(/\r?\n/u).flatMap((line, index) => {
      if (!line.trim()) return [];
      let parsed;
      try {
        parsed = JSON.parse(line);
      } catch (error) {
        throw new Error(`${path}:${index + 1}: invalid JSON: ${error.message}`);
      }
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new Error(`${path}:${index + 1}: expected a JSON object`);
      }
      return [parsed];
    });
  }
  const parsed = JSON.parse(raw);
  let values;
  if (Array.isArray(parsed)) values = parsed;
  else if (parsed && typeof parsed === "object") {
    values = parsed.records ?? parsed.memories ?? parsed.data ?? [parsed];
  }
  if (!Array.isArray(values) || values.some((item) => !item || typeof item !== "object" || Array.isArray(item))) {
    throw new Error(`${path}: expected an object or list of objects`);
  }
  return values;
}

const SEMANTIC_KEYS = new Set([
  "id", "source_id", "_id", "source", "text", "content", "memory", "document",
  "scope", "namespace", "timestamp", "created_at", "updated_at", "category",
  "createdAt", "agentId", "type", "importance", "score", "metadata", "provenance",
]);

function recordFromMapping(item, source, path, index, { defaultScope = "default" } = {}) {
  const text = item.text ?? item.content ?? item.memory ?? item.document;
  if (typeof text !== "string" || !text.trim()) {
    throw new Error(`${path}: item ${index} has no non-empty text/content field`);
  }
  const extras = {};
  for (const [key, value] of Object.entries(item)) if (!SEMANTIC_KEYS.has(key)) extras[key] = value;
  let sourceMetadata = item.metadata;
  if (typeof sourceMetadata === "string") {
    try {
      sourceMetadata = JSON.parse(sourceMetadata);
    } catch {
      throw new Error(`${path}: item ${index} metadata is not valid JSON`);
    }
  }
  if (sourceMetadata !== undefined
    && sourceMetadata !== null
    && (typeof sourceMetadata !== "object" || Array.isArray(sourceMetadata))) {
    throw new Error(`${path}: item ${index} metadata must be an object or JSON object string`);
  }
  const rawMetadata = {
    ...(sourceMetadata || {}),
    ...extras,
  };
  const strippedMetadata = stripSensitive(rawMetadata);
  const rawProvenance = {
    ...(item.provenance && typeof item.provenance === "object" && !Array.isArray(item.provenance)
      ? item.provenance
      : {}),
    input_file: String(path),
    input_index: index,
    adapter: source,
  };
  return createMemoryRecord({
    source: item.source || source,
    scope: item.scope || item.namespace || item.agentId || defaultScope,
    source_id: item.source_id ?? item.id ?? item._id ?? null,
    timestamp: item.timestamp ?? item.created_at ?? item.updated_at ?? item.createdAt ?? null,
    category: item.category || item.type || "memory",
    importance: item.importance ?? item.score ?? null,
    metadata: strippedMetadata.value,
    text,
    provenance: rawProvenance,
    redactions: strippedMetadata.redactions,
  });
}

export async function readJsonExport(path, source) {
  await requireExplicitFile(path, [".json", ".jsonl"], source);
  const items = await jsonItems(path);
  return items.map((item, index) => recordFromMapping(item, source, path, index));
}

function validatedArray(value, path, label) {
  if (!Array.isArray(value)
    || value.some((item) => !item || typeof item !== "object" || Array.isArray(item))) {
    throw new Error(`${path}: ${label} must be an array of objects`);
  }
  return value;
}

export async function readLancedbPro(path) {
  await requireExplicitFile(path, [".json", ".jsonl"], "lancedb-pro");
  if (extname(path).toLowerCase() === ".jsonl") {
    const items = await jsonItems(path);
    return items.map((item, index) => {
      if (!item.scope) throw new Error(`${path}: item ${index} is missing scope`);
      return recordFromMapping(item, "lancedb-pro", path, index);
    });
  }
  const parsed = JSON.parse(await readFile(path, "utf8"));
  let items;
  let defaultScope = "default";
  if (Array.isArray(parsed)) {
    items = validatedArray(parsed, path, "list capture");
  } else if (parsed && typeof parsed === "object" && Array.isArray(parsed.memories)) {
    if (parsed.version !== undefined && parsed.version !== "1.0") {
      throw new Error(`${path}: unsupported memory-lancedb-pro export version: ${parsed.version}`);
    }
    items = validatedArray(parsed.memories, path, "memories");
    defaultScope = parsed.filters?.scope || "default";
  } else if (parsed && typeof parsed === "object" && Array.isArray(parsed.records)) {
    items = validatedArray(parsed.records, path, "records");
    defaultScope = parsed.filters?.scope || parsed.scope || "default";
  } else {
    throw new Error(`${path}: unknown memory-lancedb-pro export envelope`);
  }
  if (parsed && !Array.isArray(parsed) && parsed.count !== undefined) {
    if (!Number.isSafeInteger(parsed.count) || parsed.count < 0 || parsed.count !== items.length) {
      throw new Error(`${path}: export count does not match record array length`);
    }
  }
  return items.map((item, index) => {
    if (!(item.scope || item.namespace || item.agentId) && defaultScope === "default") {
      throw new Error(`${path}: item ${index} is missing scope`);
    }
    return recordFromMapping(item, "lancedb-pro", path, index, { defaultScope });
  });
}

export async function readOfficialLancedbList(path) {
  await requireExplicitFile(path, [".json", ".jsonl"], "lancedb-official-list-beta");
  if (extname(path).toLowerCase() === ".jsonl") {
    const items = await jsonItems(path);
    return items.map((item, index) => {
      if (!item.agentId) throw new Error(`${path}: item ${index} is missing agentId`);
      return recordFromMapping(item, "lancedb-official-list-beta", path, index);
    });
  }
  const parsed = JSON.parse(await readFile(path, "utf8"));
  if (Array.isArray(parsed)) {
    return validatedArray(parsed, path, "list capture").map((item, index) => {
      if (!item.agentId) throw new Error(`${path}: item ${index} is missing agentId`);
      return recordFromMapping(item, "lancedb-official-list-beta", path, index);
    });
  }
  if (!parsed || typeof parsed !== "object"
    || parsed.schema_version !== 1
    || parsed.adapter !== "lancedb-official-list-beta"
    || typeof parsed.agent_id !== "string"
    || !parsed.agent_id.trim()
    || typeof parsed.openclaw_version !== "string"
    || !parsed.openclaw_version.trim()) {
    throw new Error(`${path}: invalid official LanceDB list-capture manifest`);
  }
  const items = validatedArray(parsed.records, path, "manifest records");
  if (parsed.count !== undefined
    && (!Number.isSafeInteger(parsed.count) || parsed.count < 0 || parsed.count !== items.length)) {
    throw new Error(`${path}: manifest count does not match record array length`);
  }
  return items.map((item, index) => recordFromMapping(
    item,
    "lancedb-official-list-beta",
    path,
    index,
    { defaultScope: parsed.agent_id },
  ));
}

export async function readCanonical(path) {
  await requireExplicitFile(path, [".jsonl"], "canonical-v1");
  const items = await jsonItems(path);
  return items.map((item, index) => {
    const errors = validateMemoryRecord(item);
    if (errors.length) {
      throw new Error(`${path}: canonical record ${index} is invalid: ${errors.join(", ")}`);
    }
    return item;
  });
}

function parseFrontmatter(text) {
  const match = /^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?/u.exec(text);
  if (!match) return [{}, text];
  const metadata = {};
  for (const line of match[1].split(/\r?\n/u)) {
    const colon = line.indexOf(":");
    if (colon >= 0) metadata[line.slice(0, colon).trim()] = line.slice(colon + 1).trim().replace(/^(['"])(.*)\1$/u, "$2");
  }
  return [metadata, text.slice(match[0].length)];
}

export async function readMarkdown(path, { qmd = false } = {}) {
  await requireExplicitFile(path, [".md", ".markdown", ".qmd"], qmd ? "qmd" : "markdown");
  const [frontmatter, body] = parseFrontmatter(await readFile(path, "utf8"));
  const strippedFrontmatter = stripSensitive(frontmatter);
  const sections = body.split(/^##+\s+/mu);
  const records = [];
  for (let index = 0; index < sections.length; index += 1) {
    const text = sections[index].replace(/^#\s+.*(?:\r?\n|$)/mu, "").trim();
    if (!text) continue;
    records.push(createMemoryRecord({
      source: qmd ? "qmd-markdown" : "markdown",
      scope: frontmatter.scope || "default",
      source_id: `${basename(path)}#${index}`,
      timestamp: frontmatter.timestamp || frontmatter.date || null,
      category: frontmatter.category || "memory",
      importance: frontmatter.importance ?? null,
      metadata: { frontmatter: strippedFrontmatter.value },
      text,
      provenance: { input_file: String(path), input_index: index, adapter: qmd ? "qmd" : "markdown" },
      redactions: strippedFrontmatter.redactions,
    }));
  }
  return records;
}

export async function loadRecords(adapter, paths) {
  if (!ADAPTERS.has(adapter)) throw new Error(`unknown adapter: ${adapter}`);
  const result = [];
  for (const path of paths) {
    if (adapter === "canonical-v1") result.push(...await readCanonical(path));
    else if (adapter === "markdown") result.push(...await readMarkdown(path));
    else if (adapter === "qmd") result.push(...await readMarkdown(path, { qmd: true }));
    else if (adapter === "lancedb-pro") result.push(...await readLancedbPro(path));
    else result.push(...await readOfficialLancedbList(path));
  }
  return result;
}
