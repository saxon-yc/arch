import { Link } from 'react-router-dom'
import {
  ArrowRight, ArrowUpRight, Check, Clock3, Compass, Flag, Layers3, Route,
} from 'lucide-react'
import { catalog, trackCourses } from '../lib/content'
import { useApp } from '../lib/progress'

const PLANS = [
  {
    id: 'system',
    label: '系统通关',
    time: '8 周 · 每周 1 篇',
    desc: '按 01 → 40 顺序走完，适合想把架构判断补成完整体系的人。',
    steps: ['01', '07', '12', '17', '22', '26', '34', '40'],
    tone: 'teal',
  },
  {
    id: 'interview',
    label: '面试冲刺',
    time: '10 天 · 每天 1 小时',
    desc: '从高频系统设计题切入，用案例和模板快速建立结构化表达。',
    steps: ['02', '04', '07', '10', '12', '13', '19', '34'],
    tone: 'orange',
  },
  {
    id: 'ai',
    label: 'AI 产品路线',
    time: '4 周 · 边做边读',
    desc: '面向正在做 AI 产品的团队：先补 AI 原生约束，再补协同与治理。',
    steps: ['17', '19', '22', '23', '24', '25', '26', '37'],
    tone: 'violet',
  },
]

export default function Paths() {
  const { progress, completedUids, completedCourses, totalCourses } = useApp()
  const percent = totalCourses ? Math.round((completedCourses / totalCourses) * 100) : 0

  return (
    <div className="page-shell paths-page">
      <header className="page-head paths-head">
        <div className="page-head-copy">
          <span className="kicker">READING PATHS</span>
          <h1>一条有坡度，<br />但没有弯路的路径。</h1>
          <p>
            课程不是知识点的堆叠，而是判断力的生长顺序。从「什么是架构」到「组织如何 AI 原生」，
            每一段都在为下一段准备语言。
          </p>
        </div>
        <div className="path-summary">
          <div>
            <span>全程</span>
            <strong>{Math.round(catalog.stats.minutes / 60)} <em>小时</em></strong>
          </div>
          <div>
            <span>课程</span>
            <strong>{catalog.stats.allCourses} <em>讲</em></strong>
          </div>
          <div>
            <span>你的进度</span>
            <strong>{percent}<em>%</em></strong>
          </div>
        </div>
      </header>

      <div className="path-layout">
        <div className="path-timeline">
          {catalog.tracks.map((track, index) => {
            const chapters = trackCourses(track.id)
            const done = chapters.filter((course) => completedUids.has(`course:${course.id}`)).length
            const ratio = chapters.length ? Math.round((done / chapters.length) * 100) : 0
            return (
              <section className="path-stage" key={track.id} style={{ '--track-color': track.color }}>
                <div className="path-stage-rail">
                  <span className="path-dot">{String(index + 1).padStart(2, '0')}</span>
                  {index < catalog.tracks.length - 1 && <span className="path-line" />}
                </div>
                <div className="path-stage-body">
                  <div className="path-stage-head">
                    <div>
                      <span className="path-range">{track.range}</span>
                      <h2>{track.name}</h2>
                      <p className="path-tagline">{track.tagline}</p>
                    </div>
                    <div className="path-stage-meta">
                      <span><Clock3 size={14} /> {track.minutes} 分钟</span>
                      <span>{done}/{chapters.length} 已读</span>
                    </div>
                  </div>

                  <p className="path-description">{track.description || '独立专题：先看能力目标、数据与学习信号，再判断训练方案。'}</p>
                  {track.outcome && (
                    <div className="path-outcome">
                      <Flag size={15} />
                      <span>走完这一段，你应该能：{track.outcome}</span>
                    </div>
                  )}

                  <div className="path-chapters">
                    {chapters.map((course) => {
                      const completed = completedUids.has(`course:${course.id}`)
                      const reading = (progress[`course:${course.id}`]?.percent || 0) > 0
                      return (
                        <Link key={course.id} to={`/courses/${course.id}`} className={`path-chapter ${completed ? 'is-done' : ''}`}>
                          <span className="path-chapter-num">{completed ? <Check size={13} /> : course.num}</span>
                          <span className="path-chapter-title">{course.title}</span>
                          <span className="path-chapter-time">{course.minutes}′</span>
                          {reading && !completed && <span className="path-chapter-dot" />}
                        </Link>
                      )
                    })}
                  </div>

                  <div className="path-progress-label">
                    <span>本段进度</span>
                    <span>{ratio}%</span>
                  </div>
                  <div className="path-progress"><i style={{ width: `${ratio}%` }} /></div>
                </div>
              </section>
            )
          })}
        </div>

        <aside className="path-aside">
          <div className="aside-card">
            <span className="kicker">HOW TO READ</span>
            <h3>三个阅读原则</h3>
            <ol className="aside-list">
              <li><strong>先问题，后答案。</strong>每章先看标题和开头的问题，带着它去读。</li>
              <li><strong>停下来画图。</strong>遇到架构图，先遮住答案自己画一遍。</li>
              <li><strong>用模板对照。</strong>读完一章，去模板库找对应系统，看结构如何落地。</li>
            </ol>
          </div>
          <div className="aside-card aside-accent">
            <Compass size={19} />
            <h3>不确定从哪开始？</h3>
            <p>如果你只有一小时，先读第 01 讲；如果你明天要评审方案，直接跳到第 07 讲。</p>
            <Link to="/courses/01">打开第 01 讲 <ArrowRight size={14} /></Link>
          </div>
          <div className="aside-card">
            <span className="kicker">COMPLETION</span>
            <h3>读完之后</h3>
            <div className="aside-check"><Check size={14} /> 能拆解一个陌生系统的约束</div>
            <div className="aside-check"><Check size={14} /> 能画出 C4 与关键数据流</div>
            <div className="aside-check"><Check size={14} /> 能写出带取舍的 ADR</div>
            <div className="aside-check"><Check size={14} /> 能审查 AI 产出的默认缺口</div>
          </div>
        </aside>
      </div>

      <section className="plans-section">
        <div className="section-head">
          <div>
            <span className="kicker">THREE WAYS IN</span>
            <h2>三种走法，按你的处境选</h2>
          </div>
        </div>
        <div className="plans-grid">
          {PLANS.map((plan) => (
            <div className={`plan-card plan-${plan.tone}`} key={plan.id}>
              <div className="plan-card-top">
                <span>{plan.time}</span>
                <Route size={18} />
              </div>
              <h3>{plan.label}</h3>
              <p>{plan.desc}</p>
              <div className="plan-steps">
                {plan.steps.map((num) => {
                  const course = catalog.courses.find((item) => item.num === num)
                  if (!course) return null
                  return (
                    <Link key={num} to={`/courses/${course.id}`} title={course.title}>
                      {num}
                    </Link>
                  )
                })}
              </div>
              <Link className="plan-link" to="/courses">按这个顺序开始 <ArrowUpRight size={14} /></Link>
            </div>
          ))}
        </div>
      </section>

      <section className="path-final">
        <Layers3 size={22} />
        <div>
          <h2>课程是方法，模板是地图，案例是路况。</h2>
          <p>把三者交错着读，比一次性刷完课程更接近真实的架构工作。</p>
        </div>
        <div className="path-final-actions">
          <Link className="button primary" to="/templates">看架构地图 <ArrowRight size={15} /></Link>
          <Link className="button ghost" to="/cases">读实战案例</Link>
        </div>
      </section>
    </div>
  )
}
