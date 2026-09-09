# OpenClaw Memory Migrator

**迁移记忆，不迁移风险。**

一套带安全闸门的 OpenClaw Skill 与 CLI 工具，将 LanceDB Pro、官方
LanceDB 列表捕获、QMD 或 Markdown 的权威记忆迁移到 `memory-core`。

[English](README.md)

## 为什么需要它

更换记忆后端不是简单复制文件。可信迁移必须证明导出了什么、阻止不兼容向量
进入新索引、保护密钥、保留回滚路径，并在退役旧后端前量化对比召回质量。

本项目为希望从第三方记忆后端迁回 OpenClaw 官方 `memory-core` 的用户，
提供一条安全、可验证、易操作的迁移路径。

本项目提供：

- 版本化、可审阅的 JSONL 中间格式；
- 按来源核对数量、ID、哈希和重复内容；
- 生成 memory-core Markdown，但不自动改写根 `MEMORY.md`；
- 与 run ID 绑定的生产操作批准令牌；
- 可续跑阶段状态和回滚证据；
- 可复现的召回基准报告；
- 不直接写 OpenClaw SQLite 内部表。

## 支持状态

- 稳定：按版本探测的 memory-lancedb-pro JSON 捕获
- 稳定：Markdown 与 QMD 的权威 Markdown
- Beta：将官方 `memory-lancedb` 的 `ltm list` JSON 包装为带版本、按 Agent
  隔离的捕获清单
- 目标：通过 Markdown 与官方索引命令进入 memory-core

不支持解析不透明数据库、复制旧向量或自动删除重复内容。

重要：memory-lancedb-pro v1.1.0-beta.10 的 `export` 最多返回 1,000 条。
操作流程必须按 scope 与最新 stats 核对，超量时通过 `list --offset` 分页。

## 快速开始

需要 Node.js 22+，无运行时第三方依赖。

```bash
node bin/openclaw-memory-migrator.js --help
mkdir -p canonical reports staged-memory/imports
node bin/openclaw-memory-migrator.js preflight \
  --input export/global.json \
  --input export/main.json \
  --output canonical/memory-records.jsonl
node bin/openclaw-memory-migrator.js normalize \
  --adapter lancedb-pro \
  --input export/global.json \
  --input export/main.json \
  --output canonical/memory-records.jsonl
node bin/openclaw-memory-migrator.js audit \
  --adapter lancedb-pro \
  --input export/global.json \
  --output reports/audit.json
node bin/openclaw-memory-migrator.js render \
  --adapter lancedb-pro \
  --input export/global.json \
  --output staged-memory/imports/lancedb-pro
```

CLI 默认只做本地、非破坏性转换。生产使用前必须阅读
[`SKILL.md`](SKILL.md)。

## 安全模型

- 仅 owner 私聊、Control UI 或本地运维终端执行
- 默认 dry-run
- 写操作前必须有 verified backup
- 批准绑定操作名与 run ID
- 环境漂移、数量或哈希不一致立即停止
- 报告保存在记忆索引范围外
- 回滚期内保留源数据

详见 [`references/operations.md`](references/operations.md) 与
[`SECURITY.md`](SECURITY.md)。

## 当前阶段

项目处于早期候选版本。先使用合成 fixture 或导出副本测试；生产切槽仍需人工
审阅。

## 真实案例边界

最初工作流曾迁移 1,500 余条记录，使用八题召回门槛并完成七天浸泡。该案例
用于证明流程可行，不代表对其他安装环境作成功保证；公开匿名案例前仍需 owner
批准。

## 开发

```bash
npm test
npm run check
```

## 许可证

MIT，见 [`LICENSE`](LICENSE)。
