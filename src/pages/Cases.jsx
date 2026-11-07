import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, ArrowUpRight, Clock3, Compass, Search, Sparkles,
} from 'lucide-react'
import { catalog } from '../lib/content'

export default function Cases() {
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return catalog.cases.filter((item) => {
      if (category !== 'all' && item.category !== category) return false
      if (!q) return true
      return [item.title, item.summary, ...(item.templates || []), ...(item.learn || [])]
        .join(' ')
        .toLowerCase()
        .includes(q)
    })
  }, [category, query])

  return (
    <div className="page-shell cases-page">
      <header className="page-head cases-head">
        <div className="page-head-copy">
          <span className="kicker">FIELD NOTES</span>
          <h1>六个故事，<br />关于约束如何逼出架构。</h1>
          <p>
            案例不是「更多模板」。它把某个具体项目从 0 推到上线，再推到真实压力下，
            让你看见每一个决定背后的数字、取舍与后悔。
          </p>
        </div>
        <div className="cases-quote">
          <span>“</span>
          <blockquote>没有数字，不是案例；没有取舍，不是架构；没有演进，不配进案例篇。</blockquote>
          <small>案例篇 · 阅读标准</small>
        </div>
      </header>

      <div className="library-toolbar">
        <div className="filter-chips">
          {catalog.caseCategories.map((item) => {
            const count = item.id === 'all' ? catalog.cases.length : catalog.cases.filter((entry) => entry.category === item.id).length
            return (
              <button
                key={item.id}
                className={category === item.id ? 'is-active' : ''}
                onClick={() => setCategory(item.id)}
              >
                {item.name} <em>{count}</em>
              </button>
            )
          })}
        </div>
        <label className="library-search">
          <Search size={15} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索案例、技术点" />
        </label>
      </div>

      <div className="case-list">
        {list.map((item) => (
          <article className="case-feature" key={item.id}>
            <div className="case-feature-num">{item.num}</div>
            <div className="case-feature-body">
              <div className="case-feature-meta">
                <span>{catalog.caseCategories.find((cat) => cat.id === item.category)?.name}</span>
                <span><Clock3 size={13} /> {item.minutes} 分钟</span>
              </div>
              <h2><Link to={`/cases/${item.id}`}>{item.title}</Link></h2>
              <p>{item.summary}</p>
              <div className="case-feature-tags">
                {item.learn.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
              <div className="case-feature-foot">
                <div className="case-feature-templates">
                  <span>对应地图</span>
                  {item.templates.map((name) => <em key={name}>{name}</em>)}
                </div>
                <Link to={`/cases/${item.id}`} className="case-read-link">读完整案例 <ArrowUpRight size={15} /></Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {!list.length && (
        <div className="empty-panel">
          <Search size={24} />
          <h3>没有匹配的案例</h3>
          <p>试试「抢票」「RAG」「协同」这类关键词。</p>
          <button className="button ghost" onClick={() => { setCategory('all'); setQuery('') }}>重置筛选</button>
        </div>
      )}

      <section className="case-method">
        <div className="case-method-head">
          <span className="kicker">HOW TO READ A CASE</span>
          <h2>读案例时，盯住四个问题</h2>
        </div>
        <div className="case-question-grid">
          {[
            ['01', '旧架构为什么一开始是合理的？', '先理解约束，再评判选择。'],
            ['02', '哪个量化信号说明它不能继续用了？', '没有触发的演进，只是折腾。'],
            ['03', '新架构做了什么选择，又放弃了什么？', '每个收益背面都有一张账单。'],
            ['04', '如果约束变了，这个答案还成立吗？', '案例的价值是推理，不是结论。'],
          ].map(([num, title, copy]) => (
            <div className="case-question" key={num}>
              <span>{num}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="case-cta">
        <Compass size={24} />
        <div>
          <h2>想自己走一遍？</h2>
          <p>读完案例，回到第 07 讲的方法，找一个你熟悉的系统重新拆一次。</p>
        </div>
        <Link className="button primary" to="/courses/07">打开设计方法 <ArrowRight size={15} /></Link>
        <Link className="button ghost" to="/templates">浏览架构地图 <Sparkles size={15} /></Link>
      </section>
    </div>
  )
}
