import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, ArrowUpRight, Check, Clock3, FileText, Search, SlidersHorizontal,
} from 'lucide-react'
import { catalog, trackById } from '../lib/content'
import { useApp } from '../lib/progress'
import ProgressRing from '../components/ProgressRing'

function CourseCard({ course }) {
  const { progress, completedUids } = useApp()
  const track = trackById.get(course.trackId)
  const state = progress[`course:${course.id}`]
  const completed = completedUids.has(`course:${course.id}`)
  const percent = state?.percent || 0

  return (
    <Link
      to={`/courses/${course.id}`}
      className={`course-card ${completed ? 'is-complete' : percent > 0 ? 'is-reading' : ''}`}
      style={{ '--track-color': track?.color || '#0f766e' }}
    >
      <div className="course-card-top">
        <span className="course-track">{track?.name || '课程'}</span>
        <span className="course-num">{course.num.startsWith('T') ? course.num : `第 ${course.num} 讲`}</span>
      </div>
      <h3>{course.title}</h3>
      <p>{course.summary}</p>
      <div className="course-card-foot">
        <span><Clock3 size={13} /> {course.minutes} 分钟</span>
        {completed ? (
          <span className="status-done"><Check size={13} /> 已完成</span>
        ) : percent > 0 ? (
          <span className="status-reading">{percent >= 95 ? '已读完' : `${percent}%`}</span>
        ) : (
          <span className="status-idle">未读</span>
        )}
      </div>
      <span className="course-progress"><i style={{ width: `${completed ? 100 : percent}%` }} /></span>
    </Link>
  )
}

export default function Courses() {
  const { completedCourses, totalCourses, lastRead, progress } = useApp()
  const [trackFilter, setTrackFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [onlyUnread, setOnlyUnread] = useState(false)

  const tracks = catalog.tracks
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return catalog.courses.filter((course) => {
      if (trackFilter !== 'all' && course.trackId !== trackFilter) return false
      if (onlyUnread && progress[`course:${course.id}`]?.completed) return false
      if (!q) return true
      return course.title.toLowerCase().includes(q) || course.summary.toLowerCase().includes(q)
    })
  }, [trackFilter, query, onlyUnread, progress])

  const percent = totalCourses ? (completedCourses / totalCourses) * 100 : 0
  const nextCourse = lastRead?.doc || catalog.courses.find((course) => !progress[`course:${course.id}`]?.completed) || catalog.courses[0]

  return (
    <div className="page-shell courses-page">
      <header className="page-head">
        <div className="page-head-copy">
          <span className="kicker">ALL COURSES</span>
          <h1>把架构判断，<br />练成肌肉记忆。</h1>
          <p>
            {catalog.stats.allCourses} 讲内容，从「为什么」到「怎么做」，再到「和 AI 一起做」。
            不需要按顺序读，但建议至少走完基础篇。
          </p>
        </div>
        <div className="progress-panel">
          <div className="progress-panel-top">
            <ProgressRing value={percent} size={66} stroke={4} />
            <div>
              <span>整体进度</span>
              <strong>{completedCourses} <em>/ {totalCourses} 讲</em></strong>
            </div>
          </div>
          <div className="progress-panel-next">
            <span>{completedCourses ? '继续上次' : '建议从这里开始'}</span>
            <Link to={`/courses/${nextCourse.id}`}>
              {nextCourse.num} · {nextCourse.title}
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </header>

      <div className="library-toolbar">
        <div className="filter-chips" role="tablist" aria-label="按篇章筛选">
          <button className={trackFilter === 'all' ? 'is-active' : ''} onClick={() => setTrackFilter('all')}>
            全部 <em>{catalog.courses.length}</em>
          </button>
          {tracks.map((track) => (
            <button
              key={track.id}
              className={trackFilter === track.id ? 'is-active' : ''}
              onClick={() => setTrackFilter(track.id)}
              style={{ '--chip-color': track.color }}
            >
              {track.name} <em>{track.count}</em>
            </button>
          ))}
        </div>
        <div className="toolbar-right">
          <label className="library-search">
            <Search size={15} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="筛选标题或摘要" />
          </label>
          <button
            className={`filter-toggle ${onlyUnread ? 'is-active' : ''}`}
            onClick={() => setOnlyUnread((value) => !value)}
            title="只看未完成"
          >
            <SlidersHorizontal size={15} />
            未完成
          </button>
        </div>
      </div>

      <div className="library-result-head">
        <span>{filtered.length} 讲</span>
        {trackFilter !== 'all' && <span>· {trackById.get(trackFilter)?.tagline}</span>}
      </div>

      {filtered.length ? (
        <div className="course-grid">
          {filtered.map((course) => <CourseCard key={course.id} course={course} />)}
        </div>
      ) : (
        <div className="empty-panel">
          <Search size={24} />
          <h3>没有匹配的课程</h3>
          <p>试试更短的关键词，或者取消「未完成」筛选。</p>
          <button className="button ghost" onClick={() => { setQuery(''); setTrackFilter('all'); setOnlyUnread(false) }}>重置筛选</button>
        </div>
      )}

      <section className="appendix-section">
        <div className="section-head compact">
          <div>
            <span className="kicker">APPENDIX</span>
            <h2>读到这里，顺手带上两个附录</h2>
          </div>
        </div>
        <div className="appendix-grid">
          {catalog.appendices.map((item) => (
            <Link to={`/courses/${item.id}`} className="appendix-card" key={item.id}>
              <span className="appendix-icon"><FileText size={18} /></span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
              </div>
              <span className="appendix-meta">{item.minutes} 分钟 <ArrowUpRight size={15} /></span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
