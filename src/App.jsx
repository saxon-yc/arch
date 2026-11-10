import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider } from './lib/progress'
import Layout from './components/Layout'
import Home from './pages/Home'
import Courses from './pages/Courses'
import Paths from './pages/Paths'
import Templates from './pages/Templates'
import Cases from './pages/Cases'
import Articles from './pages/Articles'
import Reader from './pages/Reader'
import Me from './pages/Me'
import About from './pages/About'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="courses" element={<Courses />} />
            <Route path="courses/:slug" element={<Reader type="course" />} />
            <Route path="paths" element={<Paths />} />
            <Route path="templates" element={<Templates />} />
            <Route path="templates/README" element={<Navigate to="/templates" replace />} />
            <Route path="tutorial" element={<Navigate to="/courses" replace />} />
            <Route path="tutorial/README" element={<Navigate to="/courses" replace />} />
            <Route path="templates/:slug" element={<Reader type="template" />} />
            <Route path="cases" element={<Cases />} />
            <Route path="cases/README" element={<Navigate to="/cases" replace />} />
            <Route path="cases/:slug" element={<Reader type="case" />} />
            <Route path="articles" element={<Articles />} />
            <Route path="articles/README" element={<Navigate to="/articles" replace />} />
            <Route path="articles/:slug" element={<Reader type="article" />} />
            <Route path="me" element={<Me />} />
            <Route path="about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
