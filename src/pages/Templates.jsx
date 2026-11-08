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
          <p className="maps-breakdown">16 个经典 / 通用系统 · 5 个 AI 原生系统 · 4 个 AI 编码 / 自治 Agent · 1 个系统提示词架构 · 5 个工业 / 嵌入式系统</p>
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
        <div className="template-method-head">
          <div className="template-method-copy">
            <span className="kicker">THE 14 SECTIONS</span>
            <h2>结构本身就是教学</h2>
            <p>每张地图都按同一套结构展开。下面是这 14 段分别在回答什么问题。</p>
            <Link className="text-link" to="/courses/18">先学怎么读地图 <ArrowUpRight size={15} /></Link>
          </div>
          <div className="template-method-points">
            <p><strong>越读越快。</strong>你第一次读要从头看，第十次读，就能直接跳到「关键决策」那一节。</p>
            <p><strong>结构本身就是教学。</strong>这 14 段，正好就是你设计任何系统时该依次问自己的 14 类问题。</p>
          </div>
        </div>
        <div className="template-sections">
          {[
            ['01', '一句话定位', '这东西到底是什么？'],
            ['02', '业务本质', '它在解决什么真实问题？谁付钱？'],
            ['03', '核心需求与约束', '功能要做什么？非功能（质量）要满足什么？'],
            ['04', '架构全景图', '整体长什么样？（一张 ASCII 图）'],
            ['05', '组件职责', '每个部件干什么？为什么需要它？'],
            ['06', '关键数据流', '核心场景下，请求 / 数据怎么流动？'],
            ['07', '数据模型与存储', '存什么？为什么用这种存储？'],
            ['08', '关键决策与权衡', '在哪些岔路口做了选择？放弃了什么？'],
            ['09', '规模化与瓶颈', '用户涨 100 倍，第一个会死的是哪？'],
            ['10', '安全与合规', '哪里是攻击面？哪些数据碰不得？'],
            ['11', '常见误区 / 反模式', '新手最容易在哪里把它做错？'],
            ['12', '演进路线', 'MVP → 成长期 → 成熟期，每阶段架构长什么样？'],
            ['13', '可复用要点', '哪些思想能搬到别的系统上？'],
            ['14', '参考原型与延伸阅读', '它的真实原型是哪些开源项目 / 公开文档？'],
          ].map(([num, name, question]) => (
            <div className="template-section-item" key={num}>
              <span>{num}</span>
              <div>
                <strong>{name}</strong>
                <em>{question}</em>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="template-guide" id="template-guide">
        <div className="template-guide-head">
          <div>
            <span className="kicker">READING NOTES</span>
            <h2>怎么用这些地图</h2>
            <p>别把模板当成要背下来的标准答案。它们更像一份设计对话的开场白：先看约束，再看选择，最后问自己「如果是我，会放弃什么」。</p>
          </div>
          <a className="text-link" href={`${catalog.upstream}/blob/main/templates/README.md`} target="_blank" rel="noreferrer">
            查看源站原文 <ArrowUpRight size={15} />
          </a>
        </div>

        <div className="template-guide-grid">
          <article className="guide-card guide-reading">
            <span className="guide-num">01 / 阅读建议</span>
            <h3>别死记图</h3>
            <p>记住的应该是「<strong>为什么</strong>这么连」，而不是「这里有几个框」。同一个系统，换个规模或换个约束，图就完全不同。</p>
            <h3>重点看第 8、9、11 段</h3>
            <p>这三段（决策权衡、瓶颈、误区）是浓缩了真实经验的部分，也是面试和实战最值钱的部分。</p>
            <h3>对照第 12 段（演进）看自己</h3>
            <p>你现在做的东西，大概率不需要成熟期那套重型架构。看清楚自己在哪个阶段，避免过度设计。</p>
          </article>

          <article className="guide-card guide-truth">
            <span className="guide-num">02 / 真实性说明</span>
            <h3>这些不是公司内部图纸</h3>
            <p>这些模板基于产品<strong>公开披露的架构理念、工程博客、技术演讲和业界通行实践</strong>整理而成，目的是教学：抓住这类系统架构上的共性与关键取舍。</p>
            <p>它们不是任何公司的内部真实图纸，具体数字、组件命名做了通用化处理。把它们当作「这一类系统的典型架构长这样」来理解，而不是「某公司就是这么实现的」。</p>
            <div className="guide-note">读的是推理过程，不是某张「标准答案图」。</div>
          </article>

          <article className="guide-card guide-contribute">
            <span className="guide-num">03 / 贡献模板</span>
            <h3>想贡献一个新模板？</h3>
            <ol>
              <li>复制 <code>_TEMPLATE.md</code> 到一个新目录，比如 <code>templates/your-system/README.md</code>。</li>
              <li>把 14 段逐一填满（含给出真实的参考原型链接），坚持只讲架构——一旦你开始写「用 XX 语言的 YY 库」，就停下来问自己：这是架构决策，还是实现细节？</li>
              <li>图用 ASCII 画：纯文本、到处都能看、永不失效。</li>
              <li>在模板清单表格里加一行。</li>
            </ol>
            <a className="guide-link" href={`${catalog.upstream}/blob/main/templates/_TEMPLATE.md`} target="_blank" rel="noreferrer">
              打开模板规范 <ArrowUpRight size={14} />
            </a>
          </article>
        </div>

        <blockquote className="template-standard">
          <span>STANDARD</span>
          一个没接触过这个领域的工程师，读完你的模板，能讲清楚「这类系统为什么这么设计、会死在哪」。
        </blockquote>
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
