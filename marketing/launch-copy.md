# Launch copy drafts

Status: drafts only. Do not publish any section until that specific post
passes [`post-approval-checklist.md`](post-approval-checklist.md).

Canonical facts, privacy redlines, and cadence live in
[`docs/community-launch-plan.md`](../docs/community-launch-plan.md).

## Shared links

- GitHub: https://github.com/airbing11/openclaw-memory-migrator
- RC: https://github.com/airbing11/openclaw-memory-migrator/releases/tag/v0.1.0-rc.1
- ClawHub: https://clawhub.ai/skills/memory-core-migrator
- Dry-run form: https://github.com/airbing11/openclaw-memory-migrator/issues/new?template=dry-run-report.yml
- Compatibility form: https://github.com/airbing11/openclaw-memory-migrator/issues/new?template=compatibility-bug.yml

## ClawHub listing — English

### Title

OpenClaw Memory Migrator

### Short description

An evidence-first Skill for users moving memory back to OpenClaw's official
memory-core, with manifests, duplicate audits, approvals, and rollback evidence.

### Body

Move the memory. Keep the proof.

OpenClaw Memory Migrator is a local-first Skill and CLI toolkit for operators
changing memory backends. It exports supported sources into a versioned,
inspectable format, reconciles counts and IDs, renders reviewable memory-core
Markdown, and blocks production actions until backup and approval gates pass.

It gives users returning from third-party memory backends to OpenClaw's
official memory-core a safer, verifiable, and practical migration path.

It does not upload your memory, copy incompatible vectors, write OpenClaw
SQLite internals, or delete duplicate records automatically.

Start with a dry run. Review the manifest. Cut over only when the evidence and
rollback are ready.

## ClawHub listing — 中文

### 标题

OpenClaw Memory Migrator

### 简介

为希望从第三方记忆后端迁回 OpenClaw 官方 memory-core 的用户，提供安全、
可验证、易操作的迁移 Skill，包含清单核对、重复审计、run 级批准和回滚证据。

### 正文

迁移记忆，不迁移风险。

OpenClaw Memory Migrator 是面向自托管运维者的本地优先 Skill 与 CLI。
它将支持的来源导出为版本化、可审阅的中间格式，核对数量与 ID，生成
memory-core Markdown，并在备份和批准闸门通过前阻止生产写操作。

它尤其适合希望摆脱第三方插件兼容性风险、迁回 OpenClaw 官方记忆系统，
同时又不愿依赖一次性脚本盲切的用户。

它不会上传你的记忆，不会复制不兼容向量，不会直接改写 OpenClaw SQLite
内部表，也不会自动删除重复记录。

先 dry-run，再审清单；证据和回滚都准备好后才切槽。

## GitHub tester call

Use this as a pinned issue or README excerpt after Issue Forms land. It is
not an upstream OpenClaw issue.

**Title:** RC tester call: anonymized dry-run reports wanted

I am looking for 3–8 self-hosted OpenClaw operators or plugin maintainers who
can run a local dry-run against a supported source and send counts, not
memory.

Supported now:

- version-gated `memory-lancedb-pro` JSON capture;
- Markdown / QMD-owned Markdown;
- beta official `memory-lancedb` `ltm list` capture manifests.

The RC default is dry-run. It does not write OpenClaw SQLite internals, copy
vectors, or delete history. `memory-lancedb-pro` v1.1.0-beta.10 `export` is
capped at 1,000 records; compare each scoped export with fresh stats.

Please file:

- https://github.com/airbing11/openclaw-memory-migrator/issues/new?template=dry-run-report.yml

Do not attach exports, JSONL, screenshots, hostnames, or raw memory.

## Discord moderator request

Do not post in a public channel until a moderator names the channel.

Hi — I maintain OpenClaw Memory Migrator, a local-first RC Skill/CLI for
operators moving supported memory sources back to official `memory-core`.

OpenClaw's README points setup questions here and new capabilities to
ClawHub. Before I post anything public, may I share one technical tester
call in a channel you specify?

I would ask for anonymized dry-run counts only, link GitHub Issue Forms for
replies, and avoid recruiting in DMs. If third-party project posts are not
allowed, I will keep the listing on ClawHub/GitHub and not post here.

Links I would include:

- https://github.com/airbing11/openclaw-memory-migrator
- https://clawhub.ai/skills/memory-core-migrator

## Discord `#self-promotion` — official Showcase draft

Official intake named on 2026-09-12:
https://docs.openclaw.ai/start/showcase

Attach a screenshot of a synthetic fixture audit, never a live Control UI.

**Channel:** `#self-promotion`

OpenClaw Memory Migrator is a local-first RC Skill/CLI for operators moving
LanceDB Pro captures, official LanceDB list captures (beta), or Markdown/QMD
back to official `memory-core`.

It does not copy vectors or write SQLite internals. Default is dry-run:
normalize to inspectable JSONL, reconcile counts/IDs/hashes, stage Markdown,
and stop until backup + a run-bound approval exist.

Try the synthetic fixtures first, then file counts — not memory:

https://github.com/airbing11/openclaw-memory-migrator
https://clawhub.ai/skills/memory-core-migrator
https://github.com/airbing11/openclaw-memory-migrator/issues/new?template=dry-run-report.yml

Please do not paste exports, hostnames, or raw memory here.

## X `@openclaw` — official Showcase draft

Proof-first path from LanceDB Pro / Markdown back to official OpenClaw
`memory-core`. Local dry-run, count reconciliation, no vector copy.

Repo: https://github.com/airbing11/openclaw-memory-migrator
ClawHub: https://clawhub.ai/skills/memory-core-migrator

Looking for anonymized dry-run counts, not installs. @openclaw

## Show HN

**Title:** Show HN: OpenClaw Memory Migrator – proof-first backend migrations

I built a local-first migration toolkit for OpenClaw operators moving existing
memory into official `memory-core`.

The hard part was not converting text. It was proving scope/count coverage,
handling embedding incompatibility, preventing stale chat approvals, comparing
recall, and keeping a rollback path.

The project uses a versioned JSONL interchange format, renders Markdown rather
than writing SQLite internals, and defaults to dry-run. The first RC supports
LanceDB Pro exports, Markdown/QMD, and a beta adapter for versioned captures of
the official `ltm list` output. LanceDB Pro `export` is capped at 1,000
records on the tested plugin version.

Repo: https://github.com/airbing11/openclaw-memory-migrator

```text
node bin/openclaw-memory-migrator.js --help
```

I would especially value anonymized schema samples and failed dry-run reports
from different OpenClaw versions:

https://github.com/airbing11/openclaw-memory-migrator/issues/new?template=dry-run-report.yml

Hold this post until at least one external dry-run has been reviewed and the
author can stay in the thread.

## V2EX first-hand outline

V2EX forbids AI-generated posts. Do not paste the following as a finished
thread. The maintainer should rewrite it from the real migration they ran.

Facts the rewritten post must keep:

1. Title idea: 从第三方记忆插件迁回 OpenClaw memory-core 时，我先做了对账再切槽
2. Trigger: plugin compatibility risk during an OpenClaw upgrade, not a desire
   for a new backend brand.
3. What was hard: export caps, scope coverage, non-portable vectors, duplicate
   corpus, rollback, channel recovery after restart.
4. What the tool does: local dry-run, JSONL manifest, count/ID/hash audit,
   memory-core Markdown only, run-bound approval.
5. What it does not do: upload memory, write SQLite internals, copy vectors,
   auto-delete duplicates, or promise lossless / one-click results.
6. Concrete numbers the maintainer actually observed, if they still pass the
   privacy redlines. Do not invent counts.
7. Links: GitHub RC, ClawHub `memory-core-migrator`, dry-run Issue Form.
8. Ask: 3–8 operators willing to share redacted counts. Refuse raw memory in
   replies.
9. Node: re-check the target node rules on the posting day.
10. Voice: first person, specific commands the maintainer typed, mistakes they
    made. If a sentence could have been written without running the tool,
    delete it.

Banned phrases: 无损、零停机、全版本支持、提升召回、一键迁移、AI 生成痕迹
（“作为一名…”、对称排比、空泛清单）。

## Amplification — X / LinkedIn / WeChat

Week 4 only. One short pointer per network. Do not answer support in-thread.

OpenClaw Memory Migrator RC is public: a local, dry-run-first path from
supported memory sources back to official `memory-core`.

It stages inspectable JSONL and Markdown, reconciles counts, and blocks
writes until backup + run-bound approval. No vector copy, no SQLite internals.

Looking for anonymized dry-run counts, not installs.

https://github.com/airbing11/openclaw-memory-migrator

## 60-second demo

1. Show the current memory slot and source counts.
2. Run preflight; highlight that it is read-only.
3. Normalize three synthetic scopes into MemoryRecord JSONL.
4. Open the audit: exact count, unique IDs, duplicate groups, rejected rows.
5. Render staged `memory/imports/...` Markdown.
6. Show the run-bound approval token and prepared rollback.
7. End on: “Move the memory. Keep the proof.”

Never use real memory, API keys, channel IDs, or production hostnames in the
recording.

## FAQ

### Does it copy vectors?

No. Vectors are derived from a particular model and embedding space.
memory-core rebuilds them from authoritative text.

### Is migration lossless?

The tool reports exactly which source fields and IDs reconcile. It does not use
“lossless” when the source cannot expose enough information to prove that.

### Does it upload memory?

No telemetry or hosted service is required. Operators remain responsible for
protecting local exports and backups.

### Does it deduplicate automatically?

Not in v0.1. It reports duplicate groups without deleting history.

### Can it run from a group chat?

No. Production workflows are owner-only and use approvals bound to one run.

## First-wave review

Reviewed 2026-09-09 against the fact card, privacy redlines, and
[`post-approval-checklist.md`](post-approval-checklist.md). No post was sent.

| Draft | Ready to send? | Findings |
| --- | --- | --- |
| GitHub tester call | Live | Issue #2 and Discussion #3 exist; 0 comments as of 2026-09-12. |
| Discord `#self-promotion` | Hold for screenshot + approval | Official Showcase channel. Needs a synthetic audit image. |
| X `@openclaw` | Hold for same screenshot + approval | Same Showcase intake. Do not thread-support. |
| Discord other channels | No | Still need a named channel from a moderator. |
| Show HN | No | Wait until the author can stay in the thread. |
| V2EX | No | Outline only. Publishing it verbatim would be AI content. |
| ClawHub listing | Already published | Leave support on GitHub. |

Remaining risks if the Discord request is approved next:

- testers may still paste memory into Discord despite the warning;
- the 1,500-record originating case must stay out of first-wave posts;
- ClawHub slug `memory-core-migrator` and GitHub repo name differ — say both.
