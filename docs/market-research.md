# Market research: OpenClaw memory migration

Research date: 2026-11-11
Previous baseline: 2026-09-09

## Executive finding

The niche remains credible: become the trusted migration and verification layer
into `memory-core`, not another retrieval backend. Since September, three shifts
matter:

1. Official memory-core is more clearly positioned as the core search/recall
   path, with supported doctor migration from QMD and `memory-wiki` as a
   companion layer.
2. Marketing and blogs more often pull operators **toward** LanceDB Pro, so
   reverse traffic exists beside the original “return to official” path.
3. Adjacent migrators appeared, mostly **outbound** from OpenClaw or
   multi-ecosystem converters. Evidence-first Pro→core cutover is still thin.

## Verified signals (2026-11-11)

### Channel funnel for this project

| Channel | Metric |
| --- | --- |
| ClawHub `memory-core-migrator` | 459 downloads, 3 installs, latest `0.1.0-rc.2` |
| SkillHub `openclaw-memory-migrator` | 131 downloads, 0 installs, public `1.0.3` |
| GitHub | 1 star, 0 forks, no anonymized dry-run Issue reports |

Downloads grew after rc.2 while installs barely moved. The primary gap is
install → first successful dry-run, not pure discovery.

### Third-party backend footprint

[`CortexReach/memory-lancedb-pro`](https://github.com/CortexReach/memory-lancedb-pro)
had about 4,449 stars and 725 forks on 2026-11-11 (was 4,457 / 731 on
2026-09-09). npm channels observed: `latest=1.0.32`, `beta=1.1.0-beta.9`;
GitHub release `v1.1.0-beta.10` remains the tagged beta tip. Stars are interest
proxies, not active installs.

Official `@openclaw/memory-lancedb` published `2026.11.3` on npm. The `ltm`
CLI is plugin-gated and absent from a bare OpenClaw core install.

### Competitive / adjacent set

GitHub search for OpenClaw memory migration now returns several related tools:

| Project | Direction | Notes |
| --- | --- | --- |
| `airbing11/openclaw-memory-migrator` | → memory-core | Evidence-first cutover |
| `citriac/claw-migrate` | multi-Claw ecosystems | Broader, thinner proof contract |
| `AlekseiUL/openclaw-to-hermes-migration-kit` | leave OpenClaw | Outbound |
| DSH / TencentDB migrators | export outbound | Different target systems |
| chat-history → OpenClaw importers | inbound history | Not backend cutover |

Differentiation still holds when the product stays proof-first: counts, IDs,
approvals, rollback readiness, and fail-closed adapters.

### Official migration surface

OpenClaw ships [`migrate`](https://docs.openclaw.ai/cli/migrate) for
agent-system providers (for example Hermes). That is adjacent orchestration, not
a substitute for multi-source memory-backend cutover with LanceDB Pro scopes and
list-capture manifests. Longer term, adapters may wrap
`registerMigrationProvider` once they are stable.

### Benchmarking and reverse marketing

[`phenomenoner/openclaw-memory-bench`](https://github.com/phenomenoner/openclaw-memory-bench)
remains early. LanceDB-authored comparisons that favor Pro retrieval accuracy
increase demand for paired before/after evidence if this project claims
non-regression. Until a paired runner exists, publish only health checks or
explicitly scoped comparisons.

## User segments

1. Self-hosted operators after an OpenClaw upgrade or plugin breakage
2. Operators who tried Pro/official LanceDB and want a recoverable return path
3. Consultants repeating heterogeneous migrations
4. Chinese SkillHub operators who download but never complete first dry-run

## Positioning rules

Keep:

- trusted migration and verification into memory-core;
- no lossless / one-click / recall-improvement claims without scoped evidence;
- local-only processing and privacy redlines.

Explore carefully:

- dual-direction safety kit (Pro↔core) under the same proof contract;
- memory-wiki bridge awareness after core cutover;
- Chinese “切回官方记忆” pack focused on install→CLI path friction.

Do not chase Hermes/DSH/Tencent outbound migrations as the core roadmap.

## Distribution

Primary: GitHub releases, ClawHub Skill, SkillHub listing, OpenClaw community.

Chinese: 知乎/公众号, V2EX/掘金, SkillHub recipes. Prefer install-path clarity
over more awareness posts while installs lag downloads.

## Evidence limitations

- No reliable TAM or active-install census.
- Stars/forks and ClawHub downloads overstate readiness.
- One dogfood environment (2026-09-18) is not a universal success rate.
- This refresh used public package/CLI/docs checks, not a new live export cutover.

Next market evidence should still come from anonymized dry-run reports and a
fresh live compatibility dry-run against a current Pro beta and official LanceDB
install.
