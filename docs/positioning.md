# Product positioning

## Category

OpenClaw memory migration and verification toolkit.

It is not a memory backend, sync service, or hosted memory store.

## Positioning statement

For self-hosted OpenClaw operators who need to change memory backends without
trusting an opaque one-off script, OpenClaw Memory Migrator turns source memory
into an inspectable manifest, reconciles every record it can identify, stages
memory-core content, and requires proof before cutover and retirement.

Unlike backend plugins or manual copy guides, it couples conversion with
approval gates, recall benchmarks, and a prepared rollback.

## Message hierarchy

1. No silent loss
   - Counts, source IDs, content hashes, scopes, and rejected rows are explicit.
2. No blind cutover
   - Dry-run, verified backup, run-bound approvals, and environment drift checks.
3. No unverifiable “success”
   - Compare recall and channel health before retiring the source.
4. No vector lock-in
   - Move authoritative text; rebuild derived embeddings in memory-core.

## Bilingual identity

English headline:

> Move the memory. Keep the proof.

Chinese headline:

> 迁移记忆，不迁移风险。

Technical descriptor:

> A safety-gated migration toolkit for OpenClaw memory-core.

> 面向 OpenClaw memory-core 的安全门控迁移工具。

## Claims allowed for v0.1

- Local-first and open source.
- Does not write old vectors into memory-core SQLite.
- Produces versioned JSONL, Markdown, and audit reports.
- Detects count, ID, exact-text, and approximate-text duplication.
- Binds approvals to a run and action.
- Supports documented export files for named adapters.

## Claims requiring evidence before use

- “Lossless”: only valid for a fixture/run whose source fields and counts fully
  reconcile; otherwise say “no silent loss”.
- “Zero downtime”: depends on service owner, indexing, plugin behavior, and
  channel reconnect time.
- “Supports all OpenClaw versions”: never use.
- “Improves recall”: migration can improve or reduce retrieval; report measured
  results instead.
- “One click”: conflicts with the operator-review safety model.

## Initial proof points

An anonymized originating case may state, after owner approval:

- more than 1,500 source records reconciled;
- multiple scopes and two agents;
- eight-query recall gate;
- seven-day soak;
- source backend retained cold for rollback.

Do not publish host, channel identifiers, personal memories, provider keys,
exact private paths, or raw evaluation queries without review.

## Roadmap narrative

- v0.1: prove export, normalization, audit, rendering, and approval contracts.
- v0.2: expand tested source compatibility and benchmark automation.
- v0.3: add operator-reviewed cutover drivers and richer rollback automation.
- Later: integrate upstream native migration providers instead of duplicating
  core behavior.
