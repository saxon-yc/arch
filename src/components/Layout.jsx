import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  ArrowUpRight, Bookmark, Command, Github, Menu, Moon, Search, Sun, X,
} from 'lucide-react'
import Logo from './Logo'
import SearchDialog from './SearchDialog'
import ProgressRing from './ProgressRing'
import { useApp } from '../lib/progress'
import { catalog } from '../lib/content'

const NAV = [
  { to: '/courses', label: '课程' },
  { to: '/paths', label: '学习路径' },
  { to: '/templates', label: '架构模板' },
  { to: '/cases', label: '实战案例' },
]

function ScrollManager() {
  const location = useLocation()
  const searchableCount = catalog.stats.allCourses + catalog.appendices.length + catalog.stats.templates + catalog.stats.cases
  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(decodeURIComponent(location.hash.slice(1)))
      if (element) {
        window.setTimeout(() => element.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
        return
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' in document.documentElement.style ? 'instant' : 'auto' })
  }, [location.pathname, location.hash])
  return null
}

function NavProgress() {
  const { completedCourses, totalCourses } = useApp()
  const percent = totalCourses ? (completedCourses / totalCourses) * 100 : 0
  return (
    <Link to="/me" className="nav-progress" title="我的学习">
      <ProgressRing value={percent} size={30} stroke={2.4} />
      <span>{completedCourses}<i>/</i>{totalCourses}</span>
    </Link>
  )
}

export default function Layout() {
  const { theme, toggleTheme, setSearchOpen, toast } = useApp()
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const searchableCount = catalog.stats.allCourses + catalog.appendices.length + catalog.stats.templates + catalog.stats.cases

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.classList.toggle('menu-locked', mobileOpen)
    return () => document.body.classList.remove('menu-locked')
  }, [mobileOpen])

  return (
    <>
      <ScrollManager />
      <a className="skip-link" href="#main">跳到主要内容</a>
      <header className="site-header">
        <div className="nav-shell">
          <Logo />
          <nav className="desktop-nav" aria-label="主导航">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="nav-actions">
            <button className="search-trigger" onClick={() => setSearchOpen(true)} aria-label="搜索全站">
              <Search size={16} />
              <span>搜索</span>
              <kbd><Command size={11} />K</kbd>
            </button>
            <NavProgress />
            <button className="icon-button" onClick={toggleTheme} aria-label={theme === 'light' ? '切换到深色模式' : '切换到浅色模式'}>
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button className="icon-button mobile-menu-button" onClick={() => setMobileOpen(true)} aria-label="打开菜单">
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="mobile-menu" role="dialog" aria-modal="true" aria-label="导航菜单">
          <div className="mobile-menu-head">
            <Logo />
            <button className="icon-button" onClick={() => setMobileOpen(false)} aria-label="关闭菜单"><X size={20} /></button>
          </div>
          <nav className="mobile-nav">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} className="mobile-nav-link">
                <span>{item.label}</span>
                <ArrowUpRight size={18} />
              </NavLink>
            ))}
            <NavLink to="/me" className="mobile-nav-link">
              <span>我的学习</span>
              <ArrowUpRight size={18} />
            </NavLink>
            <NavLink to="/about" className="mobile-nav-link">
              <span>关于这个版本</span>
              <ArrowUpRight size={18} />
            </NavLink>
          </nav>
          <button className="mobile-search" onClick={() => { setMobileOpen(false); setSearchOpen(true) }}>
            <Search size={18} />
            <span>搜索 {searchableCount} 篇内容</span>
            <kbd>⌘K</kbd>
          </button>
          <div className="mobile-menu-foot">
            <span>{catalog.stats.allCourses} 讲课程 · {catalog.stats.templates} 张地图 · {catalog.stats.cases} 个案例</span>
            <a href={catalog.upstream} target="_blank" rel="noreferrer">查看原仓库 <ArrowUpRight size={13} /></a>
          </div>
        </div>
      )}

      <main id="main">
        <Outlet />
      </main>

      <Footer />
      <SearchDialog />
      {toast && (
        <div className={`toast ${toast.tone === 'success' ? 'is-success' : ''}`} role="status" key={toast.id}>
          {toast.message}
        </div>
      )}
    </>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-shell">
        <div className="footer-brand">
          <Logo />
          <p>把架构判断，做成一条可以读完的路。<br />先看地图，再上路。</p>
          <span className="footer-note">非官方阅读体验重制版 · 内容遵循 MIT 许可</span>
        </div>
        <div className="footer-col">
          <h4>开始阅读</h4>
          <Link to="/courses/01">第 01 讲 · 为什么先有架构思维</Link>
          <Link to="/courses/07">第 07 讲 · 从 0 到 1 设计系统</Link>
          <Link to="/paths">完整学习路径</Link>
          <Link to="/courses/glossary">架构术语表</Link>
        </div>
        <div className="footer-col">
          <h4>知识地图</h4>
          <Link to="/templates">31 张架构地图</Link>
          <Link to="/cases">6 个实战案例</Link>
          <Link to="/me">我的学习记录</Link>
          <Link to="/about">关于与致谢</Link>
        </div>
        <div className="footer-col">
          <h4>原项目</h4>
          <a href={catalog.upstream} target="_blank" rel="noreferrer"><Github size={14} /> study8677/awesome-architecture</a>
          <a href={`${catalog.upstream}/blob/main/LICENSE`} target="_blank" rel="noreferrer">MIT License</a>
          <a href={`${catalog.upstream}/issues`} target="_blank" rel="noreferrer">反馈与共建</a>
          <span className="footer-seal"><Bookmark size={14} /> 阅读进度保存在本地</span>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Architecture Atlas · 阅读版</span>
        <span>40 章核心课程 + 1 个训练专题 · 中文</span>
      </div>
    </footer>
  )
}
