# 内容来源

本目录中的课程、模板与案例正文来自：

- 仓库：<https://github.com/study8677/awesome-architecture>
- 分支：`main`
- 抓取日期：2026-11-07
- 抓取方式：通过 jsDelivr 的 GitHub CDN 获取仓库中的中文 Markdown 文件（本机到 github.com 直连不稳定）

## 收录范围

- `tutorial/`：40 章核心教程 + `T01` 训练专题 + 2 个附录（术语表、演进触发信号）
- `templates/`：31 个正式模板（未把 `ai-native-organization` 专题入口计入 31 个模板）
- `cases/`：6 个实战案例
- `LICENSE`：原项目 MIT 许可
- `UPSTREAM_README.md`：原项目 README，用于溯源

英文版（`en/`）未收录到当前阅读版。若后续需要双语切换，可在 `content/en/` 加入英文 Markdown，并在
`scripts/build-content.mjs` 的文档扫描逻辑中增加语言维度。

## 修改约定

- 不直接修改 `content/` 中的原文语义；站内链接、标题锚点、代码块增强在构建脚本中完成。
- 修正错别字或同步上游更新时，建议在上游提交后重新抓取对应文件，并在本文件记录日期。
- 正文版权归原作者与贡献者所有，遵循 MIT License。
