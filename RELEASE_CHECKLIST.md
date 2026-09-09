# Release checklist

## Code

- [ ] Tests pass on supported Node versions and Windows/Linux/macOS.
- [x] Synthetic fixtures contain no real user or infrastructure data.
- [x] Every structured adapter fails closed on unknown envelope/schema.
- [ ] CLI help and README commands match.
- [x] Dry-run creates no migration output.
- [x] No operation writes OpenClaw SQLite internals.

## Safety

- [x] Security review covers path traversal, symlinks, secrets, subprocesses,
      approval reuse, state-file permissions, and rollback.
- [x] Backup gate requires exit zero, `verified:true`, exact archive path, and
      SHA verification.
- [x] Production actions require action/run-bound approval.
- [x] Skill requires reports outside indexed memory roots.
- [x] Real exports and run reports are ignored by Git.

## Compatibility

- [x] Each stable adapter has a documented source version and fixture.
- [x] LanceDB Pro scope/limit behavior is capability-detected.
- [x] Official LanceDB beta limitations are prominent.
- [x] QMD support is based on authoritative Markdown or an official provider.
- [x] memory-core render never overwrites `MEMORY.md`.

## Evidence

- [x] Record totals and source IDs reconcile for every fixture.
- [x] Duplicate audit is deterministic.
- [x] Benchmark format and methodology are documented.
- [ ] At least one independent dry run has been reviewed.
- [x] Case-study claims have owner approval.
- [x] Interruption tests prove safe restart without duplicate amplification.
- [ ] Release evidence bundle includes CI results, fixture manifest, command
      transcript, hashes, SBOM, signed tag, and rollback demonstration.

## Content

- [x] English and Chinese READMEs agree.
- [x] ClawHub listing matches actual support.
- [x] No “lossless”, “zero downtime”, “one click”, or recall-improvement claim
      appears without scoped evidence.
- [x] Screenshots/demo use synthetic data.

## External release gates

- [x] Maintainer approves public repository creation/push.
- [x] Maintainer approves ClawHub publication under MIT-0 platform terms.
- [ ] Maintainer approves each community post.
- [ ] Security contact or advisory channel is configured.
