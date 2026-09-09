# Compatibility policy

Support is based on detected capabilities, not version strings alone.

## Source adapters

### memory-lancedb-pro

Status: stable for version-gated JSON capture.

- Discover scopes and counts with the installed plugin's stats command.
- Read `memory-pro export --help` before composing commands.
- Export every non-empty scope independently.
- `memory-lancedb-pro` v1.1.0-beta.10 export fetches at most 1,000 rows.
- If a scope exceeds the installed export limit, paginate
  `memory-pro list --scope <scope> --limit <n> --offset <n> --json` and wrap
  the pages in an adapter-owned manifest. Do not call that artifact an official
  plugin export.
- Reconcile export totals against a fresh stats snapshot.
- Preserve source IDs, scope, category, importance, timestamps, and metadata.
- In v1.1.0-beta.10, `metadata` is a JSON string and timestamp is epoch
  milliseconds. Invalid metadata is a hard error, not a silent empty object.

Do not parse the live LanceDB directory when a supported export is available.

Verified reference:
[`memory-lancedb-pro` CLI at 6349567](https://github.com/CortexReach/memory-lancedb-pro/blob/63495671fde55f2c8e3d6eb95267381d1889cca9/cli.ts#L649-L1034).

### Official memory-lancedb

Status: beta, captured `ltm list` JSON only.

OpenClaw 2026.9.1–2026.9.3 exposes `openclaw ltm list`, `search`, `query`, and
`stats`, but no import/export command. Capture `ltm list` separately for every
agent and wrap each JSON array in an adapter-owned manifest:

```json
{
  "schema_version": 1,
  "adapter": "lancedb-official-list-beta",
  "openclaw_version": "2026.9.3",
  "plugin_version": "2026.9.3",
  "agent_id": "main",
  "captured_at": "2026-09-09T00:00:00.000Z",
  "count": 0,
  "records": []
}
```

The manifest is required because `ltm list` records do not include the agent
ID. A raw array is accepted only when every record has an explicit `agentId`.
Opaque database parsing is deliberately unsupported because schema and
embedding storage can change.

Verified reference:
[`memory-lancedb` CLI at 1391f7c](https://github.com/openclaw/openclaw/blob/1391f7cd2d40ab5bbcf2f5f831d3a64f520e72d7/extensions/memory-lancedb/memory-cli.ts#L107-L233).

### QMD

Status: stable for Markdown-authoritative migrations only.

QMD indexes are derived state. Locate the configured Markdown roots, inventory
them from QMD configuration, and normalize those files. QMD 2.8.3 has no corpus
export/import command; search JSON is not a complete export. OpenClaw 2026.9.x
retired its QMD backend and migrates legacy settings through `doctor --fix`.
Wrap that official path with backup and evidence rather than re-enabling QMD
configuration. Never migrate `index.sqlite` or claim support based on a guessed
collection name.

Verified references:
[`QMD` CLI at facd35e](https://github.com/tobi/qmd/blob/facd35e01359e59d938bc9418e93fb9318addee3/src/cli/qmd.ts#L3567-L3601)
and [OpenClaw retired-QMD migration](https://github.com/openclaw/openclaw/blob/1391f7cd2d40ab5bbcf2f5f831d3a64f520e72d7/src/commands/doctor/shared/legacy-config-migrations.runtime.retired-memory-qmd.ts#L92-L205).

### Markdown

Status: stable.

Preserve source-relative path, headings, text, and dates where available.
Never rewrite or merge an existing root `MEMORY.md` automatically.

## Target

### memory-core

Status: stable through staged Markdown plus official indexing commands.

- Render imports beneath a dedicated `memory/imports/<source>/` directory.
- Configure provider/model/tokenizer through OpenClaw configuration.
- Treat SQLite FTS/vector tables and embedding caches as derived state.
- Rebuild with the installed OpenClaw CLI.
- Validate every configured agent separately.

## Explicit non-support

- Copying vectors between embedding spaces.
- Writing directly into memory-core SQLite tables.
- Reading a live opaque LanceDB directory without a documented export.
- Automatic deletion or mutation-based deduplication.
- Simultaneous ownership of the single memory plugin slot.
- Guaranteed equivalence of smart extraction, auto-recall, active memory, or
  dreaming behavior across backends.

## Compatibility evidence

Record the following in every run:

- OpenClaw core version and commit, when available
- source plugin package and build version
- exact CLI help used for capability detection
- source export schema fingerprint
- target provider, model, dimensions, tokenizer, and chunking identity
- operating system, service owner, agents, scopes, and workspaces

A version is promoted from beta to stable only after synthetic tests and at
least two independent real-world dry runs complete without undocumented schema
assumptions.
