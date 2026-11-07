import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { catalog, docUid, findDocByUid } from './content'

const AppContext = createContext(null)

function readStored(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function initialTheme() {
  const stored = (() => {
    try { return localStorage.getItem('atlas-theme') } catch { return null }
  })()
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(initialTheme)
  const [progress, setProgress] = useState(() => readStored('atlas-progress', {}))
  const [bookmarks, setBookmarks] = useState(() => readStored('atlas-bookmarks', []))
  const [readerPrefs, setReaderPrefs] = useState(() => readStored('atlas-reader-prefs', { fontSize: 19 }))
  const [searchOpen, setSearchOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    try { localStorage.setItem('atlas-theme', theme) } catch { /* ignore */ }
  }, [theme])

  useEffect(() => {
    try { localStorage.setItem('atlas-progress', JSON.stringify(progress)) } catch { /* ignore */ }
  }, [progress])

  useEffect(() => {
    try { localStorage.setItem('atlas-bookmarks', JSON.stringify(bookmarks)) } catch { /* ignore */ }
  }, [bookmarks])

  useEffect(() => {
    try { localStorage.setItem('atlas-reader-prefs', JSON.stringify(readerPrefs)) } catch { /* ignore */ }
  }, [readerPrefs])

  useEffect(() => {
    const onKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setSearchOpen((open) => !open)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const showToast = useCallback((message, tone = 'default') => {
    window.clearTimeout(toastTimer.current)
    setToast({ message, tone, id: Date.now() })
    toastTimer.current = window.setTimeout(() => setToast(null), 2400)
  }, [])

  const updateProgress = useCallback((type, id, patch) => {
    const uid = docUid(type, id)
    setProgress((current) => {
      const previous = current[uid] || { percent: 0, completed: false, visits: 0 }
      const next = {
        ...previous,
        ...patch,
        percent: Math.max(previous.percent || 0, patch.percent ?? previous.percent ?? 0),
        visits: (previous.visits || 0) + (patch.visit ? 1 : 0),
        lastAt: Date.now(),
      }
      if (patch.visit) delete next.visit
      if (next.completed) next.percent = 100
      return { ...current, [uid]: next }
    })
  }, [])

  const markVisited = useCallback((type, id) => {
    updateProgress(type, id, { visit: true })
  }, [updateProgress])

  const setReadingPercent = useCallback((type, id, percent) => {
    updateProgress(type, id, { percent: Math.min(100, Math.max(0, Math.round(percent))) })
  }, [updateProgress])

  const toggleComplete = useCallback((type, id) => {
    let completedNow = false
    setProgress((current) => {
      const uid = docUid(type, id)
      const previous = current[uid] || { percent: 0, visits: 0 }
      completedNow = !previous.completed
      const wasCompleted = previous.completed
      const next = {
        ...previous,
        completed: !wasCompleted,
        percent: wasCompleted ? (previous.percent || 0) : 100,
        lastAt: Date.now(),
      }
      return { ...current, [uid]: next }
    })
    return completedNow
  }, [])

  const toggleBookmark = useCallback((uid) => {
    let added = false
    setBookmarks((current) => {
      if (current.includes(uid)) return current.filter((item) => item !== uid)
      added = true
      return [...current, uid]
    })
    return added
  }, [])

  const completedCourses = useMemo(
    () => catalog.courses.filter((course) => progress[docUid('course', course.id)]?.completed).length,
    [progress],
  )

  const completedUids = useMemo(
    () => new Set(Object.entries(progress).filter(([, value]) => value.completed).map(([uid]) => uid)),
    [progress],
  )

  const lastRead = useMemo(() => {
    const entries = Object.entries(progress)
      .filter(([, value]) => value.lastAt && value.percent > 0)
      .sort((a, b) => b[1].lastAt - a[1].lastAt)
    for (const [uid, value] of entries) {
      const { type, doc } = findDocByUid(uid)
      if (doc && type === 'course') return { uid, type, doc, ...value }
    }
    return null
  }, [progress])

  const resetProgress = useCallback(() => {
    setProgress({})
    setBookmarks([])
    showToast('学习记录已清空')
  }, [showToast])

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'))
  }, [])

  const value = useMemo(() => ({
    theme,
    setTheme,
    toggleTheme,
    progress,
    setProgress,
    updateProgress,
    markVisited,
    setReadingPercent,
    toggleComplete,
    completedCourses,
    completedUids,
    bookmarks,
    toggleBookmark,
    readerPrefs,
    setReaderPrefs,
    searchOpen,
    setSearchOpen,
    toast,
    showToast,
    lastRead,
    resetProgress,
    totalCourses: catalog.courses.length,
  }), [
    theme, toggleTheme, progress, updateProgress, markVisited, setReadingPercent,
    toggleComplete, completedCourses, completedUids, bookmarks, toggleBookmark,
    readerPrefs, searchOpen, toast, showToast, lastRead, resetProgress,
  ])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used inside AppProvider')
  return context
}
