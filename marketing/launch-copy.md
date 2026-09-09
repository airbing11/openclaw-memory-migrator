# Launch copy drafts

Status: draft only. Do not publish until the release checklist and case-study
approval are complete.

## ClawHub listing — English

### Title

OpenClaw Memory Migrator

### Short description

Safely stage LanceDB, QMD, and Markdown memory for memory-core with manifests,
duplicate audits, run-bound approvals, recall checks, and rollback evidence.

### Body

Move the memory. Keep the proof.

OpenClaw Memory Migrator is a local-first Skill and CLI toolkit for operators
changing memory backends. It exports supported sources into a versioned,
inspectable format, reconciles counts and IDs, renders reviewable memory-core
Markdown, and blocks production actions until backup and approval gates pass.

It does not upload your memory, copy incompatible vectors, write OpenClaw
SQLite internals, or delete duplicate records automatically.

Start with a dry run. Review the manifest. Cut over only when the evidence and
rollback are ready.

## ClawHub listing — 中文

### 标题

OpenClaw Memory Migrator

### 简介

将 LanceDB、QMD 与 Markdown 记忆安全迁移到 memory-core，提供清单核对、
重复审计、run 级批准、召回验证和回滚证据。

### 正文

迁移记忆，不迁移风险。

OpenClaw Memory Migrator 是面向自托管运维者的本地优先 Skill 与 CLI。
它将支持的来源导出为版本化、可审阅的中间格式，核对数量与 ID，生成
memory-core Markdown，并在备份和批准闸门通过前阻止生产写操作。

它不会上传你的记忆，不会复制不兼容向量，不会直接改写 OpenClaw SQLite
内部表，也不会自动删除重复记录。

先 dry-run，再审清单；证据和回滚都准备好后才切槽。

## GitHub release v0.1.0-rc.1

### English

This release candidate establishes the safety contract:

- canonical MemoryRecord v1 JSONL;
- LanceDB Pro, Markdown/QMD, and beta official-LanceDB file adapters;
- count, ID, hash, and duplicate audits;
- reviewable memory-core Markdown rendering;
- run-bound approval primitives;
- synthetic failure fixtures.

The RC deliberately does not automate destructive production cutover. We want
adapter evidence before broadening write authority.

### 中文

这个候选版本首先确立迁移安全契约：

- MemoryRecord v1 JSONL 中间格式；
- LanceDB Pro、Markdown/QMD 与 Beta 官方 LanceDB 文件适配器；
- 数量、ID、哈希和重复审计；
- 可人工审阅的 memory-core Markdown；
- 绑定 run ID 的批准机制；
- 覆盖失败场景的合成 fixture。

RC 暂不自动执行破坏性生产切槽。先积累适配器证据，再扩大写权限。

## Show HN

**Title:** Show HN: OpenClaw Memory Migrator – proof-first backend migrations

I built a local-first migration toolkit for OpenClaw operators moving existing
memory into memory-core.

The hard part was not converting text. It was proving scope/count coverage,
handling embedding incompatibility, preventing stale chat approvals, comparing
recall, and keeping a rollback path.

The project uses a versioned JSONL interchange format, renders Markdown rather
than writing SQLite internals, and defaults to dry-run. The first RC supports
LanceDB Pro exports, Markdown/QMD, and a beta generic LanceDB export adapter.

I would especially value anonymized schema samples and failed dry-run reports
from different OpenClaw versions.

## 中文社区短帖

**标题：** 做了一个 OpenClaw 记忆迁移工具：先证明，再切槽

从 LanceDB/QMD 切到 memory-core，真正危险的不是“怎么转文本”，而是：

- 有没有漏 scope、被默认 limit 截断；
- 旧向量能不能复用；
- 重复语料会不会污染召回；
- 重启后通道是否恢复；
- 出问题能不能原路回滚。

OpenClaw Memory Migrator 默认 dry-run，把来源统一成可审阅 JSONL，核对数量、
ID 与哈希，只生成 memory-core Markdown，不直接写 SQLite。生产操作必须绑定
本次 run ID 批准。

当前是早期 RC，欢迎提供脱敏后的 dry-run 报告和兼容性反馈。

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
