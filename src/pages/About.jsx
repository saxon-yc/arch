import { Link } from 'react-router-dom'
import {
  ArrowUpRight, BookOpen, Check, Github, Heart, Lock, Map, ScanLine, Sparkles, Users,
} from 'lucide-react'
import { catalog } from '../lib/content'

export default function About() {
  return (
    <div className="page-shell about-page">
      <header className="about-hero">
        <span className="kicker">ABOUT THIS EDITION</span>
        <h1>把一份开源课程，<br />重新做成一张可以走的地图。</h1>
        <p>
          这个站点是 <a href={catalog.upstream} target="_blank" rel="noreferrer">study8677/awesome-architecture</a> 的
          <strong>非官方阅读体验重制版</strong>。内容版权与署名归原项目作者所有；我们重做了导航、排版、检索、
          学习进度与阅读器，让 40 多篇长文更适合被真正读完。
        </p>
        <div className="about-actions">
          <a className="button primary" href={catalog.upstream} target="_blank" rel="noreferrer">
            <Github size={16} /> 访问原仓库
          </a>
          <Link className="button ghost" to="/courses">开始阅读</Link>
        </div>
      </header>

      <section className="about-manifesto">
        <span className="about-big-mark">“</span>
        <blockquote>
          未来优秀的开发者，首先是一个会做架构判断的人，其次才是会写代码的人。
        </blockquote>
        <span>— 原项目 README</span>
      </section>

      <section className="about-section">
        <div className="section-head">
          <div>
            <span className="kicker">WHY REBUILD</span>
            <h2>为什么不直接看原站？</h2>
            <p>原站已经是一套完整的 VitePress 文档。这个版本解决的是另一个问题：长文阅读与持续学习。</p>
          </div>
        </div>
        <div className="about-grid">
          {[
            [ScanLine, '更长的注意力', '重新设计的正文排版、目录跟随、代码复制与字号控制，为 20–40 分钟一篇的长文准备。'],
            [Map, '一张连续的地图', '把 40 讲按判断力生长顺序分成六段，并提供三种学习走法，而不是一组平铺的链接。'],
            [Check, '进度看得见', '读到哪里、哪几讲完成、收藏了什么，全部记录在本地，随时可以继续。'],
            [Lock, '没有账号，没有追踪', '不需要登录，不上传阅读记录，不植入分析脚本。你的学习数据只属于你的浏览器。'],
          ].map(([Icon, title, copy]) => (
            <div className="about-feature" key={title}>
              <span className="about-feature-icon"><Icon size={19} /></span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="about-section about-numbers">
        <div className="about-number">
          <strong>{catalog.stats.allCourses}</strong>
          <span>讲课程</span>
          <p>40 章核心教程 + 1 个训练专题</p>
        </div>
        <div className="about-number">
          <strong>{catalog.stats.templates}</strong>
          <span>张架构地图</span>
          <p>经典系统、AI 原生、编码 Agent 与工业嵌入式</p>
        </div>
        <div className="about-number">
          <strong>{catalog.stats.cases}</strong>
          <span>个实战案例</span>
          <p>从抢票、SaaS 到 RAG 与编码 Agent 平台</p>
        </div>
        <div className="about-number">
          <strong>{catalog.stats.minutes}</strong>
          <span>分钟核心阅读</span>
          <p>不含模板与案例的延伸阅读</p>
        </div>
      </section>

      <section className="about-section about-columns">
        <div>
          <span className="kicker">CONTENT & LICENSE</span>
          <h2>内容如何被使用</h2>
          <p>
            所有课程、模板与案例正文来自原仓库，遵循 <a href={`${catalog.upstream}/blob/main/LICENSE`} target="_blank" rel="noreferrer">MIT License</a>。
            正文在构建时被转换为静态 HTML，本平台不修改原文语义，仅做站内链接重写、标题锚点与代码块增强。
          </p>
          <p>
            原项目作者：<a href="https://github.com/study8677" target="_blank" rel="noreferrer">JingWen Fan (@study8677)</a>。
            如果你喜欢这套内容，请去原仓库点一个 Star，或参与共建。
          </p>
          <div className="about-links">
            <a href={catalog.upstream} target="_blank" rel="noreferrer">GitHub 原仓库 <ArrowUpRight size={14} /></a>
            <a href={`${catalog.upstream}/issues`} target="_blank" rel="noreferrer">反馈内容问题 <ArrowUpRight size={14} /></a>
            <a href={`${catalog.upstream}#readme`} target="_blank" rel="noreferrer">项目 README <ArrowUpRight size={14} /></a>
          </div>
        </div>
        <div className="about-tech-card">
          <span className="kicker">UNDER THE HOOD</span>
          <h3>这个阅读版怎么工作</h3>
          <ul>
            <li><Check size={14} /> Vite + React 构建的静态站点</li>
            <li><Check size={14} /> Markdown 在构建时转为 HTML</li>
            <li><Check size={14} /> 搜索索引覆盖标题、摘要、章节与正文</li>
            <li><Check size={14} /> 学习进度写入 localStorage</li>
            <li><Check size={14} /> 无后端、无账号、无追踪</li>
          </ul>
          <div className="about-tech-foot">
            <BookOpen size={15} /> 可部署到任意静态托管
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="section-head">
          <div>
            <span className="kicker">CREDITS</span>
            <h2>致谢</h2>
          </div>
        </div>
        <div className="about-credits">
          <div>
            <Users size={18} />
            <h3>原作者与社区</h3>
            <p>感谢 JingWen Fan 与所有贡献者，把架构判断写成一套可读、可练、可讨论的公开课程。</p>
          </div>
          <div>
            <Heart size={18} />
            <h3>开源内容</h3>
            <p>本重制版仅用于阅读体验展示与学习。若原作者希望调整署名或下线，请联系处理。</p>
          </div>
          <div>
            <Sparkles size={18} />
            <h3>阅读版</h3>
            <p>由 Architecture Atlas 阅读版构建。设计目标只有一个：让好内容被读完。</p>
          </div>
        </div>
      </section>

      <section className="about-cta">
        <h2>地图已经摊开。</h2>
        <p>从第一讲开始，或者直接跳到你正在解决的问题。</p>
        <div>
          <Link className="button primary" to="/courses/01">开始第 01 讲</Link>
          <Link className="button ghost" to="/courses">浏览全部课程</Link>
        </div>
      </section>
    </div>
  )
}
