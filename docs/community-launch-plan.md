# Community launch plan

Research date: 2026-09-09
Status: drafts only. Every external post still needs a separate maintainer
approval. Do not publish from this document.

Visual briefing:
[community launch canvas](/C:/Users/bing1/.cursor/projects/d-cursor-projects-openclaw-memory-migrator/canvases/community-launch-plan.canvas.tsx).

## Goal

Recruit 3–8 self-hosted OpenClaw operators or plugin maintainers to submit
anonymized dry-run reconciliation summaries, compatibility failures, and
rollback notes.

Do not optimize the first wave for installs, stars, or virality.

## Launch baseline (2026-09-09)

| Surface | Value |
| --- | --- |
| GitHub repository | public, [airbing11/openclaw-memory-migrator](https://github.com/airbing11/openclaw-memory-migrator) |
| GitHub stars / forks / issues | 0 / 0 / 0 |
| Release `v0.1.0-rc.1` asset downloads | 0 |
| ClawHub `memory-core-migrator` installs | 0 |
| GitHub Discussions | disabled on this repository and on `openclaw/openclaw` |
| Issues | enabled; use Issue Forms as the only public intake |

## Fact card

Use this card in every post. Do not invent additional claims.

- Product: OpenClaw Memory Migrator, a local-first Skill and CLI.
- Headline (EN): Move the memory. Keep the proof.
- Headline (ZH): 迁移记忆，不迁移风险。
- Audience: operators returning from third-party memory backends to official
  `memory-core`.
- Supported now:
  - stable: version-gated `memory-lancedb-pro` JSON capture;
  - stable: Markdown and QMD-owned Markdown;
  - beta: official `memory-lancedb` `ltm list` JSON in a versioned per-agent
    manifest;
  - target: `memory-core` Markdown plus official indexing.
- Safety contract: owner-only, dry-run first, verified backup, run-bound
  approval, fail closed on drift, no SQLite internals, no vector copy, no
  automatic deletion.
- Known limit: `memory-lancedb-pro` v1.1.0-beta.10 `export` is capped at 1,000
  records; compare every scoped export with fresh stats and paginate
  `list --offset` when required.
- Canonical links:
  - GitHub: https://github.com/airbing11/openclaw-memory-migrator
  - Release: https://github.com/airbing11/openclaw-memory-migrator/releases/tag/v0.1.0-rc.1
  - ClawHub: https://clawhub.ai/skills/memory-core-migrator
  - Dry-run form: https://github.com/airbing11/openclaw-memory-migrator/issues/new?template=dry-run-report.yml
  - Compatibility form: https://github.com/airbing11/openclaw-memory-migrator/issues/new?template=compatibility-bug.yml
- Single CTA: share an anonymized reconciliation summary through the Issue Form.

## Privacy redlines

Never request or accept:

- raw memory text, conversation logs, or daily notes;
- credentials, tokens, API keys, or backup hashes;
- hostnames, IP addresses, channel IDs, or private filesystem paths;
- screenshots of live OpenClaw Control UI with real names;
- unredacted `audit.json`, JSONL, or export envelopes.

Accept only:

- OpenClaw and plugin version strings;
- adapter name and export capability notes;
- source / export / canonical / rejected counts;
- duplicate-group counts without example text;
- fail-closed error class and sanitized command transcript;
- whether backup verification and rollback rehearsal passed.

If a tester pastes sensitive data, do not quote it. Close the issue, ask them
to redact, and delete the leaked content if GitHub tools allow.

## Sourced channel facts

Facts below are separated from recommendations. Where a rule was not found,
the gap is explicit.

### GitHub

- This repository is the public source of truth and has Issues enabled.
- Discussions are disabled here and on `openclaw/openclaw` (checked 2026-09-09
  with `gh repo view`).
- Upstream README routes bugs and features to the OpenClaw issue chooser, setup
  questions to Discord, and new capabilities to plugins/ClawHub:
  https://github.com/openclaw/openclaw
- Do not file promotional issues on `openclaw/openclaw`.

### ClawHub

- Official docs: https://docs.openclaw.ai/clawhub
- ClawHub is the public registry for skills. Public pages show scan state
  before install.
- This skill is listed as `memory-core-migrator` because ClawHub reserves
  `openclaw-*` slugs and the `openclaw` topic.
- ClawHub is the install surface, not the support surface.

### Discord

- Official invite referenced by OpenClaw README: https://discord.gg/clawd
- Official community policy repo: https://github.com/openclaw/community
- Published Community Team Guide asks helpers to keep channels focused on
  OpenClaw and to be helpful, but it does not publish a self-promotion policy
  for third-party projects:
  https://github.com/openclaw/community/blob/main/discord.md
- Therefore Discord posting requires moderator confirmation of channel and
  format before any public message.

### Hacker News Show HN

- Official rules: https://news.ycombinator.com/showhn.html
- Allowed: something the author made that people can try, including early work.
- Required: title starts with `Show HN`; no signup wall; author is present to
  discuss; no friend-upvote campaigns.
- Incremental version bumps are generally not Show HN material.
- Adjacent analog: “Show HN: DenchClaw – Local CRM on Top of OpenClaw”
  (147 points, 124 comments when checked):
  https://news.ycombinator.com/item?id=47309953

### V2EX

- About / rules, last revised 2025-07-27: https://www.v2ex.com/about
- Relevant constraints: no piracy, no full-text reprints of others’ articles,
  no zero-information replies, no doxxing, and “请不要把 AI 生成的内容发送到这里”.
- OpenClaw already appears in self-hosting threads, for example
  https://www.v2ex.com/t/1197630
- Node-specific posting rules were not captured. Check the chosen node before
  posting.

### Chinese long-form and video

- 掘金 and 知乎 currently show OpenClaw how-to content, not a dedicated
  migration community. Primary-source self-promotion rules for those sites were
  not verified in this pass.
- Bilibili has general community rules, but no verified OpenClaw-specific
  launch channel was found.
- Treat 掘金, 知乎, Bilibili, and WeChat as later amplification only after a
  public sanitized case exists and site rules are re-checked.

### Reddit, X, LinkedIn

- Official OpenClaw README points to [@openclaw](https://x.com/openclaw) on X.
- No current, clearly documented Reddit community for self-hosted OpenClaw
  operators was verified. Generic self-promotion norms vary by subreddit.
- Reddit is deferred until a relevant community with explicit rules and prior
  maintainer participation is identified.

## Recommendations

These are strategy, not platform facts.

| Priority | Channel | Why | First action |
| --- | --- | --- | --- |
| P0 | GitHub Issues + README | Only owned, searchable intake | Publish Issue Forms; keep support here |
| P0 | ClawHub listing | Official skill discovery | Point testers here to install, not to file support |
| P1 | OpenClaw Discord | Official setup community | Ask moderators first; post once if allowed |
| P2 | V2EX | Evidenced Chinese OpenClaw discussion | Maintainer rewrites a first-hand post from the outline |
| P3 | Show HN | Try-it-now audience after docs settle | One post after first dry-run feedback |
| P4 | X / LinkedIn / WeChat | Amplification only | Link back to GitHub; do not support in-thread |
| Hold | Reddit, 掘金, 知乎, Bilibili | Rule or audience evidence incomplete | Re-check before any post |

## Cadence

```mermaid
flowchart LR
  week0[Week0 intake] --> week1[Week1 Discord ask]
  week1 --> week2[Week2 V2EX]
  week2 --> week3[Week3 ShowHN]
  week3 --> week4[Week4 amplify]
  leak[Privacy or ban risk] --> stop[Pause later channels]
  week1 --> leak
  week2 --> leak
  week3 --> leak
```

1. Week 0 — own the intake. Issue Forms, fact card, privacy redlines, and
   approval checklist must exist before any outreach.
2. Week 1 — OpenClaw core. Send one Discord moderator request. If approved,
   post one technical tester call and route replies to GitHub.
3. Week 2 — Chinese verification. Maintainer writes a first-hand V2EX post
   from the outline. Long-form 掘金/知乎 waits for a public sanitized case.
4. Week 3 — international. One Show HN after README/FAQ gaps from week 1–2 are
   closed. Author stays present for the thread.
5. Week 4 — amplification. Short X/LinkedIn or WeChat pointers. Bilibili only
   if a synthetic demo is recorded.

Do not same-day cross-post the same text. Space posts and keep one support
inbox.

## Metrics

Core quality metrics:

- qualified testers who run a supported-source dry-run;
- anonymized dry-run reports that pass the privacy checklist;
- reproducible compatibility bugs;
- newly documented source versions;
- maintainer time to first response.

Secondary reach metrics:

- GitHub referral sources, stars, and forks;
- Release asset downloads;
- ClawHub installs;
- per-post clicks, if the platform exposes them;
- removals, warnings, or moderator complaints.

A useful first-wave ratio is qualified reports to generic comments. Reach
without reports is not success.

## Stop conditions

Pause later channels immediately if any of the following happen:

- a tester publishes real memory, credentials, or private paths;
- support load exceeds maintainer capacity for 48 hours;
- a platform warns or removes a post;
- two independent dry-runs show unexplained count/ID drift on the same
  adapter;
- a post accidentally uses a banned claim.

Resume only after the leak, claim, or adapter issue is documented and fixed.

## Approval rule

Community posts are not covered by the GitHub or ClawHub publication
approvals. Use [`marketing/post-approval-checklist.md`](../marketing/post-approval-checklist.md)
for every draft, including Discord DMs to moderators.

## Tracker

Copy a row into the latest approved-post note. Do not invent metrics.

| Date | Channel | Draft file section | Approver | Result | Qualified reports | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| 2026-09-09 | GitHub Issue Forms | intake templates | pending | prepared | 0 | Forms not yet used |
| 2026-09-09 | Discord moderator request | First-wave review | pending | draft | 0 | Do not send until approved |
| | V2EX | Chinese outline | | held | | Maintainer must rewrite |
| | Show HN | Show HN | | held | | After first dry-run feedback |
| | X / LinkedIn | Amplification | | held | | Week 4 only |

## Sources

- https://github.com/airbing11/openclaw-memory-migrator
- https://github.com/airbing11/openclaw-memory-migrator/releases/tag/v0.1.0-rc.1
- https://clawhub.ai/skills/memory-core-migrator
- https://docs.openclaw.ai/clawhub
- https://github.com/openclaw/openclaw
- https://github.com/openclaw/community
- https://github.com/openclaw/community/blob/main/discord.md
- https://discord.gg/clawd
- https://news.ycombinator.com/showhn.html
- https://news.ycombinator.com/item?id=47309953
- https://www.v2ex.com/about
- https://www.v2ex.com/t/1197630
- [`docs/positioning.md`](positioning.md)
- [`docs/market-research.md`](market-research.md)
- [`marketing/launch-copy.md`](../marketing/launch-copy.md)
