# Architecture

## Runtime choice

The distributable CLI uses zero-dependency Node.js ESM and Node's built-in test
runner. OpenClaw already requires Node, so this avoids adding Python or native
package installation to a sensitive migration workflow.

The CLI does not load OpenClaw as a library. It transforms explicit local
exports and generates evidence. Version-sensitive OpenClaw commands remain in
the Skill orchestration layer and must be capability-detected.

## OpenClaw migration-provider integration

OpenClaw 2026.9.x exposes a plugin migration contract through
`api.registerMigrationProvider(...)`. Core owns preview/apply orchestration,
verified pre-apply backup, conflict handling, secret prompts, reports, and
non-interactive confirmation rules.

The release sequence therefore has two layers:

1. v0.1 ships the local transformation/audit CLI and owner-invoked Skill. It
   proves adapter behavior without requiring a plugin install.
2. A later package registers backend-specific migration providers and maps the
   same canonical plans into OpenClaw migration items. It delegates backup,
   prompts, conflicts, and reports to core instead of reimplementing them.

Provider apply must consume the reviewed plan passed by core. Deferred effects
must be explicitly declared retry-safe and idempotent. Unknown OpenClaw
versions or provider contracts fail closed.

## Boundaries

```text
explicit source files
        |
        v
source adapter -> MemoryRecord v1 JSONL -> audit
                                         |
                                         v
                              staged memory-core Markdown
```

The source adapter boundary is intentionally narrow:

- no live opaque database parsing;
- no network access;
- no vector retention;
- no OpenClaw SQLite writes;
- no plugin installation or slot changes.

## Canonical record

MemoryRecord v1 stores:

- source and source scope;
- source ID, when exposed;
- normalized timestamp;
- category and importance;
- sanitized metadata;
- canonical text and SHA-256;
- provenance identifying adapter, input, and position.

Secret-like keys and vector/embedding fields are removed recursively and
reported. The original export remains the recovery authority.

## Determinism

Given the same input bytes and CLI options:

- record order is stable;
- canonical hashes are stable;
- JSON keys are serialized consistently;
- audit groups use stable indices/keys;
- rendered filenames and content are stable.

Run-state timestamps and approval nonces are intentionally non-deterministic.

## Approval model

The CLI can issue and consume one-use tokens bound to an exact action and run
ID. This prevents accidental cross-run reuse, but possession of the state file
still grants local authority. OpenClaw owner authentication and chat-type
checks belong to the Skill/operator layer.

The token primitive is a safety interlock, not an authorization server.

## Future cutover driver

A later reviewed driver may execute OpenClaw actions, but only through an
explicit command plan generated from capability discovery. It must:

- hash current configuration before and immediately before replacement;
- discover the real service owner;
- survive Gateway restart outside its cgroup;
- implement automatic runtime-health rollback;
- never broaden capability consent;
- preserve source data and new daily Markdown.
