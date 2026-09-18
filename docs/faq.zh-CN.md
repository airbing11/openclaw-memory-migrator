# 常见问题

## 工具会自动导出 memory-lancedb-pro 的全部 scope 吗？

不会。工具只读取显式导出文件，不调用来源插件。当前插件 CLI 可能要求逐 scope
导出，并可能有 1,000 条上限。先发现全部 scope，逐一捕获，再通过多个
`--input` 传入。自动 `--all-scopes` 编排延后到 v0.2.0。

## 如何判断近似重复审计是否完整？

检查 `completeness.approximate_audit_complete` 和
`approximate_comparisons.coverage`。截断结果只证明已比较的候选对。可以增大
`--max-comparisons`，或使用 `--require-complete-approximate`，让截断以状态码
2 退出。

## parsed、accepted、skipped、rejected 分别是什么？

- `parsed`：检查过的来源条目或 Markdown 分段。
- `accepted`：成功生成的规范记录。
- `skipped`：结构合法但按规则不生成记录的条目，例如空 Markdown 分段。
- `rejected`：继续处理时被逐条拒绝的条目。

当前适配器遇到畸形记录会 fail closed，因此成功运行通常是 `rejected: 0`；
畸形输入会使命令失败，而不是静默增加该计数。`redactions` 统计移除的密钥类
字段和向量字段。

## rollback readiness 等于做过回滚演练吗？

不等于。readiness 表示备份、源数据、原配置、重启路径和验证证据齐备；rehearsal
表示确实执行并验证过回滚。报告必须分开表述。

## 迁移后检索健康等于前后基准对比吗？

不等于。健康检查只证明目标端某一时点可以检索。成对对比要求迁移前冻结题集并
采集来源结果，再在条件一致时采集目标结果。

## 为什么 OpenClaw 文本和 JSON 状态可能不一致？

OpenClaw 的 dirty 与 chunk 文本/JSON 值可能处在不同刷新时点。这属于上游行为。
同时记录两者，等待索引静默窗口，并按已安装版本文档指定的机器可读状态做自动
判定。

## 如何保护隐私？

导出、规范 JSONL、审计报告、查询、片段、路径、主机名、凭据和备份哈希都应保
存在索引目录之外，也不能提交到公开 Issue。只分享脱敏计数、版本、适配器名和
结构化错误码。
