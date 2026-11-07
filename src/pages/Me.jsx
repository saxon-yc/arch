import { Link } from 'react-router-dom'
import {
  ArrowRight, ArrowUpRight, Bookmark, BookOpen, CheckCircle2, Clock3, RotateCcw, Sparkles,
} from 'lucide-react'
import { catalog, docHref, docUid, findDocByUid, typeLabel } from '../lib/content'
import { useApp } from '../lib/progress'
import ProgressRing from '../components/ProgressRing'

export default function Me() {
  const {
    progress, completedUids, completedCourses, totalCourses, bookmarks, lastRead, resetProgress,
  } = useApp()

  const percent = totalCourses ? (completedCourses / totalCourses) * 100 : 0
  const reading = Object.entries(progress)
    .filter(([, value]) => value.percent > 0 && !value.completed)
    .map(([uid, value]) => ({ ...findDocByUid(uid), ...value }))
    .filter((item) => item.doc)
    .sort((a, b) => b.lastAt - a.lastAt)
    .slice(0, 4)

  const completed = catalog.courses.filter((course) => completedUids.has(docUid('course', course.id)))
  const saved = bookmarks.map((uid) => ({ ...findDocByUid(uid), uid })).filter((item) => item.doc)
  const hasHistory = completed.length > 0 || reading.length > 0 || saved.length > 0

  const trackStats = catalog.tracks.map((track) => {
    const courses = track.chapterIds.map((id) => catalog.courses.find((course) => course.id === id)).filter(Boolean)
    const done = courses.filter((course) => completedUids.has(docUid('course', course.id))).length
    return { ...track, done, total: courses.length, ratio: courses.length ? (done / courses.length) * 100 : 0 }
  })

  return (
    <div className="page-shell me-page">
      <header className="page-head me-head">
        <div className="page-head-copy">
          <span className="kicker">YOUR ATLAS</span>
          <h1>你的学习地图。</h1>
          <p>所有记录都保存在当前浏览器。没有账号、没有云端同步，只有你和这张地图。</p>
        </div>
        <div className="me-progress-badge">
          <ProgressRing value={percent} size={92} stroke={5} />
          <div>
            <strong>{completedCourses} / {totalCourses}</strong>
            <span>讲已完成</span>
          </div>
        </div>
      </header>

      <div className="me-stats">
        <div className="me-stat">
          <BookOpen size={18} />
          <span>正在读</span>
          <strong>{reading.length}</strong>
        </div>
        <div className="me-stat">
          <CheckCircle2 size={18} />
          <span>已完成</span>
          <strong>{completed.length}</strong>
        </div>
        <div className="me-stat">
          <Bookmark size={18} />
          <span>已收藏</span>
          <strong>{saved.length}</strong>
        </div>
        <div className="me-stat">
          <Clock3 size={18} />
          <span>累计阅读</span>
          <strong>{completed.reduce((sum, course) => sum + course.minutes, 0)}<em>分钟</em></strong>
        </div>
      </div>

      {!hasHistory ? (
        <section className="me-empty">
          <div className="me-empty-mark">A</div>
          <span className="kicker">START YOUR MAP</span>
          <h2>地图还是空白的，<br />从第一讲开始画。</h2>
          <p>读过的内容会自动记录。你可以随时回来，也可以从任意一讲跳进去。</p>
          <div className="me-empty-actions">
            <Link className="button primary" to="/courses/01">从第 01 讲开始 <ArrowRight size={16} /></Link>
            <Link className="button ghost" to="/paths">看看学习路径</Link>
          </div>
        </section>
      ) : (
        <>
          {lastRead && (
            <section className="continue-section">
              <div className="section-head compact">
                <div>
                  <span className="kicker">PICK UP WHERE YOU LEFT</span>
                  <h2>继续上次</h2>
                </div>
              </div>
              <Link to={`/courses/${lastRead.doc.id}`} className="continue-card">
                <div className="continue-ring">
                  <ProgressRing value={lastRead.percent || 0} size={58} stroke={4} />
                </div>
                <div className="continue-main">
                  <span>第 {lastRead.doc.num} 讲 · {lastRead.doc.title}</span>
                  <p>{lastRead.doc.summary}</p>
                </div>
                <span className="continue-link">继续阅读 <ArrowRight size={16} /></span>
              </Link>
            </section>
          )}

          <div className="me-columns">
            <section className="me-block">
              <div className="section-head compact">
                <div>
                  <span className="kicker">IN PROGRESS</span>
                  <h2>正在读</h2>
                </div>
              </div>
              {reading.length ? (
                <div className="me-list">
                  {reading.map((item) => (
                    <Link key={item.uid} to={docHref(item.type, item.id)} className="me-list-item">
                      <span className="me-list-percent">{item.percent}%</span>
                      <div>
                        <strong>{item.doc.title}</strong>
                        <span>{typeLabel(item.type)} · {item.doc.minutes} 分钟</span>
                      </div>
                      <ArrowUpRight size={15} />
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="me-placeholder">没有进行中的内容，所有读过的都已经完成。</p>
              )}
            </section>

            <section className="me-block">
              <div className="section-head compact">
                <div>
                  <span className="kicker">BOOKMARKS</span>
                  <h2>收藏</h2>
                </div>
              </div>
              {saved.length ? (
                <div className="me-list">
                  {saved.map((item) => (
                    <Link key={item.uid} to={docHref(item.type, item.id)} className="me-list-item">
                      <span className="me-list-percent"><Bookmark size={14} /></span>
                      <div>
                        <strong>{item.doc.title}</strong>
                        <span>{typeLabel(item.type)}</span>
                      </div>
                      <ArrowUpRight size={15} />
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="me-placeholder">还没有收藏。阅读时点右上角的书签，在这里就能找到。</p>
              )}
            </section>
          </div>

          <section className="track-progress-section">
            <div className="section-head compact">
              <div>
                <span className="kicker">TRACK PROGRESS</span>
                <h2>六段路的进度</h2>
              </div>
            </div>
            <div className="track-progress-grid">
              {trackStats.filter((track) => track.id !== 'special').map((track) => (
                <Link to={`/courses/${catalog.courses.find((course) => course.trackId === track.id)?.id || '01'}`} className="track-progress-card" key={track.id} style={{ '--track-color': track.color }}>
                  <div className="track-progress-top">
                    <span>{track.name}</span>
                    <em>{track.done}/{track.total}</em>
                  </div>
                  <div className="track-progress-bar"><i style={{ width: `${track.ratio}%` }} /></div>
                  <span className="track-progress-pct">{Math.round(track.ratio)}%</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="completed-section">
            <div className="section-head compact">
              <div>
                <span className="kicker">COMPLETED</span>
                <h2>已读完的 {completed.length} 讲</h2>
              </div>
              <button className="reset-button" onClick={() => {
                if (window.confirm('确定清空全部学习记录与收藏吗？此操作不可撤销。')) resetProgress()
              }}>
                <RotateCcw size={14} /> 清空记录
              </button>
            </div>
            {completed.length ? (
              <div className="completed-grid">
                {completed.map((course) => (
                  <Link key={course.id} to={`/courses/${course.id}`} className="completed-item">
                    <CheckCircle2 size={16} />
                    <span>{course.num} · {course.title}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="me-placeholder">还没有完成任何一讲。读完后点「标记完成」，它就会出现在这里。</p>
            )}
          </section>
        </>
      )}

      <section className="me-tip">
        <Sparkles size={18} />
        <p>小提示：按 <kbd>⌘</kbd> <kbd>K</kbd> 搜索全站；阅读时用 <kbd>[</kbd> <kbd>]</kbd> 切换上一篇 / 下一篇。</p>
      </section>
    </div>
  )
}
