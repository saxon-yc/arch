import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
fs.copyFileSync(path.join(dist, 'index.html'), path.join(dist, '404.html'))

const catalog = JSON.parse(fs.readFileSync(path.join(root, 'src/generated/catalog.json'), 'utf8'))
const siteUrl = (process.env.SITE_URL || 'https://architecture-atlas-two.vercel.app').replace(/\/$/, '')
const today = new Date().toISOString().slice(0, 10)

const routes = [
  { path: '/', priority: '1.0' },
  { path: '/courses', priority: '0.9' },
  { path: '/paths', priority: '0.8' },
  { path: '/templates', priority: '0.8' },
  { path: '/cases', priority: '0.8' },
  { path: '/about', priority: '0.5' },
  ...catalog.courses.map((item) => ({ path: `/courses/${item.id}`, priority: item.num.startsWith('T') ? '0.7' : '0.8' })),
  ...catalog.appendices.map((item) => ({ path: `/courses/${item.id}`, priority: '0.5' })),
  ...catalog.templates.map((item) => ({ path: `/templates/${item.id}`, priority: '0.7' })),
  ...catalog.cases.map((item) => ({ path: `/cases/${item.id}`, priority: '0.7' })),
]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((route) => `  <url>
    <loc>${siteUrl}${route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>
`
fs.writeFileSync(path.join(dist, 'sitemap.xml'), xml)
fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`)

console.log(`✓ dist/404.html written for static-host SPA fallback`)
console.log(`✓ sitemap.xml + robots.txt written for ${siteUrl} (${routes.length} URLs)`)
