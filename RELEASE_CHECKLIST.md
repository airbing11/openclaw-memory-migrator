# Release checklist

## Code

- [ ] Tests pass on supported Node versions and Windows/Linux/macOS.
- [ ] Synthetic fixtures contain no real user or infrastructure data.
- [ ] Every adapter fails closed on unknown schema.
- [ ] CLI help and README commands match.
- [ ] Dry-run creates no migration output.
- [ ] No operation writes OpenClaw SQLite internals.

## Safety

- [ ] Security review covers path traversal, symlinks, secrets, subprocesses,
      approval reuse, state-file permissions, and rollback.
- [ ] Backup gate requires exit zero, `verified:true`, exact archive path, and
      SHA verification.
- [ ] Production actions require action/run-bound approval.
- [ ] Reports default outside indexed memory roots.
- [ ] Real exports and run reports are ignored by Git.

## Compatibility

- [ ] Each stable adapter has a documented source version and fixture.
- [ ] LanceDB Pro scope/limit behavior is capability-detected.
- [ ] Official LanceDB beta limitations are prominent.
- [ ] QMD support is based on authoritative Markdown or an official provider.
- [ ] memory-core render never overwrites `MEMORY.md`.

## Evidence

- [ ] Record totals and source IDs reconcile for every fixture.
- [ ] Duplicate audit is deterministic.
- [ ] Benchmark format and methodology are documented.
- [ ] At least one independent dry run has been reviewed.
- [ ] Case-study claims have owner approval.
- [ ] Interruption tests prove safe restart without duplicate amplification.
- [ ] Release evidence bundle includes CI results, fixture manifest, command
      transcript, hashes, SBOM, signed tag, and rollback demonstration.

## Content

- [ ] English and Chinese READMEs agree.
- [ ] ClawHub listing matches actual support.
- [ ] No “lossless”, “zero downtime”, “one click”, or recall-improvement claim
      appears without scoped evidence.
- [ ] Screenshots/demo use synthetic data.

## External release gates

- [ ] Maintainer approves public repository creation/push.
- [ ] Maintainer approves ClawHub publication.
- [ ] Maintainer approves each community post.
- [ ] Security contact or advisory channel is configured.
