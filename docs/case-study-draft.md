# Case study draft: from LanceDB Pro to memory-core

Publication status: private draft. Owner review required before release.

## Situation

A self-hosted OpenClaw deployment used a third-party LanceDB memory plugin,
automatic extraction/recall, and a separate dreaming workflow across multiple
messaging channels and agents. Plugin compatibility during a core upgrade made
long-term maintenance risk more important than retaining backend-specific
features.

## Migration shape

- more than 1,500 source records across multiple scopes;
- existing `MEMORY.md` plus daily Markdown assets;
- staged export into canonical records and reviewable Markdown;
- one memory slot, so “parallel” validation kept the source in production while
  preparing target artifacts;
- an eight-query recall gate before and after cutover;
- a soak period before plugin retirement;
- cold source data retained for rollback.

## What went wrong

The migration itself reconciled source IDs, but later retrieval testing exposed
large groups of repeated historical content. One operational rule appeared in
many daily and dreaming artifacts, pushing the authoritative `MEMORY.md` chunk
outside a limited candidate pool.

The correct lesson is not “memory-core was broken.” Storage, embeddings, and
the vector index were healthy. Corpus duplication plus candidate truncation
made one ambiguous query miss the authoritative record.

## Resolution

A minimal, semantically specific heading improved vector distinguishability
and restored the query to rank one. A separate read-only duplicate audit
documented the wider corpus debt without deleting history.

## Product lessons

1. Record count equality is necessary but not sufficient.
2. Source provenance must survive conversion.
3. Duplicate auditing belongs before recall acceptance.
4. Recall baselines need semantic variants, not only exact command strings.
5. Evaluation reports must stay outside indexed memory.
6. Cutover, promotion, and retirement need separate approvals.
7. Backup success requires archive verification, not file existence.

## Evidence that may be published after approval

- exact source/canonical ID reconciliation;
- anonymized duplicate-group distribution;
- before/after recall rank and score;
- soak duration and channel test count;
- sanitized phase timeline.

Do not publish personal queries, channel identifiers, IP addresses, credentials,
private paths, raw memory text, or backup hashes.
