import { Link } from 'react-router-dom'
import { ArrowLeft, Compass } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="page-shell notfound-page">
      <Compass size={34} />
      <span className="kicker">404 · OFF THE MAP</span>
      <h1>这里不在图谱上。</h1>
      <p>可能是链接写错了，或者这篇内容还没有被收录。回到地图重新找一条路。</p>
      <div className="notfound-actions">
        <Link className="button primary" to="/"><ArrowLeft size={16} /> 回到首页</Link>
        <Link className="button ghost" to="/courses">浏览课程</Link>
      </div>
    </div>
  )
}
