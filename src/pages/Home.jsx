import { Link } from 'react-router-dom'
import {
  ArrowRight, ArrowUpRight, BookOpen, Clock3, Compass, Layers, Map, Sparkles,
} from 'lucide-react'
import { useApp } from '../lib/progress'
import { catalog, trackCourses } from '../lib/content'
import ProgressRing from '../components/ProgressRing'

const NODE_POSITIONS = [
  { x: 13, y: 14 },
  { x: 77, y: 10 },
  { x: 87, y: 50 },
  { x: 65, y: 82 },
  { x: 17, y: 82 },
  { x: 10, y: 48 },
]

const START_HERE = [
  {
    num: '01',
    kicker: '如果你只有一小时',
    title: '为什么先有架构思维',
    copy: '先换一个视角：为什么「判断力」正在比「实现力」更稀缺。',
    to: '/courses/01',
  },
  {
    num: '07',
    kicker: '如果你想立刻上手',
    title: '从 0 到 1 设计一个系统',
    copy: '跟着一套八步方法，把模糊需求推成一份能评审的架构方案。',
    to: '/courses/07',
  },
  {
    num: '22',
    kicker: '如果你正在写 AI 产品',
    title: 'AI 原生系统设计',
    copy: '把非确定性、上下文与成本，变成系统结构里可被设计的约束。',
    to: '/courses/22',
  },
]

const FEATURED_TEMPLATES = ['ai-chat-product', 'standard-web-app', 'rag-knowledge-base', 'claude-code']
const FEATURED_CASES = ['stararena-ticketing', 'documind-rag', 'syncroom-collaboration']

function HeroAtlas() {
  const { completedCourses, totalCourses, lastRead, progress } = useApp()
  const percent = totalCourses ? (completedCourses / totalCourses) * 100 : 0
  const next = lastRead?.doc || catalog.courses[0]
  const nextPercent = progress[`course:${next.id}`]?.percent || 0

  return (
    <div className="hero-atlas" aria-label="架构图谱概览">
      <div className="hero-atlas-head">
        <span><Compass size={13} /> THE ATLAS</span>
        <span>{catalog.tracks.length - 1} TRACKS / 1 SPECIAL</span>
      </div>

      <div className="atlas-canvas">
        <div className="atlas-grid" aria-hidden="true" />
        <svg className="atlas-lines" viewBox="0 0 400 300" preserveAspectRatio="none" aria-hidden="true">
          <circle cx="200" cy="150" r="104" fill="none" stroke="var(--line)" strokeDasharray="2 7" />
          <circle cx="200" cy="150" r="64" fill="none" stroke="var(--line)" strokeDasharray="1 8" />
          {NODE_POSITIONS.map((pos, index) => (
            <line
              key={index}
              x1="200"
              y1="150"
              x2={pos.x * 4}
              y2={pos.y * 3}
              stroke="var(--line)"
              strokeDasharray="3 6"
            />
          ))}
        </svg>
        <div className="atlas-center">
          <span>先看地图</span>
          <strong>架构判断</strong>
          <em>40 + 1</em>
        </div>
        {catalog.tracks.filter((track) => track.id !== 'special').map((track, index) => {
          const pos = NODE_POSITIONS[index]
          const chapters = trackCourses(track.id)
          const done = chapters.filter((course) => progress[`course:${course.id}`]?.completed).length
          const active = Math.round((done / chapters.length) * 100)
          return (
            <Link
              key={track.id}
              to={`/courses/${chapters[0]?.id || '01'}`}
              className="atlas-node"
              style={{ left: `${pos.x}%`, top: `${pos.y}%`, '--track-color': track.color }}
            >
              <span className="atlas-node-range">{track.range}</span>
              <span className="atlas-node-name">{track.name}</span>
              <span className="atlas-node-bar"><i style={{ width: `${active}%` }} /></span>
            </Link>
          )
        })}
        <span className="atlas-caption">把 40 讲连成一张可走的地图</span>
      </div>

      <div className="hero-atlas-foot">
        <ProgressRing value={percent} size={46} stroke={3} />
        <div className="hero-resume">
          <span>{completedCourses ? '继续你的学习' : '从第一讲开始'}</span>
          <strong>{next.num ? `${next.num} · ` : ''}{next.title}</strong>
        </div>
        <Link to={`/courses/${next.id}`} className="hero-resume-link" aria-label="继续阅读">
          <ArrowRight size={18} />
        </Link>
      </div>
      <div className="hero-atlas-progress"><span style={{ width: `${nextPercent}%` }} /></div>
    </div>
  )
}

export default function Home() {
  const { completedCourses, totalCourses, progress } = useApp()
  const templates = FEATURED_TEMPLATES.map((id) => catalog.templates.find((item) => item.id === id)).filter(Boolean)
  const cases = FEATURED_CASES.map((id) => catalog.cases.find((item) => item.id === id)).filter(Boolean)
  const totalMinutes = catalog.stats.minutes

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            AWESOME ARCHITECTURE · 在线阅读版
          </div>
          <h1>
            先看地图，<br />
            <span className="hero-em">再上路。</span>
          </h1>
          <p className="hero-lead">
            一套关于「系统该长什么样」的课程。40 章核心内容、31 张架构地图、6 个实战案例，
            从判断框架一路走到 AI 原生系统与组织。
          </p>
          <div className="hero-actions">
            <Link className="button primary" to={completedCourses ? '/me' : '/courses/01'}>
              {completedCourses ? '继续学习' : '从第 01 讲开始'}
              <ArrowRight size={17} />
            </Link>
            <Link className="button ghost" to="/paths">
              查看学习路径
            </Link>
          </div>
          <div className="hero-meta">
            <span><BookOpen size={15} /> {catalog.stats.coreCourses} 章 + 1 专题</span>
            <span><Map size={15} /> {catalog.stats.templates} 张地图</span>
            <span><Clock3 size={15} /> 约 {Math.round(totalMinutes / 60)} 小时</span>
          </div>
        </div>
        <HeroAtlas />
      </section>

      <section className="stat-band" aria-label="内容统计">
        <div className="stat-band-inner">
          <div className="stat">
            <strong>{catalog.stats.allCourses}</strong>
            <span>讲课程</span>
            <small>核心 40 章 + T01 专题</small>
          </div>
          <div className="stat">
            <strong>{catalog.stats.templates}</strong>
            <span>张架构地图</span>
            <small>经典系统 / AI 原生 / 工业嵌入式</small>
          </div>
          <div className="stat">
            <strong>{catalog.stats.cases}</strong>
            <span>个实战案例</span>
            <small>从 0 到上线，再扛住真实压力</small>
          </div>
          <div className="stat">
            <strong>{completedCourses}<em>/{totalCourses}</em></strong>
            <span>你的进度</span>
            <small>{completedCourses ? '继续保持，路还很长' : '所有记录只保存在本地'}</small>
          </div>
        </div>
      </section>

      <section className="section track-section">
        <div className="section-head">
          <div>
            <span className="kicker">LEARNING MAP</span>
            <h2>六段路，一张图</h2>
            <p>从建立思维到组织落地。每一段都能独立读，但连起来才是完整的架构判断力。</p>
          </div>
          <Link className="text-link" to="/paths">完整路径 <ArrowUpRight size={15} /></Link>
        </div>
        <div className="track-grid">
          {catalog.tracks.filter((track) => track.id !== 'special').map((track, index) => {
            const chapters = trackCourses(track.id)
            const done = chapters.filter((course) => progress[`course:${course.id}`]?.completed).length
            const ratio = chapters.length ? (done / chapters.length) * 100 : 0
            return (
              <Link
                key={track.id}
                to={`/courses/${chapters[0]?.id || '01'}`}
                className="track-card"
                style={{ '--track-color': track.color }}
              >
                <div className="track-card-top">
                  <span className="track-index">0{index + 1}</span>
                  <span className="track-range">{track.range}</span>
                </div>
                <h3>{track.name}</h3>
                <p className="track-tagline">{track.tagline}</p>
                <p className="track-desc">{track.description}</p>
                <div className="track-card-foot">
                  <span>{chapters.length} 讲 · {track.minutes} 分钟</span>
                  {done > 0 ? <span className="track-done">{done}/{chapters.length} 已读</span> : <span>未开始</span>}
                </div>
                <span className="track-progress"><i style={{ width: `${ratio}%` }} /></span>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="section start-section">
        <div className="section-head">
          <div>
            <span className="kicker">START HERE</span>
            <h2>不用从头开始，从需要的地方开始</h2>
          </div>
          <Link className="text-link" to="/courses">全部 {catalog.stats.allCourses} 讲 <ArrowUpRight size={15} /></Link>
        </div>
        <div className="start-grid">
          {START_HERE.map((item) => (
            <Link key={item.num} to={item.to} className="start-card">
              <div className="start-card-num">{item.num}</div>
              <div className="start-card-body">
                <span>{item.kicker}</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </div>
              <span className="start-arrow"><ArrowUpRight size={18} /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section maps-section">
        <div className="section-head">
          <div>
            <span className="kicker">ARCHITECTURE MAPS</span>
            <h2>把陌生系统，看成一张可以读的地图</h2>
            <p>每个模板都遵循同一套 14 段结构：约束、关键决策、失败模式、演进路径。</p>
          </div>
          <Link className="text-link" to="/templates">全部 {catalog.stats.templates} 张 <ArrowUpRight size={15} /></Link>
        </div>
        <div className="map-grid">
          {templates.map((item, index) => (
            <Link to={`/templates/${item.id}`} className="map-card" key={item.id}>
              <div className="map-card-head">
                <span className="map-index">MAP {String(index + 1).padStart(2, '0')}</span>
                <span className="map-time"><Clock3 size={13} /> {item.minutes} 分钟</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
              <div className="map-products">{item.products}</div>
              <div className="map-tags">
                {item.highlights.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}
              </div>
              <span className="map-open">打开地图 <ArrowUpRight size={14} /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section cases-section">
        <div className="section-head">
          <div>
            <span className="kicker">FIELD NOTES</span>
            <h2>真实系统里，取舍长什么样</h2>
            <p>不是更多模板，而是把「为什么最后被约束逼成这样」的推理过程写出来。</p>
          </div>
          <Link className="text-link" to="/cases">全部 {catalog.stats.cases} 个 <ArrowUpRight size={15} /></Link>
        </div>
        <div className="case-grid">
          {cases.map((item) => (
            <Link key={item.id} to={`/cases/${item.id}`} className="case-card">
              <div className="case-card-top">
                <span className="case-num">{item.num}</span>
                <span className="case-time">{item.minutes} 分钟</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
              <div className="case-templates">
                {item.templates.slice(0, 3).map((name) => <span key={name}>{name}</span>)}
              </div>
              <span className="case-open">读案例 <ArrowUpRight size={14} /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="manifesto">
        <div className="manifesto-inner">
          <Sparkles size={20} />
          <blockquote>
            架构没有标准答案，只有在特定约束下「更合理」的答案。
            这套课程给你的不是结论，而是<span>提问的能力</span>。
          </blockquote>
          <span className="manifesto-source">— 教程总览 · 一个提醒</span>
          <div className="manifesto-actions">
            <Link className="button light" to="/courses/01">现在开始 <ArrowRight size={16} /></Link>
            <Link className="button outline-light" to="/about">关于这个阅读版</Link>
          </div>
        </div>
        <div className="manifesto-mark" aria-hidden="true">A</div>
      </section>

      <section className="section how-section">
        <div className="how-item">
          <Layers size={21} />
          <h3>一条连续的路径</h3>
          <p>课程按判断力生长顺序编排，也能按主题跳读。读完每一讲，进度自动记录。</p>
        </div>
        <div className="how-item">
          <Map size={21} />
          <h3>地图与课程互相印证</h3>
          <p>每学完一个方法，都能在模板库里找到真实系统的对应结构，不用凭空想象。</p>
        </div>
        <div className="how-item">
          <Compass size={21} />
          <h3>为阅读而设计</h3>
          <p>目录、字号、主题、代码复制与阅读进度，都为长时间阅读做了取舍。</p>
        </div>
      </section>
    </div>
  )
}
