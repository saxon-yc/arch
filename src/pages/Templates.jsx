import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowUpRight, Clock3, Layers, Map, Search, Sparkles,
} from 'lucide-react'
import { catalog } from '../lib/content'

export default function Templates() {
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return catalog.templates.filter((item) => {
      if (category !== 'all' && item.category !== category) return false
      if (!q) return true
      return [item.title, item.summary, item.products, ...(item.highlights || [])]
        .join(' ')
        .toLowerCase()
        .includes(q)
    })
  }, [category, query])

  const counts = Object.fromEntries(catalog.templateCategories.map((item) => [
    item.id,
    item.id === 'all' ? catalog.templates.length : catalog.templates.filter((template) => template.category === item.id).length,
  ]))

  return (
    <div className="page-shell maps-page">
      <header className="page-head maps-head">
        <div className="page-head-copy">
          <span className="kicker">ARCHITECTURE MAPS</span>
          <h1>{catalog.stats.templates} 张地图，<br />读懂系统为什么这样长。</h1>
          <p>
            只讲架构，不讲语法。每张地图都按同一套 14 段结构展开：核心需求与约束、关键决策、
            数据流、失败模式、演进路径与常见误区。
          </p>
        </div>
        <div className="maps-legend">
          <div className="maps-legend-icon"><Map size={30} /></div>
          <div>
            <strong>1 套结构 × 31 个系统</strong>
            <span>读得越多，越快。因为你知道该去哪里找答案。</span>
          </div>
        </div>
      </header>

      <div className="library-toolbar">
        <div className="filter-chips">
          {catalog.templateCategories.map((item) => (
            <button
              key={item.id}
              className={category === item.id ? 'is-active' : ''}
              onClick={() => setCategory(item.id)}
            >
              {item.name} <em>{counts[item.id]}</em>
            </button>
          ))}
        </div>
        <label className="library-search">
          <Search size={15} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索系统、产品、技术点" />
        </label>
      </div>

      <div className="library-result-head">
        <span>{list.length} 张地图</span>
        <span>· 每个模板附真实开源项目 / 工程文档链接</span>
      </div>

      {list.length ? (
        <div className="template-grid">
          {list.map((item) => {
            const index = catalog.templates.findIndex((template) => template.id === item.id)
            return (
              <Link to={`/templates/${item.id}`} className={`template-card cat-${item.category}`} key={item.id}>
                <div className="template-card-head">
                  <span className="template-num">MAP {String(index + 1).padStart(2, '0')}</span>
                  <span className="template-cat">{catalog.templateCategories.find((cat) => cat.id === item.category)?.name}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                {item.products && <div className="template-products">{item.products}</div>}
                <div className="template-tags">
                  {item.highlights.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}
                </div>
                <div className="template-foot">
                  <span><Clock3 size={13} /> {item.minutes} 分钟</span>
                  <span>打开地图 <ArrowUpRight size={14} /></span>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="empty-panel">
          <Search size={24} />
          <h3>没有匹配的地图</h3>
          <p>试试「RAG」「支付」「Agent」这类更短的关键词。</p>
          <button className="button ghost" onClick={() => { setCategory('all'); setQuery('') }}>重置筛选</button>
        </div>
      )}

      <section className="template-method">
        <div className="template-method-copy">
          <span className="kicker">THE 14 SECTIONS</span>
          <h2>结构本身就是教学</h2>
          <p>
            每张地图都回答同样的 14 类问题。第一次读要从头看；第十次读，就能直接跳到「关键决策」。
            这不是为了整齐，而是因为真实设计也必须依次回答这些问题。
          </p>
          <Link className="text-link" to="/courses/18">先学怎么读地图 <ArrowUpRight size={15} /></Link>
        </div>
        <div className="template-sections">
          {[
            ['01', '核心需求与约束'], ['02', '规模与质量目标'], ['03', '总体架构'], ['04', '关键数据流'],
            ['05', '关键决策'], ['06', '失败模式'], ['07', '演进路径'], ['08', '常见误区'],
          ].map(([num, name]) => (
            <div className="template-section-item" key={num}>
              <span>{num}</span>
              <strong>{name}</strong>
            </div>
          ))}
          <div className="template-sections-more">+ 另外 6 段：安全、成本、观测、部署、取舍、延伸阅读</div>
        </div>
      </section>

      <section className="maps-footer-note">
        <Layers size={20} />
        <div>
          <h3>地图不是答案，是起点。</h3>
          <p>把模板当作设计对话的开场白：先抄结构，再问约束，最后做取舍。</p>
        </div>
        <div className="maps-footer-actions">
          <Link className="button primary" to="/cases">看案例如何落地 <Sparkles size={15} /></Link>
          <Link className="button ghost" to="/courses">回到课程</Link>
        </div>
      </section>
    </div>
  )
}
