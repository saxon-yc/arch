import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, ArrowUpRight, BookOpen, Clock3, Compass, FileText, Search, Sparkles,
} from 'lucide-react'
import { catalog } from '../lib/content'

export default function Articles() {
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return catalog.articles.filter((item) => {
      if (category !== 'all' && item.category !== category) return false
      if (!q) return true
      return [
        item.title,
        item.summary,
        item.sourceLabel,
        ...(item.tags || []),
        ...(item.sources || []).map((source) => source.name),
      ]
        .join(' ')
        .toLowerCase()
        .includes(q)
    })
  }, [category, query])

  return (
    <div className="page-shell articles-page">
      <header className="page-head articles-head">
        <div className="page-head-copy">
          <span className="kicker">CURATED READING</span>
          <h1>好文章很多，<br />留下结论的很少。</h1>
          <p>
            这里收录值得逐篇拆解的优秀文章。每一篇都不是转载，而是把原文读完、和站内课程对照，
            再写成一篇「结论」：它主张什么、证据有多硬、能改变哪个判断。
          </p>
        </div>
        <div className="cases-quote articles-quote">
          <span>“</span>
          <blockquote>读完只多了一个观点，那是消费；多了一条能指导决策的判断，才算收录。</blockquote>
          <small>优秀文章 · 收录标准</small>
        </div>
      </header>

      <div className="library-toolbar">
        <div className="filter-chips">
          {catalog.articleCategories.map((item) => {
            const count = item.id === 'all'
              ? catalog.articles.length
              : catalog.articles.filter((entry) => entry.category === item.id).length
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
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索文章、主题、关键词" />
        </label>
      </div>

      <div className="article-list">
        {list.map((item) => (
          <article className="article-feature" key={item.id}>
            <div className="article-feature-side">
              <span className="article-feature-num">{item.num}</span>
              <span className="article-feature-side-label">NO.</span>
            </div>
            <div className="article-feature-body">
              <div className="article-feature-meta">
                <span>{item.categoryName}</span>
                <span><FileText size={12} /> {item.sources?.length || 1} 篇来源</span>
                <span><Clock3 size={13} /> {item.minutes} 分钟</span>
              </div>
              <h2><Link to={`/articles/${item.id}`}>{item.title}</Link></h2>
              <p>{item.summary}</p>
              <div className="article-feature-tags">
                {(item.tags || []).map((tag) => <span key={tag}>{tag}</span>)}
              </div>
              <div className="article-feature-foot">
                <div className="article-feature-sources">
                  <span>出处</span>
                  {(item.sources || []).map((source) => (
                    <a key={source.url} href={source.url} target="_blank" rel="noreferrer" title={source.title}>
                      {source.name} <ArrowUpRight size={11} />
                    </a>
                  ))}
                </div>
                <Link to={`/articles/${item.id}`} className="article-read-link">
                  读归纳 <ArrowUpRight size={15} />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {!list.length && (
        <div className="empty-panel">
          <Search size={24} />
          <h3>没有匹配的文章</h3>
          <p>试试「多智能体」「评测」「组织」这类关键词。</p>
          <button className="button ghost" onClick={() => { setCategory('all'); setQuery('') }}>重置筛选</button>
        </div>
      )}

      <section className="case-method article-method">
        <div className="case-method-head">
          <span className="kicker">HOW TO READ A CURATED NOTE</span>
          <h2>读归纳时，盯住四个问题</h2>
        </div>
        <div className="case-question-grid article-question-grid">
          {[
            ['01', '它主张什么？', '一句话能不能说清，决定原文是不是真的有观点。'],
            ['02', '证据有多硬？', '单个客户案例、合成负载、厂商自述，都要打折。'],
            ['03', '和已知冲突吗？', '冲突往往是最好的入口，而不是要跳过的噪音。'],
            ['04', '什么条件下失效？', '没有边界条件的结论，不能拿去做决策。'],
          ].map(([num, title, copy]) => (
            <div className="case-question" key={num}>
              <span>{num}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="case-cta article-cta">
        <BookOpen size={24} />
        <div>
          <h2>下一站：把判断用起来</h2>
          <p>读完归纳，回到「评测驱动」与「架构品味」，把加减法变成你自己的判断。</p>
        </div>
        <Link className="button primary" to="/courses/25">读评测驱动 <ArrowRight size={15} /></Link>
        <Link className="button ghost" to="/courses/09">读架构品味 <Sparkles size={15} /></Link>
      </section>

      <section className="article-collect-note">
        <Compass size={20} />
        <div>
          <h3>好文章怎么进来？</h3>
          <p>
            收录不追求数量：优先一手材料，要求能对上站内课程，并且明确写出代价与局限。
            推荐入口在仓库的 <code>content/articles/README.md</code>，新增一篇按同一骨架写即可。
          </p>
        </div>
      </section>
    </div>
  )
}
