import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile, mkdir, access, readdir, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import {
  auditRecords,
  createMemoryRecord,
  loadRecords,
  normalizeTimestamp,
  portabilityErrors,
  preflightPaths,
  readMarkdown,
  renderMemoryCore,
  RunState,
  validateMemoryRecord,
  writeJsonl,
  writeMemoryCore,
} from "../lib/index.js";
import { main } from "../lib/cli.js";

const here = dirname(fileURLToPath(import.meta.url));
const fixtures = join(here, "fixtures");

async function temporaryDirectory() {
  return mkdtemp(join(tmpdir(), "openclaw-migrator-"));
}

function capture() {
  let value = "";
  return {
    stream: { write(chunk) { value += String(chunk); } },
    get value() { return value; },
  };
}

test("LanceDB Pro normalization strips recursive secrets and vectors with counts", async () => {
  const [record] = await loadRecords("lancedb-pro", [join(fixtures, "lancedb-pro.json")]);
  assert.equal(record.source_id, "7");
  assert.equal(record.text, "Remember the hatch code");
  assert.equal(record.timestamp, "2023-11-14T22:13:20.000Z");
  assert.equal(record.importance, 0.8);
  assert.deepEqual(record.metadata, { topic: "ops", nested: { safe: true } });
  assert.deepEqual(record.provenance.redactions, { secret_keys: 2, vector_keys: 2, total: 4 });
  assert.deepEqual(validateMemoryRecord(record), []);
  const serialized = JSON.stringify(record);
  for (const forbidden of ["embedding", "api_token", "password", "\"vector\""]) {
    assert.equal(serialized.includes(forbidden), false);
  }
});

test("LanceDB Pro rejects malformed metadata instead of dropping it silently", async () => {
  const root = await temporaryDirectory();
  const source = join(root, "bad-metadata.json");
  await writeFile(source, JSON.stringify({
    memories: [{ id: "bad", text: "keep me", scope: "global", metadata: "{not-json" }],
  }));
  await assert.rejects(loadRecords("lancedb-pro", [source]), /metadata is not valid JSON/);
});

test("official LanceDB beta requires scoped list-capture evidence", async () => {
  const records = await loadRecords("lancedb-official-list-beta", [join(fixtures, "official-manifest.json")]);
  assert.deepEqual(records.map((record) => record.text), ["one", "two"]);
  assert.equal(records[0].scope, "main");
  assert.equal(records[0].timestamp, "2023-11-14T22:13:20.000Z");
  const root = await temporaryDirectory();
  await assert.rejects(loadRecords("lancedb-official-list-beta", [root]), /explicit/);
  const unscoped = join(root, "unscoped.json");
  await writeFile(unscoped, '[{"id":"a","text":"one"}]');
  await assert.rejects(loadRecords("lancedb-official-list-beta", [unscoped]), /missing agentId/);
  const unknown = join(root, "unknown.json");
  await writeFile(unknown, '{"records":[{"id":"a","text":"one"}]}');
  await assert.rejects(loadRecords("lancedb-official-list-beta", [unknown]), /invalid official/);
});

test("LanceDB Pro rejects unknown and count-mismatched export envelopes", async () => {
  const root = await temporaryDirectory();
  const unknown = join(root, "unknown.json");
  await writeFile(unknown, '{"data":[{"id":"a","text":"one","scope":"global"}]}');
  await assert.rejects(loadRecords("lancedb-pro", [unknown]), /unknown memory-lancedb-pro/);
  const truncated = join(root, "truncated.json");
  await writeFile(truncated, JSON.stringify({
    version: "1.0",
    count: 2,
    memories: [{ id: "a", text: "one", scope: "global" }],
  }));
  await assert.rejects(loadRecords("lancedb-pro", [truncated]), /count does not match/);
});

test("Markdown and QMD preserve sections while redacting frontmatter", async () => {
  const records = await readMarkdown(join(fixtures, "notes.qmd"), { qmd: true });
  assert.equal(records.length, 2);
  assert.equal(records[0].source, "qmd-markdown");
  assert.equal(records[0].scope, "team");
  assert.equal(records[0].timestamp, "2026-09-08T00:00:00.000Z");
  assert.equal(records[0].provenance.redactions.secret_keys, 1);
  assert.equal(JSON.stringify(records[0]).includes("hidden"), false);
});

test("timestamp normalization supports seconds, milliseconds, dates, and invalid passthrough", () => {
  assert.equal(normalizeTimestamp(1_700_000_000), "2023-11-14T22:13:20.000Z");
  assert.equal(normalizeTimestamp(1_700_000_000_000), "2023-11-14T22:13:20.000Z");
  assert.equal(normalizeTimestamp("2026-09-08"), "2026-09-08T00:00:00.000Z");
  assert.equal(normalizeTimestamp("unknown"), "unknown");
});

test("audit is deterministic and bounds approximate comparisons", () => {
  const records = [
    createMemoryRecord({ source: "x", source_id: "same", text: "The quick brown fox" }),
    createMemoryRecord({ source: "x", source_id: "same", text: "The quick brown fox" }),
    createMemoryRecord({ source: "x", text: "The quick brown fox." }),
    createMemoryRecord({ source: "x", source_id: "z", text: "Entirely different" }),
  ];
  const report = auditRecords(records, { approximateThreshold: 0.9, maxComparisons: 2 });
  assert.equal(report.missing_source_ids, 1);
  assert.deepEqual(report.duplicate_source_ids, ["same"]);
  assert.deepEqual(report.exact_text_duplicates, [[0, 1]]);
  assert.equal(report.approximate_comparisons.performed, 2);
  assert.equal(report.approximate_comparisons.truncated, true);
  assert.deepEqual(report, auditRecords(records, { approximateThreshold: 0.9, maxComparisons: 2 }));
});

test("JSONL writer emits canonical records", async () => {
  const root = await temporaryDirectory();
  const output = join(root, "records.jsonl");
  const records = [createMemoryRecord({ source: "x", source_id: "1", text: "hello" })];
  assert.equal(await writeJsonl(records, output), 1);
  const parsed = JSON.parse((await readFile(output, "utf8")).trim());
  assert.equal(parsed.schema_version, 1);
  assert.equal(parsed.content_hash.length, 64);
  const [reloaded] = await loadRecords("canonical-v1", [output]);
  assert.deepEqual(reloaded, records[0]);
  await assert.rejects(writeJsonl(records, output), /EEXIST/);
  const tampered = { ...parsed, text: "changed after hashing" };
  await writeFile(output, `${JSON.stringify(tampered)}\n`);
  await assert.rejects(loadRecords("canonical-v1", [output]), /content_hash does not match/);
});

test("memory-core rendering creates durable and dated files without MEMORY.md", async () => {
  const root = await temporaryDirectory();
  const output = join(root, "staged-memory");
  const memory = join(root, "MEMORY.md");
  await writeFile(memory, "keep me\n");
  const records = [
    createMemoryRecord({ source: "x", category: "preference", text: "Use concise replies." }),
    createMemoryRecord({ source: "x", category: "daily", timestamp: "2026-09-08", text: "Shipped it." }),
    createMemoryRecord({
      source: "x",
      category: "fact",
      importance: 0.5,
      timestamp: "2026-09-08",
      text: "Observed during migration.",
    }),
  ];
  assert.deepEqual(Object.keys(renderMemoryCore(records)).sort(), ["2026-09-08.md", "durable.md"]);
  assert.deepEqual(await writeMemoryCore(records, output), ["2026-09-08.md", "durable.md"]);
  assert.match(await readFile(join(output, "durable.md"), "utf8"), /Use concise replies/);
  assert.match(await readFile(join(output, "2026-09-08.md"), "utf8"), /Shipped it/);
  assert.match(await readFile(join(output, "2026-09-08.md"), "utf8"), /Observed during migration/);
  assert.match(await readFile(join(output, "durable.md"), "utf8"), /content_hash/);
  assert.match(await readFile(join(output, "2026-09-08.md"), "utf8"), /source_id/);
  assert.equal(await readFile(memory, "utf8"), "keep me\n");
  assert.equal((await readdir(root)).some((name) => name.startsWith(".staged-memory.")), false);
  await assert.rejects(writeMemoryCore(records, output), /overwrite existing render output/);
  await assert.rejects(writeMemoryCore(records, join(root, "MEMORY.md")), /MEMORY\.md/);
});

test("interrupted render is unpublished, cleaned, and safely restartable", async () => {
  const root = await temporaryDirectory();
  const output = join(root, "interrupted-render");
  const records = [
    createMemoryRecord({ source: "x", category: "preference", text: "durable" }),
    createMemoryRecord({
      source: "x",
      category: "daily",
      timestamp: "2026-09-08",
      text: "daily",
    }),
  ];
  await assert.rejects(writeMemoryCore(records, output, {
    onFileWritten({ completed }) {
      if (completed === 1) throw new Error("simulated interruption");
    },
  }), /simulated interruption/);
  await assert.rejects(access(output));
  assert.equal((await readdir(root)).some((name) => name.startsWith(".interrupted-render.")), false);
  assert.deepEqual(await writeMemoryCore(records, output), ["2026-09-08.md", "durable.md"]);
  const markers = (await Promise.all(
    (await readdir(output)).map((name) => readFile(join(output, name), "utf8")),
  )).join("").match(/<!-- openclaw-memory-migrator /gu);
  assert.equal(markers.length, records.length);
});

test("portability preflight detects colon, backslash, traversal, files, and MEMORY.md", async () => {
  assert.ok(portabilityErrors("bad:name.json").some((error) => error.includes("colon")));
  assert.ok(portabilityErrors("folder\\file.json").some((error) => error.includes("backslash")));
  assert.ok(portabilityErrors("../escape.json").some((error) => error.includes("traversal")));
  const root = await temporaryDirectory();
  const folder = join(root, "folder");
  await mkdir(folder);
  const errors = await preflightPaths([folder, join(root, "missing.json")], join(root, "MEMORY.md"));
  assert.ok(errors.some((error) => error.includes("explicit file")));
  assert.ok(errors.some((error) => error.includes("does not exist")));
  assert.ok(errors.some((error) => error.includes("MEMORY.md")));
});

test("preflight rejects symbolic-link inputs and render outputs", async (context) => {
  const root = await temporaryDirectory();
  const source = join(root, "source.json");
  const inputLink = join(root, "input-link.json");
  const outputTarget = join(root, "output-target");
  const outputLink = join(root, "output-link");
  const parentLink = join(root, "parent-link");
  await writeFile(source, "[]");
  await mkdir(outputTarget);
  try {
    await symlink(source, inputLink, "file");
    await symlink(outputTarget, outputLink, "dir");
    await symlink(outputTarget, parentLink, "dir");
  } catch (error) {
    if (error.code === "EPERM" || error.code === "EACCES") {
      context.skip("symbolic links require additional privileges on this platform");
      return;
    }
    throw error;
  }
  const errors = await preflightPaths([inputLink], outputLink, { outputKind: "directory" });
  assert.ok(errors.some((error) => error.includes("input must not be a symbolic link")));
  assert.ok(errors.some((error) => error.includes("render output must not be a symbolic link")));
  const parentErrors = await preflightPaths([source], join(parentLink, "records.jsonl"));
  assert.ok(parentErrors.some((error) => error.includes("output parent must not be a symbolic link")));
});

test("run-state persists atomically and approvals are one-use/action/run bound", async () => {
  const root = await temporaryDirectory();
  const path = join(root, "state.json");
  const state = await RunState.create(path, "run-1");
  const token = await state.issueApproval("normalize:/out.jsonl");
  const reloaded = await RunState.load(path);
  await assert.rejects(reloaded.consumeApproval("render:/out", token), /invalid/);
  await reloaded.consumeApproval("normalize:/out.jsonl", token);
  await assert.rejects(reloaded.consumeApproval("normalize:/out.jsonl", token), /invalid/);
  await reloaded.completeStep("normalize", { records: 2 });
  assert.equal((await RunState.load(path)).isComplete("normalize"), true);
  assert.equal((await readFile(path, "utf8")).includes(token), false);
});

test("CLI is dry-run by default and apply requires an exact approval", async () => {
  const root = await temporaryDirectory();
  const source = join(root, "input.json");
  const output = join(root, "canonical.jsonl");
  const statePath = join(root, "state.json");
  await writeFile(source, '[{"id":"1","text":"hello","scope":"global"}]');
  const args = ["normalize", "--adapter", "lancedb-pro", "--input", source, "--output", output];
  const stdout = capture();
  const stderr = capture();
  assert.equal(await main(args, { stdout: stdout.stream, stderr: stderr.stream }), 0);
  await assert.rejects(access(output));
  const dryRun = JSON.parse(stdout.value);
  const state = await RunState.create(statePath, "cli-run");
  const token = await state.issueApproval(dryRun.approval_action);
  const applied = capture();
  assert.equal(await main([...args, "--apply", "--state", statePath, "--approval", token], {
    stdout: applied.stream,
    stderr: stderr.stream,
  }), 0);
  assert.equal(JSON.parse((await readFile(output, "utf8")).trim()).schema_version, 1);
});

test("CLI help and version are successful and side-effect free", async () => {
  for (const [args, expected] of [
    [["--help"], /Usage: openclaw-memory-migrator/],
    [["--version"], /^0\.1\.0-rc\.1/m],
  ]) {
    const stdout = capture();
    const stderr = capture();
    assert.equal(await main(args, { stdout: stdout.stream, stderr: stderr.stream }), 0);
    assert.match(stdout.value, expected);
    assert.equal(stderr.value, "");
  }
});
