import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, ArrowUpRight, Bookmark, BookmarkCheck, Check, CheckCircle2,
  ChevronLeft, ChevronRight, Clock3, Copy, FileText, List, Minus, Moon, Plus,
  Settings2, Sun, X,
} from 'lucide-react'
import {
  appendixById, articleById, caseById, catalog, courseById, findDoc, formatMinutes, getPrevNext,
  loadDoc, templateById, trackById, typeLabel,
} from '../lib/content'
import { useApp } from '../lib/progress'

function findMeta(type, id) {
  if (type === 'course') return courseById.get(id)
  if (type === 'appendix') return appendixById.get(id)
  if (type === 'template') return templateById.get(id)
  if (type === 'case') return caseById.get(id)
  if (type === 'article') return articleById.get(id)
  return null
}

function resolveType(type, id) {
  if (type === 'course' && appendixById.has(id)) return 'appendix'
  return type
}

function docPath(type, id) {
  if (type === 'template') return `/templates/${id}`
  if (type === 'case') return `/cases/${id}`
  if (type === 'article') return `/articles/${id}`
  return `/courses/${id}`
}

function ReaderNav({ type, activeId, progress, completedUids, onNavigate }) {
  if (type === 'course' || type === 'appendix') {
    return (
      <div className="reader-nav-groups">
        {catalog.tracks.map((track) => {
          const chapters = track.chapterIds.map((id) => courseById.get(id)).filter(Boolean)
          if (!chapters.length) return null
          const done = chapters.filter((course) => completedUids.has(`course:${course.id}`)).length
          return (
            <div className="reader-nav-group" key={track.id} style={{ '--track-color': track.color }}>
              <div className="reader-nav-group-head">
                <span>{track.name}</span>
                <em>{done}/{chapters.length}</em>
              </div>
              {chapters.map((course) => {
                const active = activeId === course.id && type === 'course'
                const completed = completedUids.has(`course:${course.id}`)
                const percent = progress[`course:${course.id}`]?.percent || 0
                return (
                  <Link
                    key={course.id}
                    to={`/courses/${course.id}`}
                    className={`reader-nav-item ${active ? 'is-active' : ''} ${completed ? 'is-done' : ''}`}
                    onClick={onNavigate}
                  >
                    <span className="reader-nav-num">{completed ? <Check size={11} /> : course.num}</span>
                    <span className="reader-nav-title">{course.title}</span>
                    {!completed && percent > 0 && <i className="reader-nav-pip" />}
                  </Link>
                )
              })}
            </div>
          )
        })}
        <div className="reader-nav-group">
          <div className="reader-nav-group-head"><span>附录</span></div>
          {catalog.appendices.map((item) => (
            <Link
              key={item.id}
              to={`/courses/${item.id}`}
              className={`reader-nav-item ${activeId === item.id && type === 'appendix' ? 'is-active' : ''}`}
              onClick={onNavigate}
            >
              <span className="reader-nav-num"><FileText size={12} /></span>
              <span className="reader-nav-title">{item.title}</span>
            </Link>
          ))}
        </div>
      </div>
    )
  }

  const items = type === 'template' ? catalog.templates : type === 'article' ? catalog.articles : catalog.cases
  const groupName = type === 'template' ? '架构地图' : type === 'article' ? '优秀文章' : '实战案例'
  return (
    <div className="reader-nav-groups">
      <div className="reader-nav-group">
        <div className="reader-nav-group-head">
          <span>{groupName}</span>
          <em>{items.length}</em>
        </div>
        {items.map((item, index) => (
          <Link
            key={item.id}
            to={docPath(type, item.id)}
            className={`reader-nav-item ${activeId === item.id ? 'is-active' : ''} ${type === 'template' ? 'reader-nav-compact' : ''}`}
            onClick={onNavigate}
          >
            <span className="reader-nav-num">{type === 'case' || type === 'article' ? item.num : String(index + 1).padStart(2, '0')}</span>
            <span className="reader-nav-title">{item.title}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

function ReaderToc({ headings, activeHeading, progress, onJump, fontSize, setFontSize, theme, toggleTheme, wide, setWide, tocTitle }) {
  const [settingsOpen, setSettingsOpen] = useState(false)
  return (
    <aside className="reader-aside">
      <div className="toc-card">
        <div className="toc-head">
          <span><List size={14} /> {tocTitle}</span>
          <button className={`icon-button subtle ${settingsOpen ? 'is-active' : ''}`} onClick={() => setSettingsOpen((open) => !open)} aria-label="阅读设置">
            <Settings2 size={16} />
          </button>
        </div>

        {settingsOpen && (
          <div className="reader-settings">
            <div className="setting-row">
              <span>字号</span>
              <div className="size-control">
                <button onClick={() => setFontSize(Math.max(16, fontSize - 1))} aria-label="减小字号"><Minus size={13} /></button>
                <em>{fontSize}</em>
                <button onClick={() => setFontSize(Math.min(24, fontSize + 1))} aria-label="增大字号"><Plus size={13} /></button>
              </div>
            </div>
            <div className="setting-row">
              <span>主题</span>
              <button className="setting-theme" onClick={toggleTheme}>
                {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
                {theme === 'light' ? '深色' : '浅色'}
              </button>
            </div>
            <div className="setting-row">
              <span>版式</span>
              <button className={`setting-wide ${wide ? 'is-active' : ''}`} onClick={() => setWide(!wide)}>
                {wide ? '宽屏' : '舒适'}
              </button>
            </div>
          </div>
        )}

        <nav className="toc-list">
          {headings.map((heading) => (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              className={`${heading.depth === 3 ? 'toc-sub' : ''} ${activeHeading === heading.id ? 'is-active' : ''}`}
              onClick={(event) => {
                event.preventDefault()
                onJump(heading.id)
              }}
            >
              {heading.text}
            </a>
          ))}
        </nav>
      </div>

      <div className="reading-status">
        <div className="reading-status-head">
          <span>阅读位置</span>
          <strong>{progress}%</strong>
        </div>
        <div className="reading-status-bar"><i style={{ width: `${progress}%` }} /></div>
        <p>进度自动保存在本地，随时可以回来。</p>
      </div>
    </aside>
  )
}

export default function Reader({ type: baseType }) {
  const { slug } = useParams()
  const type = resolveType(baseType, slug)
  const meta = useMemo(() => findMeta(type, slug), [type, slug])
  const [doc, setDoc] = useState(null)
  const [error, setError] = useState(null)
  const [progressValue, setProgressValue] = useState(0)
  const [activeHeading, setActiveHeading] = useState('')
  const [mobilePanel, setMobilePanel] = useState(null)
  const [drawerTab, setDrawerTab] = useState('nav')
  const articleRef = useRef(null)
  const visitedRef = useRef(null)
  const lastSaved = useRef(0)
  const navigate = useNavigate()

  const {
    progress, setReadingPercent, toggleComplete, completedUids, markVisited, bookmarks,
    toggleBookmark, showToast, readerPrefs, setReaderPrefs, theme, toggleTheme,
  } = useApp()

  const uid = `${type}:${slug}`
  const completed = completedUids.has(uid)
  const bookmarked = bookmarks.includes(uid)
  const currentProgress = progress[uid] || {}
  const fontSize = readerPrefs.fontSize || 19
  const wide = Boolean(readerPrefs.wide)

  const setFontSize = (value) => setReaderPrefs({ ...readerPrefs, fontSize: value })
  const setWide = (value) => setReaderPrefs({ ...readerPrefs, wide: value })

  useEffect(() => {
    let cancelled = false
    setDoc(null)
    setError(null)
    setProgressValue(0)
    lastSaved.current = 0
    if (!meta) {
      setError('not-found')
      return undefined
    }
    loadDoc(meta.key)
      .then((data) => {
        if (!cancelled) setDoc(data)
      })
      .catch((err) => {
        console.error(err)
        if (!cancelled) setError('load-failed')
      })
    return () => { cancelled = true }
  }, [meta])

  useEffect(() => {
    if (!doc) return
    document.title = `${doc.title} · 架构图谱`
    window.scrollTo({ top: 0, behavior: 'auto' })
    setActiveHeading(doc.headings?.[0]?.id || '')
    if (visitedRef.current !== uid) {
      visitedRef.current = uid
      markVisited(type, slug)
    }
    return () => {
      document.title = '架构图谱 · 在线阅读版'
    }
  }, [doc, uid, type, slug, markVisited])

  useEffect(() => {
    if (!doc) return undefined
    let frame = 0
    const update = () => {
      frame = 0
      const article = articleRef.current
      if (!article) return
      const top = window.scrollY + article.getBoundingClientRect().top
      const total = Math.max(1, article.offsetHeight - window.innerHeight)
      const scrolled = window.scrollY - top
      const percent = Math.min(100, Math.max(0, Math.round((scrolled / total) * 100)))
      setProgressValue(percent)
      if (percent >= 99 || percent >= lastSaved.current + 4) {
        lastSaved.current = percent
        setReadingPercent(type, slug, percent)
      }

      let current = doc.headings?.[0]?.id || ''
      for (const heading of doc.headings || []) {
        const element = document.getElementById(heading.id)
        if (element && element.getBoundingClientRect().top <= 150) current = heading.id
      }
      if (current) setActiveHeading(current)
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [doc, type, slug, setReadingPercent])

  useEffect(() => {
    if (!mobilePanel) return undefined
    document.body.classList.add('drawer-locked')
    return () => document.body.classList.remove('drawer-locked')
  }, [mobilePanel])

  const jumpTo = useCallback((id) => {
    const element = document.getElementById(id)
    if (!element) return
    const top = element.getBoundingClientRect().top + window.scrollY - 96
    window.scrollTo({ top, behavior: 'smooth' })
    setActiveHeading(id)
    setMobilePanel(null)
  }, [])

  useEffect(() => {
    if (!doc) return undefined
    const onKey = (event) => {
      const tag = event.target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || event.metaKey || event.ctrlKey || event.altKey) return
      const { prev, next } = getPrevNext(type, slug)
      if (event.key === '[' && prev) navigate(docPath(type, prev.id))
      if (event.key === ']' && next) navigate(docPath(type, next.id))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [doc, type, slug, navigate])

  const handleArticleClick = (event) => {
    const button = event.target.closest?.('[data-copy]')
    if (!button) return
    const code = button.closest('.code-block')?.querySelector('code')?.innerText
    if (!code) return
    const copy = navigator.clipboard?.writeText(code)
    if (!copy) {
      showToast('当前浏览器不支持自动复制，请手动选择')
      return
    }
    copy.then(() => {
      button.textContent = '已复制'
      window.setTimeout(() => { button.textContent = '复制' }, 1600)
      showToast('代码已复制到剪贴板', 'success')
    }).catch(() => showToast('复制失败，请手动选择'))
  }

  const handleComplete = () => {
    toggleComplete(type, slug)
    showToast(completed ? '已取消完成标记' : '已标记完成 · 进度已保存', 'success')
  }

  const handleBookmark = () => {
    const adding = !bookmarked
    toggleBookmark(uid)
    showToast(adding ? '已加入收藏' : '已取消收藏', 'success')
  }

  if (error) {
    return (
      <div className="reader-error page-shell">
        <span className="kicker">NOT FOUND</span>
        <h1>{error === 'not-found' ? '这一页不在图谱里。' : '内容加载失败。'}</h1>
        <p>可能是链接过期，或者这篇内容还没有被收录。</p>
        <Link className="button primary" to={baseType === 'article' ? '/articles' : '/courses'}>
          <ArrowLeft size={16} /> {baseType === 'article' ? '回到优秀文章' : '回到课程库'}
        </Link>
      </div>
    )
  }

  if (!doc) {
    return (
      <div className="reader-shell reader-loading page-shell">
        <div className="skeleton skeleton-kicker" />
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line short" />
        <div className="skeleton skeleton-article" />
      </div>
    )
  }

  const { prev, next } = getPrevNext(type, slug)
  const track = type === 'course' ? trackById.get(meta?.trackId) : null
  const sectionLabel = track?.name || doc.categoryName || (type === 'appendix' ? '附录' : typeLabel(type))
  const backTo = type === 'template' ? '/templates' : type === 'case' ? '/cases' : type === 'article' ? '/articles' : '/courses'
  const backLabel = type === 'template' ? '架构地图' : type === 'case' ? '实战案例' : type === 'article' ? '优秀文章' : '全部课程'
  const unitLabel = type === 'course' ? '讲' : '篇'
  const tocTitle = type === 'course' ? '本讲目录' : '本篇目录'
  const docIndex = (type === 'course' || type === 'appendix') ? catalog.courses.findIndex((item) => item.id === slug) : -1

  return (
    <div className="reader-page">
      <div className="reader-scrollbar"><i style={{ width: `${progressValue}%` }} /></div>

      <div className={`reader-shell ${wide ? 'is-wide' : ''}`}>
        <aside className="reader-sidebar">
          <div className="reader-sidebar-head">
            <Link to={backTo} className="reader-back"><ChevronLeft size={14} /> {backLabel}</Link>
            <h2>{type === 'template' ? '地图目录' : type === 'case' ? '案例目录' : type === 'article' ? '文章目录' : '课程目录'}</h2>
            {(type === 'course' || type === 'appendix') && (
              <span className="reader-sidebar-note">{catalog.stats.allCourses} 讲 · 已读 {completedUids.size} 篇</span>
            )}
          </div>
          <div className="reader-sidebar-scroll">
            <ReaderNav type={type} activeId={slug} progress={progress} completedUids={completedUids} onNavigate={() => setMobilePanel(null)} />
          </div>
        </aside>

        <article className={`reader-article ${wide ? 'is-wide' : ''}`} ref={articleRef} style={{ '--reader-font-size': `${fontSize}px` }}>
          <div className="reader-mobile-actions">
            <button className="button small ghost" onClick={() => { setMobilePanel('nav'); setDrawerTab('nav') }}>
              <List size={15} /> 目录
            </button>
            <button className="button small ghost" onClick={() => { setMobilePanel('nav'); setDrawerTab('toc') }}>
              <List size={15} /> 本篇
            </button>
            <button className={`button small ghost ${bookmarked ? 'is-active' : ''}`} onClick={handleBookmark}>
              {bookmarked ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
            </button>
          </div>

          <header className="article-head">
            <div className="article-breadcrumb">
              <Link to={backTo}>{backLabel}</Link>
              <span>/</span>
              <span style={{ color: track?.color }}>{sectionLabel}</span>
              {(type === 'course' || type === 'case' || type === 'article') && <><span>/</span><em>{meta.num}</em></>}
            </div>
            <div className="article-head-row">
              <div>
                <h1>{doc.title}</h1>
                <p className="article-summary">{doc.summary}</p>
              </div>
              <div className="article-actions">
                <button className={`round-action ${bookmarked ? 'is-active' : ''}`} onClick={handleBookmark} aria-label="收藏">
                  {bookmarked ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}
                </button>
                <button className={`round-action ${completed ? 'is-complete' : ''}`} onClick={handleComplete} aria-label="标记完成">
                  {completed ? <CheckCircle2 size={18} /> : <Check size={18} />}
                </button>
              </div>
            </div>
            <div className="article-meta-row">
              <span><Clock3 size={14} /> 约 {doc.minutes} 分钟</span>
              {docIndex >= 0 && <span>第 {docIndex + 1} / {catalog.courses.length} 讲</span>}
              {type === 'article' && <span>归纳自 {doc.sources?.length || 1} 篇来源</span>}
              <span>{currentProgress.percent || 0}% 已读</span>
              {completed && <span className="meta-complete"><Check size={13} /> 已完成</span>}
              <span className="meta-spacer" />
              <span className="meta-link">
                {type === 'article' ? (
                  (doc.sources || []).map((source) => (
                    <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.name} <ArrowUpRight size={12} /></a>
                  ))
                ) : (
                  <a href={`${catalog.upstream}/blob/main/${meta?.rel || ''}`} target="_blank" rel="noreferrer">查看原文 <ArrowUpRight size={13} /></a>
                )}
              </span>
            </div>
          </header>

          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: doc.html }}
            onClick={handleArticleClick}
          />

          <section className="article-end">
            <div className="article-end-card">
              <div className={`end-check ${completed ? 'is-complete' : ''}`}>
                {completed ? <CheckCircle2 size={26} /> : <Check size={26} />}
              </div>
              <div>
                <h3>{completed ? `这一${unitLabel}已经读完` : `读完了？给这一${unitLabel}画个句号`}</h3>
                <p>{completed ? '你的进度已经保存，可以继续下一站，或回看目录。' : '标记完成会同步到你的学习路径，所有记录只存在本地浏览器。'}</p>
              </div>
              <button className={`button ${completed ? 'ghost' : 'primary'}`} onClick={handleComplete}>
                {completed ? '取消完成' : '标记完成'}
                {completed ? <X size={15} /> : <Check size={15} />}
              </button>
            </div>
          </section>

          <nav className="article-pagination" aria-label="上一篇下一篇">
            {prev ? (
              <Link to={docPath(type, prev.id)} className="pagination-link prev">
                <span><ChevronLeft size={15} /> 上一篇</span>
                <strong>{prev.title}</strong>
              </Link>
            ) : <span className="pagination-placeholder" />}
            {next ? (
              <Link to={docPath(type, next.id)} className="pagination-link next">
                <span>下一篇 <ChevronRight size={15} /></span>
                <strong>{next.title}</strong>
              </Link>
            ) : <span className="pagination-placeholder" />}
          </nav>

          <div className="article-footer-note">
            <span>内容来自 <a href={catalog.upstream} target="_blank" rel="noreferrer">study8677/awesome-architecture</a> · MIT</span>
            <span>阅读版重制：排版、检索与学习进度</span>
          </div>
        </article>

        <ReaderToc
          headings={doc.headings}
          activeHeading={activeHeading}
          progress={progressValue}
          onJump={jumpTo}
          fontSize={fontSize}
          setFontSize={setFontSize}
          theme={theme}
          toggleTheme={toggleTheme}
          wide={wide}
          setWide={setWide}
          tocTitle={tocTitle}
        />
      </div>

      {mobilePanel && (
        <div className="reader-drawer-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setMobilePanel(null) }}>
          <div className="reader-drawer">
            <div className="reader-drawer-head">
              <div className="drawer-tabs">
                <button className={drawerTab === 'nav' ? 'is-active' : ''} onClick={() => setDrawerTab('nav')}>目录</button>
                <button className={drawerTab === 'toc' ? 'is-active' : ''} onClick={() => setDrawerTab('toc')}>本篇目录</button>
              </div>
              <button className="icon-button" onClick={() => setMobilePanel(null)} aria-label="关闭"><X size={19} /></button>
            </div>
            <div className="reader-drawer-body">
              {drawerTab === 'nav' ? (
                <ReaderNav type={type} activeId={slug} progress={progress} completedUids={completedUids} onNavigate={() => setMobilePanel(null)} />
              ) : (
                <nav className="drawer-toc">
                  {doc.headings.map((heading) => (
                    <a key={heading.id} href={`#${heading.id}`} className={heading.depth === 3 ? 'is-sub' : ''} onClick={(event) => { event.preventDefault(); jumpTo(heading.id) }}>
                      {heading.text}
                    </a>
                  ))}
                </nav>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
