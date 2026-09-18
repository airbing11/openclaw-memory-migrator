# Changelog

## 0.1.0-rc.2

- Added complete/incomplete approximate-audit reporting, coverage, stderr
  warnings, and an opt-in strict completeness gate.
- Added per-input and aggregate parsed/accepted/skipped/rejected, envelope, and
  redaction accounting while preserving `loadRecords()`.
- Added exact `--expected-total` reconciliation.
- Added structured errors with actionable recovery guidance and clean
  stdout/stderr separation.
- Added bilingual FAQ and operator recipes plus bounded 2026-09-18 dogfood
  evidence.
- Clarified rollback readiness versus rehearsal and target health checks versus
  paired recall baselines.
- Added release tests and package checks for reviewable, unminified source.

## 0.1.0-rc.1

- Added zero-dependency Node.js CLI.
- Added MemoryRecord v1 canonical JSONL and schema.
- Added LanceDB Pro, Markdown/QMD, canonical, and beta official-LanceDB file
  adapters.
- Added recursive secret/vector-field redaction accounting.
- Added deterministic count, ID, exact duplicate, and bounded approximate
  duplicate audits.
- Added memory-core durable/daily Markdown rendering with provenance markers.
- Added one-use, action/run-bound approval interlocks.
- Added path portability checks, symbolic-link rejection, no-overwrite writes,
  atomic render-directory publication, and pre-publish output-ancestor identity
  revalidation with canonical handling for macOS system symlink ancestors.
- Added versioned official LanceDB list-capture manifests and Pro
  envelope/count validation.
- Added sanitized 1,533-record Linux dogfood evidence.
- Added synthetic tests, bilingual documentation, market research, and launch
  drafts.

Production cutover automation is intentionally not included in this release
candidate.
