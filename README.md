# 架构图谱 · 在线阅读版

**在线访问：** <https://architecture-atlas-two.vercel.app>

把 [study8677/awesome-architecture](https://github.com/study8677/awesome-architecture) 的架构课程，
重新做成一个**可在线阅读、可追踪进度、可检索**的学习平台。

> 非官方阅读体验重制版。课程、模板与案例正文来自原项目，遵循 MIT License；本站重做了导航、排版、阅读器与学习记录。

## 这是什么

原项目是一套质量很高的 Markdown 课程，但 40 多篇长文、31 张架构地图和 6 个案例分散在目录里。
这个版本把它们组织成一条连续的阅读路径：

- **41 讲课程**：40 章核心教程 + T01 训练专题，按六段学习路径编排
- **31 张架构地图**：经典系统、AI 原生、编码 Agent、提示词架构、工业 / 嵌入式
- **6 个实战案例**：从抢票、SaaS 到企业 RAG、实时协同、内容分发与编码 Agent
- **优秀文章精读**：外部长文不转载，读完写成「结论」——主张、证据、决策表、出处与打折项
- **2 个附录**：架构术语表、架构升级触发信号

## 功能

- 沉浸式阅读器：三栏布局、跟随目录、代码复制、字号 / 主题 / 版式切换
- 全局搜索：覆盖标题、摘要、章节标题与正文，`⌘K` / `Ctrl K` 唤起
- 学习闭环：阅读进度、完成标记、收藏、继续上次、六段路进度
- 好文精读：按主题筛选、检索、阅读器内标注原文出处，进度与收藏一并记录
- 学习路径：按六段路顺序阅读，或选择系统通关 / 面试冲刺 / AI 产品三种走法
- 深色模式、移动端抽屉目录、键盘 `[` `]` 切换上下篇
- 纯静态站点：无后端、无账号、无追踪，学习记录只写入浏览器 `localStorage`

## 快速开始

```bash
npm install
npm run dev
# http://127.0.0.1:4173
```

生产构建：

```bash
npm run build
npm run preview
# 默认 http://127.0.0.1:4173
```

构建产物在 `dist/`，同时生成 `sitemap.xml` 与 `robots.txt`。

## 目录结构

```text
.
├── content/                 # 来自上游的中文课程、模板、案例与许可
│   ├── tutorial/            # 40 章 + T01 专题 + 2 个附录
│   ├── templates/           # 31 张架构地图
│   ├── cases/               # 6 个实战案例
│   └── articles/            # 优秀文章：收录索引 + 每篇归纳
├── scripts/
│   ├── build-content.mjs    # Markdown → HTML / 目录 / 搜索索引
│   └── postbuild.mjs         # 为静态托管生成 404 fallback
├── src/
│   ├── components/          # 导航、搜索、进度环
│   ├── pages/               # 首页、课程、路径、模板、案例、优秀文章、阅读器、我的学习
│   ├── lib/                 # 内容索引、学习进度状态
│   └── styles/global.css    # 设计系统与响应式
└── src/generated/           # 构建生成，不提交修改
```

## 内容构建

`npm run content`（`npm run dev` / `npm run build` 会自动执行）会：

1. 读取 `content/` 下的 Markdown；
2. 从索引页解析每讲的一句话摘要、模板定位、案例技术点与优秀文章的收录元信息；
3. 渲染为带标题锚点的 HTML，重写站内 `.md` 链接；
4. 生成 `src/generated/catalog.json`、逐篇 `docs/*.json` 与 `search.json`。

因此正文只在构建时处理一次，运行时按需加载单篇内容，不会把 3MB Markdown 一次塞进首屏。

## 部署

站点是 **SPA + 静态资源**，任意静态托管都可以：

- **Vercel**：已连接 GitHub `saxon-yc/arch` 的 `main` 分支，push 后自动生产部署；构建命令 `npm run build`，`vercel.json` 已包含 SPA rewrite。`SITE_URL` 环境变量可覆盖 sitemap 中的域名。
- **Netlify**：构建命令 `npm run build`，发布目录 `dist`；`public/_redirects` 已包含 fallback。
- **GitHub Pages**：发布 `dist/`。`npm run build` 会生成 `dist/404.html`；若部署在子路径，需要在 `vite.config.js` 里设置 `base`。
- **Nginx**：`try_files $uri $uri/ /index.html;`

## 内容来源与许可

- 内容来源：[study8677/awesome-architecture](https://github.com/study8677/awesome-architecture)
- 作者：JingWen Fan（[@study8677](https://github.com/study8677)）与社区贡献者
- 许可：[MIT License](./content/LICENSE)
- 抓取说明见 [content/SOURCE.md](./content/SOURCE.md)

如果原项目作者希望调整署名、同步内容或下线此阅读版，请通过仓库 Issue 联系处理。

## 设计说明

视觉上取「纸、墨、青绿、少量金色」的编辑设计语言：标题用宋体建立阅读感，正文用无衬线保证屏幕可读性，
青绿用于路径与进度，金色只用于强调。目标是让 20–40 分钟一篇的长文可以被真正读完，而不是做成另一个卡片堆叠的首页。
