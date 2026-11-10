import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUpRight, BookOpen, Command, FileText, Map, Quote, Search, X } from 'lucide-react'
import { loadSearchIndex, typeLabel } from '../lib/content'
import { useApp } from '../lib/progress'

const SUGGESTIONS = ['架构图', '一致性', 'RAG', '技术选型', '评测', 'Agent', '多智能体']

function scoreItem(item, query) {
  const q = query.trim().toLowerCase()
  if (!q) return 0
  const title = item.title.toLowerCase()
  const summary = (item.summary || '').toLowerCase()
  const headings = item.headings.join(' ').toLowerCase()
  const body = item.body.toLowerCase()
  let score = 0
  if (title.includes(q)) score += title.startsWith(q) ? 120 : 80
  if (summary.includes(q)) score += 32
  if (headings.includes(q)) score += 18
  if (body.includes(q)) score += 6
  if (item.type === 'course') score += 4
  return score
}

function snippetFor(item, query) {
  const q = query.trim()
  const fields = [item.summary, ...item.headings, item.body]
  for (const field of fields) {
    if (!field) continue
    const index = field.toLowerCase().indexOf(q.toLowerCase())
    if (index >= 0) {
      const start = Math.max(0, index - 42)
      const end = Math.min(field.length, index + q.length + 74)
      return `${start > 0 ? '…' : ''}${field.slice(start, end)}${end < field.length ? '…' : ''}`
    }
  }
  return item.summary
}

const TYPE_ICONS = {
  course: BookOpen,
  appendix: FileText,
  template: Map,
  case: FileText,
  article: Quote,
}

export default function SearchDialog() {
  const { searchOpen, setSearchOpen } = useApp()
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState(null)
  const [active, setActive] = useState(0)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!searchOpen) return undefined
    setQuery('')
    setActive(0)
    document.body.classList.add('is-locked')
    window.setTimeout(() => inputRef.current?.focus(), 40)
    return () => document.body.classList.remove('is-locked')
  }, [searchOpen])

  useEffect(() => {
    if (!searchOpen || index) return
    loadSearchIndex().then(setIndex).catch(() => setIndex([]))
  }, [searchOpen, index])

  const results = useMemo(() => {
    if (!index || !query.trim()) return []
    return index
      .map((item) => ({ item, score: scoreItem(item, query) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 14)
  }, [index, query])

  useEffect(() => {
    setActive(0)
  }, [query])

  if (!searchOpen) return null

  const openResult = (item) => {
    setSearchOpen(false)
    navigate(item.path)
  }

  const onKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      setSearchOpen(false)
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActive((current) => Math.min(current + 1, Math.max(0, results.length - 1)))
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActive((current) => Math.max(0, current - 1))
    }
    if (event.key === 'Enter' && results[active]) {
      event.preventDefault()
      openResult(results[active].item)
    }
  }

  return (
    <div className="search-overlay" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) setSearchOpen(false)
    }}>
      <div className="search-panel" role="dialog" aria-modal="true" aria-label="搜索全站" onKeyDown={onKeyDown}>
        <div className="search-input-row">
          <Search size={19} strokeWidth={1.9} />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索课程、架构图、案例与好文…"
            aria-label="搜索"
          />
          <button className="icon-button subtle" onClick={() => setSearchOpen(false)} aria-label="关闭搜索">
            <X size={18} />
          </button>
        </div>

        <div className="search-body">
          {!query.trim() && (
            <div className="search-idle">
              <div>
                <span className="search-label">试试这些关键词</span>
                <div className="search-suggestions">
                  {SUGGESTIONS.map((item) => (
                    <button key={item} className="suggestion" onClick={() => setQuery(item)}>{item}</button>
                  ))}
                </div>
              </div>
              <div className="search-tip">
                <Command size={15} />
                <span>按 <kbd>⌘</kbd> <kbd>K</kbd> 随时唤起搜索</span>
              </div>
            </div>
          )}

          {query.trim() && results.length === 0 && (
            <div className="search-empty">
              <p>没有找到「{query}」</p>
              <span>换一个更短的关键词，或试试「架构」「AI」「数据」。</span>
            </div>
          )}

          {results.length > 0 && (
            <div className="search-results">
              <span className="search-label">找到 {results.length} 条结果</span>
              {results.map(({ item }, idx) => {
                const Icon = TYPE_ICONS[item.type] || BookOpen
                return (
                  <button
                    key={`${item.type}-${item.id}`}
                    className={`search-result ${idx === active ? 'is-active' : ''}`}
                    onMouseEnter={() => setActive(idx)}
                    onClick={() => openResult(item)}
                  >
                    <span className="search-result-icon"><Icon size={17} /></span>
                    <span className="search-result-main">
                      <span className="search-result-title">
                        {item.title}
                        <em>{typeLabel(item.type)}</em>
                      </span>
                      <span className="search-result-snippet">{snippetFor(item, query)}</span>
                    </span>
                    <ArrowUpRight size={17} className="search-result-arrow" />
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="search-footer">
          <span><kbd>↑</kbd><kbd>↓</kbd> 选择</span>
          <span><kbd>↵</kbd> 打开</span>
          <span><kbd>esc</kbd> 关闭</span>
        </div>
      </div>
    </div>
  )
}
