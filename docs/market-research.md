# Market research: OpenClaw memory migration

Research date: 2026-09-09

## Executive finding

OpenClaw has an active market for stronger memory backends, but no discoverable
open-source project is focused on safely migrating multiple existing backends
into `memory-core` with count reconciliation, approval gates, rollback, and
recall evidence.

The opportunity is narrow but credible: do not compete with memory plugins on
retrieval quality. Become the trusted migration and verification layer between
them.

## Verified signals

### A large third-party backend footprint

[`CortexReach/memory-lancedb-pro`](https://github.com/CortexReach/memory-lancedb-pro)
had 4,457 GitHub stars and 731 forks when checked on 2026-09-09. This is a
strong adoption proxy for users who may later need to upgrade, switch, or
recover memory backends. Stars are not active-install or revenue figures.

### Migration remains a product gap

GitHub repository search for `openclaw memory migration` returned no direct
project on 2026-09-09. OpenClaw issue
[#45993](https://github.com/openclaw/openclaw/issues/45993) requested
cross-platform export/import. It closed as stale on 2026-08-23, but its
maintainer review still identified unresolved product decisions:

- secret inclusion and redaction;
- path and symlink safety;
- state compatibility;
- merge versus replace behavior;
- explicit operator approval and rollback.

This project should not claim that OpenClaw has no migration facilities.
OpenClaw provides backup/restore and registered migration providers; the gap is
a backend-focused, multi-source memory cutover workflow.

OpenClaw's [`migrate` CLI](https://docs.openclaw.ai/cli/migrate) is
preview-first and supports plugin-owned providers. Core owns verified
pre-apply backup, conflict refusal, secret prompts, JSON reports, and
non-interactive confirmation. A plugin declares provider IDs and calls
`api.registerMigrationProvider(...)`. This gives the project a credible
upstream integration route after standalone adapters are proven.

### Official backup semantics support a proof-first product

OpenClaw's [backup documentation](https://docs.openclaw.ai/install/backups)
states that live SQLite files must not be copied directly. Its supported backup
paths use online SQLite backup, manifest validation, explicit restore staging,
and sensitive-data handling. These constraints reinforce the product's
verified-backup gate and refusal to modify internal SQLite tables.

### Benchmarking exists but is early

[`phenomenoner/openclaw-memory-bench`](https://github.com/phenomenoner/openclaw-memory-bench)
had 3 stars on 2026-09-09. It demonstrates demand for Recall@K, MRR, nDCG, and
latency measurement, but not broad adoption. Compatibility with its metrics is
useful; a hard dependency would add risk without clear distribution benefit.

### Adjacent products validate persistent-memory demand

Mem0, OpenMemo, MemoryVault, Markdown-first hybrid stacks, QMD, and LanceDB
plugins address storage and retrieval. They are adjacent systems rather than
direct migration competitors. Their existence validates user interest while
leaving backend transition safety fragmented.

## User segments

1. Self-hosted operators after an OpenClaw upgrade
   - Trigger: plugin incompatibility, backend deprecation, provider change.
   - Need: a guided, recoverable cutover without memory vacuum.
   - Barrier: fear of exposing private memories or breaking messaging channels.

2. Consultants and plugin maintainers
   - Trigger: repeated customer migrations across heterogeneous hosts.
   - Need: deterministic manifests, capability detection, and audit reports.
   - Barrier: unsupported schema variations and liability for data loss.

3. Multi-agent operations teams
   - Trigger: agent isolation, scope drift, or embedding-space migration.
   - Need: per-agent reconciliation and benchmark evidence.
   - Barrier: credentials, personal data, and downtime controls.

## Competitive position

### What alternatives do well

- Backend plugins improve storage, recall, extraction, or sharing.
- Official backup protects whole-state recovery.
- Benchmark tools measure retrieval.
- Manual guides can solve one known environment.

### Unoccupied combination

OpenClaw Memory Migrator combines:

- source capability detection;
- versioned text-first interchange;
- count/ID/hash reconciliation;
- report-only duplicate analysis;
- verified backup and run-bound approvals;
- staged memory-core rendering;
- recall comparison and rollback evidence.

The defensible asset is not a converter script. It is the compatibility corpus,
failure fixtures, and safety contract accumulated across releases.

Longer term, source adapters should become OpenClaw migration providers while
the Skill remains the guided operator experience. Competing with the official
orchestrator would add risk without differentiation.

## Adoption risks

- Trust: memory exports can contain deeply personal data.
  - Default local-only processing; no telemetry; explicit secret checks.
- Compatibility: plugin CLIs and schemas change.
  - Detect help/schema; fail closed; publish a tested compatibility matrix.
- Scope: supporting every pair of backends would overwhelm v0.1.
  - Keep memory-core as the only initial target.
- Expectations: users may assume feature equivalence after migration.
  - Explain that extraction, auto-recall, scope, reranking, and dreaming differ.
- Core convergence: OpenClaw may eventually ship native migration.
  - Position the project as adapters, audits, and proof tooling that can wrap
    official migration providers rather than replace them.

## Distribution

Primary:

- GitHub repository and releases
- ClawHub Skill listing
- OpenClaw community and relevant GitHub discussions

Chinese launch:

- 知乎/微信公众号 case-study article
- V2EX and 掘金 technical posts
- Bilibili walkthrough
- Gitee mirror after GitHub release stabilizes

International launch:

- Hacker News Show HN
- relevant OpenClaw community and Reddit
- short X/LinkedIn engineering thread

Do not post until install instructions, synthetic fixtures, security policy,
and one independently repeatable dry run are available.

## Search language

English:

- OpenClaw memory migration
- migrate LanceDB to memory-core
- OpenClaw memory backup and restore
- OpenClaw memory deduplication
- QMD to memory-core

Chinese:

- OpenClaw 记忆迁移
- LanceDB 迁移 memory-core
- OpenClaw 记忆备份恢复
- OpenClaw 记忆去重
- QMD 切换内置记忆

Use “memory” in English metadata. Chinese copy should use “记忆”, not the
literal software-memory translation “内存”.

## Evidence limitations

- No reliable total-addressable-market or install-count dataset was found.
- GitHub stars/forks are interest proxies, not active users.
- Community posts and issues overrepresent users with failures.
- The originating production case is one environment and must not be presented
  as a universal success rate.

The next meaningful market evidence should come from five to ten structured
operator interviews and anonymized dry-run manifests from distinct setups.
