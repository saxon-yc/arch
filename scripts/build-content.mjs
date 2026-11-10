import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import taskLists from 'markdown-it-task-lists'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const CONTENT = path.join(ROOT, 'content')
const OUT = path.join(ROOT, 'src', 'generated')
const DOCS_OUT = path.join(OUT, 'docs')
const REPO = 'https://github.com/study8677/awesome-architecture'

const TRACKS = [
  {
    id: 'foundation',
    name: '基础篇',
    range: '01–09',
    color: '#0f766e',
    tagline: '换一种看系统的方式',
    description: '建立架构判断的底层操作系统：架构定义、思考框架、架构图、核心模式、数据与状态、质量属性、从 0 到 1 与 ADR。',
    outcome: '独立画出系统骨架，并把每个选择的代价说清楚。',
    start: 1,
    end: 9,
  },
  {
    id: 'advanced',
    name: '进阶篇',
    range: '10–17',
    color: '#7c3aed',
    tagline: '驾驭做大之后才咬人的硬骨头',
    description: '分布式、数据一致性、韧性、规模化、演进拆分、组织、安全，以及大模型时代的架构判断。',
    outcome: '面对部分失败、规模与迁移，能做出可执行的架构取舍。',
    start: 10,
    end: 17,
  },
  {
    id: 'practice',
    name: '实战篇',
    range: '18–22',
    color: '#c2410c',
    tagline: '把方法落进真实场景',
    description: '用真实案例走完读懂、设计、演进、迁移、AI 原生升级的完整闭环，补上方法到地图之间的桥。',
    outcome: '拿到陌生系统，能拆解、设计、演进并写出决策记录。',
    start: 18,
    end: 22,
  },
  {
    id: 'collaboration',
    name: 'AI 协同篇',
    range: '23–26',
    color: '#0369a1',
    tagline: '与 AI 协作，而不失控',
    description: '把规范写成护栏、审查 AI 产出的默认缺口、用评测守住质量，并在 vibe 与 spec-first 之间选对路线。',
    outcome: '让 AI 加速交付，同时保留架构判断与质量门禁。',
    start: 23,
    end: 26,
  },
  {
    id: 'stack',
    name: '技术选型篇',
    range: '27–34',
    color: '#a16207',
    tagline: '把「用什么技术」变成架构判断',
    description: '语言、存储、缓存与消息、API、部署、可观测性、AI 基础设施，最后收束成一棵可复盘的决策树。',
    outcome: '不再凭热度选型，而是用约束、失败模式与退出方案拍板。',
    start: 27,
    end: 34,
  },
  {
    id: 'organization',
    name: 'AI 原生组织',
    range: '35–40',
    color: '#be123c',
    tagline: '把 AI 变成组织级生产流程',
    description: '从超级个体到超级团队，从共享上下文到工作流、治理与演进，回答组织如何真正长成 AI 原生。',
    outcome: '判断团队处在哪个阶段，并设计下一步的组织级 AI 杠杆。',
    start: 35,
    end: 40,
  },
  {
    id: 'special',
    name: '专题',
    range: 'T01',
    color: '#475569',
    tagline: '训练方案不是算法排行榜',
    description: '',
    outcome: '先看能力目标、数据与学习信号，再判断 SFT / DPO / PPO / GRPO 的真实代价。',
    start: null,
    end: null,
  },
]

const TEMPLATE_CATEGORIES = [
  { id: 'all', name: '全部' },
  { id: 'classic', name: '经典系统' },
  { id: 'ai-native', name: 'AI 原生' },
  { id: 'coding-agent', name: '编码 Agent' },
  { id: 'prompt', name: '提示词架构' },
  { id: 'industrial', name: '工业 / 嵌入式' },
]

const CASE_CATEGORIES = [
  { id: 'all', name: '全部' },
  { id: 'commerce', name: '交易与增长' },
  { id: 'ai', name: 'AI 与 Agent' },
  { id: 'collaboration', name: '协作与内容' },
  { id: 'platform', name: '平台与 SaaS' },
]

const ARTICLE_CATEGORIES = [
  { id: 'all', name: '全部' },
  { id: 'agent', name: 'Agent 架构' },
  { id: 'ai-native', name: 'AI 原生' },
  { id: 'organization', name: '组织与协作' },
  { id: 'engineering', name: '工程与系统' },
]

const ARTICLE_TOPIC_CATEGORY = {
  'Agent 架构': 'agent',
  'AI 原生': 'ai-native',
  '组织与协作': 'organization',
  '工程与系统': 'engineering',
}

const CASE_META = {
  'stararena-ticketing': { category: 'commerce' },
  'patchdesk-saas': { category: 'platform' },
  'documind-rag': { category: 'ai' },
  'syncroom-collaboration': { category: 'collaboration' },
  'feedstream-content': { category: 'collaboration' },
  'codepilot-agent': { category: 'ai' },
}

const nfc = (value) => String(value).normalize('NFC')

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true })
}

function read(rel) {
  return fs.readFileSync(path.join(CONTENT, rel), 'utf8')
}

function walk(dir, base = '') {
  const out = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue
    const abs = path.join(dir, entry.name)
    const rel = base ? `${base}/${entry.name}` : entry.name
    if (entry.isDirectory()) out.push(...walk(abs, rel))
    else out.push(rel)
  }
  return out
}

function stripInline(text = '') {
  return text
    .replace(/<[^>]+>/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[`*_~]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function trimText(text, max = 118) {
  const clean = stripInline(text)
  if (clean.length <= max) return clean
  return `${clean.slice(0, max).replace(/[，,、；;：:.\s]+$/, '')}…`
}

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[`*_~]/g, '')
    .replace(/[\s\u3000]+/g, '-')
    .replace(/[^\p{Letter}\p{Number}-]+/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'section'
}

function readingMinutes(text) {
  const cjk = (text.match(/[\u3400-\u9fff]/g) || []).length
  const latin = (text.replace(/[\u3400-\u9fff]/g, ' ').match(/[A-Za-z0-9]+/g) || []).length
  return Math.max(3, Math.round(cjk / 500 + latin / 220))
}

function parseTitle(raw) {
  const first = raw.split('\n').find((line) => /^#\s+/.test(line))
  return stripInline((first || '').replace(/^#\s+/, ''))
}

function firstQuote(raw) {
  const lines = raw.split('\n')
  let inFence = false
  const blocks = []
  let current = []
  for (const line of lines) {
    if (/^```/.test(line)) inFence = !inFence
    if (inFence) continue
    if (/^>\s?/.test(line)) current.push(line.replace(/^>\s?/, ''))
    else if (current.length) {
      blocks.push(current.join(' '))
      current = []
    }
  }
  if (current.length) blocks.push(current.join(' '))
  return blocks.map(stripInline).find((text) => text.length > 20) || ''
}

function firstParagraph(raw) {
  const blocks = raw.split(/\n{2,}/)
  let inFence = false
  for (const block of blocks) {
    if (/^```/.test(block.trim())) {
      inFence = !inFence
      continue
    }
    if (inFence) continue
    const line = block.trim()
    if (!line || line.startsWith('#') || line.startsWith('>') || line.startsWith('|') || line.startsWith('-') || line.startsWith('*') || line.startsWith('```') || /^---+$/.test(line)) continue
    const text = stripInline(line)
    if (text.length > 20) return text
  }
  return ''
}

function sectionHeadings(raw) {
  const headings = []
  let inFence = false
  for (const line of raw.split('\n')) {
    if (/^```/.test(line)) inFence = !inFence
    if (inFence) continue
    const match = line.match(/^(#{2,3})\s+(.+)$/)
    if (match) headings.push({ depth: match[1].length, text: stripInline(match[2]) })
  }
  return headings
}

function parseIndexSummaries(raw) {
  const map = new Map()
  for (const line of raw.split('\n')) {
    if (!line.trim().startsWith('|')) continue
    const cells = line.split('|').slice(1, -1).map((cell) => cell.trim())
    if (!cells.length) continue
    const link = cells[0].match(/\[([^\]]+)\]\(([^)]+\.md)(?:#[^)]*)?\)/)
    if (!link) continue
    const href = link[2].replace(/^\.\//, '')
    const summary = cells[cells.length - 1]
    if (summary && summary !== link[1]) {
      map.set(href, { indexTitle: stripInline(link[1]), summary: stripInline(summary) })
    }
  }
  return map
}

function parseTemplateMeta(raw) {
  const meta = new Map()
  let category = 'classic'
  for (const line of raw.split('\n')) {
    if (/^###\s+/.test(line)) {
      const heading = line.toLowerCase()
      if (heading.includes('经典')) category = 'classic'
      else if (heading.includes('ai 原生系统') || heading.includes('ai-native')) category = 'ai-native'
      else if (heading.includes('编码') || heading.includes('coding')) category = 'coding-agent'
      else if (heading.includes('系统提示词') || heading.includes('prompt')) category = 'prompt'
      else if (heading.includes('工业') || heading.includes('嵌入式')) category = 'industrial'
    }
    if (!line.trim().startsWith('|')) continue
    const cells = line.split('|').slice(1, -1).map((cell) => cell.trim())
    if (cells.length < 3) continue
    const link = cells[0].match(/\[([^\]]+)\]\(([^)]+\/README\.md)\)/)
    if (!link) continue
    const id = link[2].replace(/\/README\.md$/, '')
    meta.set(id, {
      title: stripInline(link[1]),
      category,
      products: stripInline(cells[1] || ''),
      positioning: stripInline(cells[2] || ''),
      highlights: (cells[3] || '')
        .split(/[,，、]/)
        .map((item) => stripInline(item))
        .filter(Boolean)
        .slice(0, 4),
        order: meta.size,
    })
  }
  return meta
}

function parseCaseMeta(raw) {
  const meta = new Map()
  for (const line of raw.split('\n')) {
    if (!line.trim().startsWith('|')) continue
    const cells = line.split('|').slice(1, -1).map((cell) => cell.trim())
    if (cells.length < 3) continue
    const link = cells[0].match(/\[([^\]]+)\]\(([^)]+\/README\.md)\)/)
    if (!link) continue
    const id = link[2].replace(/\/README\.md$/, '')
    const templateNames = [...(cells[1] || '').matchAll(/\[([^\]]+)\]/g)].map((match) => stripInline(match[1]))
    meta.set(nfc(id), {
      indexTitle: stripInline(link[1]),
      templates: templateNames,
      learn: (cells[2] || '')
        .split(/[,，、]/)
        .map((item) => stripInline(item))
        .filter(Boolean)
        .slice(0, 5),
      category: CASE_META[id]?.category || 'platform',
    })
  }
  return meta
}

function parseArticleMeta(raw) {
  const meta = new Map()
  for (const line of raw.split('\n')) {
    if (!line.trim().startsWith('|')) continue
    const cells = line.split('|').slice(1, -1).map((cell) => cell.trim())
    if (cells.length < 5) continue
    const link = cells[0].match(/\[([^\]]+)\]\(([^)]+\.md)(?:#[^)]*)?\)/)
    if (!link) continue
    const id = path.posix.basename(link[2].replace(/^\.\//, ''))
    meta.set(nfc(id), {
      indexTitle: stripInline(link[1]),
      topic: stripInline(cells[1]),
      source: stripInline(cells[2]),
      tags: cells[3]
        .split(/[·、,，/]/)
        .map((item) => stripInline(item))
        .filter(Boolean)
        .slice(0, 6),
      summary: stripInline(cells[4]),
      order: meta.size,
    })
  }
  return meta
}

function extractArticleSources(raw) {
  const sources = []
  for (const line of raw.split('\n')) {
    if (!/^\|\s*\[[^\]]+\]\(https?:/.test(line.trim())) continue
    const cells = line.split('|').slice(1, -1).map((cell) => cell.trim())
    const link = cells[0].match(/\[([^\]]+)\]\((https?:[^)]+)\)/)
    if (!link) continue
    const name = stripInline(cells[1] || '').split('·').pop().trim() || '原文'
    if (sources.some((source) => source.url === link[2])) continue
    sources.push({ name, title: stripInline(link[1]), url: link[2] })
  }
  return sources.slice(0, 4)
}

function relativeLink(currentRel, href) {
  if (!href || /^(https?:|mailto:|tel:|#)/.test(href)) return null
  const [rawPath, rawAnchor] = href.split('#')
  if (!rawPath.endsWith('.md')) return null
  let decodedPath = rawPath
  try { decodedPath = decodeURIComponent(rawPath) } catch { /* keep raw */ }
  const normalized = nfc(path.posix.normalize(path.posix.join(path.posix.dirname(currentRel), decodedPath)))
  return { target: normalized.replace(/^\.\//, ''), anchor: rawAnchor || '' }
}

function makeRenderer(currentRel, fileRoutes, headings) {
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: false,
    breaks: false,
  })
  md.use(taskLists, { enabled: true, label: false })

  const seen = new Map()
  md.core.ruler.push('atlas_headings', (state) => {
    for (let i = 0; i < state.tokens.length; i += 1) {
      const token = state.tokens[i]
      if (token.type !== 'heading_open') continue
      const inline = state.tokens[i + 1]
      let text = ''
      if (inline?.children) {
        text = inline.children
          .filter((child) => ['text', 'code_inline', 'emoji'].includes(child.type))
          .map((child) => child.content)
          .join('')
      }
      const base = slugify(text)
      const count = seen.get(base) || 0
      seen.set(base, count + 1)
      const id = count ? `${base}-${count + 1}` : base
      token.attrSet('id', id)
      const level = Number(token.tag.slice(1))
      if (level === 2 || level === 3) headings.push({ depth: level, text: stripInline(text), id })
    }
  })

  md.renderer.rules.table_open = () => '<div class="table-wrap"><table>'
  md.renderer.rules.table_close = () => '</table></div>'

  md.renderer.rules.fence = (tokens, idx) => {
    const token = tokens[idx]
    const code = token.content
    const lang = token.info.trim().split(/\s+/)[0] || ''
    let highlighted = ''
    if (lang && hljs.getLanguage(lang)) {
      try {
        highlighted = hljs.highlight(code, { language: lang, ignoreIllegals: true }).value
      } catch {
        highlighted = md.utils.escapeHtml(code)
      }
    } else {
      highlighted = md.utils.escapeHtml(code)
    }
    const label = lang || (code.includes('┌') || code.includes('│') ? 'diagram' : 'text')
    return `<div class="code-block"><div class="code-head"><span class="code-lang">${md.utils.escapeHtml(label)}</span><button class="copy-code" type="button" data-copy>复制</button></div><pre class="hljs"><code>${highlighted}</code></pre></div>`
  }

  const defaultLinkOpen = md.renderer.rules.link_open || ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options))
  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const href = token.attrGet('href') || ''
    if (/^https?:\/\//.test(href)) {
      token.attrSet('target', '_blank')
      token.attrSet('rel', 'noopener noreferrer')
    } else if (href.endsWith('.md') || href.includes('.md#')) {
      const resolved = relativeLink(currentRel, href)
      if (resolved) {
        let mapped = fileRoutes.get(nfc(resolved.target))
        if (!mapped) mapped = `${REPO}/blob/main/${resolved.target}`
        if (resolved.anchor) {
          mapped += `#${encodeURIComponent(slugify(decodeURIComponent(resolved.anchor)))}`
        }
        token.attrSet('href', mapped)
      }
    }
    return defaultLinkOpen(tokens, idx, options, env, self)
  }

  return md
}

function extractPlain(raw) {
  return raw
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/[|*_`~]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function main() {
  ensureDir(OUT)
  ensureDir(DOCS_OUT)
  for (const file of fs.readdirSync(DOCS_OUT)) fs.rmSync(path.join(DOCS_OUT, file), { force: true })

  const tutorialIndex = parseIndexSummaries(read('tutorial/README.md'))
  const templateMeta = parseTemplateMeta(read('templates/README.md'))
  const caseMeta = parseCaseMeta(read('cases/README.md'))
  const articleMeta = parseArticleMeta(read('articles/README.md'))

  const allFiles = walk(CONTENT)
  const tutorialFiles = allFiles.filter((file) => /^tutorial\/[^/]+\.md$/.test(file)).sort()
  const templateFiles = allFiles.filter((file) => /^templates\/[^/]+\/README\.md$/.test(file)).sort()
  const caseFiles = allFiles.filter((file) => /^cases\/[^/]+\/README\.md$/.test(file)).sort()
  const articleFiles = allFiles.filter((file) => /^articles\/[^/]+\.md$/.test(file) && file !== 'articles/README.md').sort()

  const fileRoutes = new Map()
  const courseEntries = []
  const appendixEntries = []
  const templateEntries = []
  const caseEntries = []
  const articleEntries = []

  for (const rel of tutorialFiles) {
    const file = path.basename(rel)
    if (file === 'README.md') {
      fileRoutes.set(nfc(rel), '/courses')
      continue
    }
    const raw = read(rel)
    const title = parseTitle(raw)
    const numMatch = file.match(/^(\d{2}|T\d{2})-/)
    if (numMatch) {
      const num = numMatch[1]
      const id = num.toLowerCase()
      fileRoutes.set(nfc(rel), `/courses/${id}`)
      const meta = tutorialIndex.get(file)
      const body = stripInline(title.replace(/^(?:\d{2}|T\d{2})\s*·\s*/, ''))
      courseEntries.push({
        id,
        num,
        title: body,
        summary: trimText(meta?.summary || firstQuote(raw) || firstParagraph(raw), 96),
        raw,
        rel,
        trackId: num.startsWith('T') ? 'special' : TRACKS.find((track) => track.start && Number(num) >= track.start && Number(num) <= track.end)?.id || 'foundation',
        minutes: readingMinutes(raw),
        chars: raw.length,
      })
    } else if (file === '术语表.md') {
      fileRoutes.set(nfc(rel), '/courses/glossary')
      appendixEntries.push({ id: 'glossary', title: parseTitle(raw), summary: '把架构判断里最容易混淆的词，一次说清。', raw, rel, minutes: readingMinutes(raw) })
    } else if (file === '演进触发信号.md') {
      fileRoutes.set(nfc(rel), '/courses/evolution-signals')
      appendixEntries.push({ id: 'evolution-signals', title: parseTitle(raw), summary: '什么时候该升级架构？用一组可量化的信号替代拍脑袋。', raw, rel, minutes: readingMinutes(raw) })
    }
  }

  for (const rel of templateFiles) {
    const id = nfc(rel.match(/^templates\/([^/]+)\/README\.md$/)[1])
    if (id === '_TEMPLATE') continue
    if (id === 'ai-native-organization') continue
    const raw = read(rel)
    const h1 = parseTitle(raw)
    const meta = templateMeta.get(id)
    fileRoutes.set(nfc(rel), `/templates/${id}`)
    templateEntries.push({
      id,
      title: meta?.title || h1.replace(/\s*架构模板$/, ''),
      h1,
      summary: trimText(meta?.positioning || firstQuote(raw) || firstParagraph(raw), 92),
      category: meta?.category || 'classic',
      products: meta?.products || '',
      highlights: meta?.highlights || [],
      raw,
      rel,
      minutes: readingMinutes(raw),
    })
  }

  for (const rel of caseFiles) {
    const id = nfc(rel.match(/^cases\/([^/]+)\/README\.md$/)[1])
    const raw = read(rel)
    const h1 = parseTitle(raw)
    const meta = caseMeta.get(id)
    const cleanH1 = h1.replace(/^案例\s*\d+\s*·\s*/, '')
    const title = cleanH1.replace(/^([^:：]+)[:：]/, '$1：')
    fileRoutes.set(nfc(rel), `/cases/${id}`)
    caseEntries.push({
      id,
      num: h1.match(/^案例\s*(\d+)/)?.[1] || '',
      title,
      h1,
      summary: trimText(meta?.learn?.join(' · ') || firstQuote(raw) || firstParagraph(raw), 92),
      category: meta?.category || 'platform',
      templates: meta?.templates || [],
      learn: meta?.learn || [],
      raw,
      rel,
      minutes: readingMinutes(raw),
    })
  }

  for (const rel of articleFiles) {
    const id = nfc(rel.match(/^articles\/([^/]+)\.md$/)[1])
    const raw = read(rel)
    const title = parseTitle(raw)
    const meta = articleMeta.get(nfc(path.basename(rel)))
    fileRoutes.set(nfc(rel), `/articles/${id}`)
    articleEntries.push({
      id,
      title,
      summary: trimText(meta?.summary || firstQuote(raw) || firstParagraph(raw), 96),
      category: ARTICLE_TOPIC_CATEGORY[meta?.topic] || 'agent',
      topic: meta?.topic || 'Agent 架构',
      sourceLabel: meta?.source || '',
      tags: meta?.tags || [],
      sources: extractArticleSources(raw),
      raw,
      rel,
      minutes: readingMinutes(raw),
      chars: raw.length,
      order: meta?.order ?? 999,
    })
  }

  fileRoutes.set(nfc('README.md'), '/')
  fileRoutes.set(nfc('articles/README.md'), '/articles')
  fileRoutes.set(nfc('templates/README.md'), '/templates')
  fileRoutes.set(nfc('templates/_TEMPLATE.md'), '/templates')
  fileRoutes.set(nfc('cases/README.md'), '/cases')
  fileRoutes.set(nfc('tutorial/README.md'), '/courses')
  fileRoutes.set(nfc('templates/ai-native-organization/README.md'), '/templates')

  courseEntries.sort((a, b) => {
    if (a.num.startsWith('T') && b.num.startsWith('T')) return a.num.localeCompare(b.num)
    if (a.num.startsWith('T')) return 1
    if (b.num.startsWith('T')) return -1
    return Number(a.num) - Number(b.num)
  })

  templateEntries.sort((a, b) => {
    const ai = templateMeta.get(nfc(a.id))
    const bi = templateMeta.get(nfc(b.id))
    if (!ai && !bi) return a.id.localeCompare(b.id)
    if (!ai) return 1
    if (!bi) return -1
    return ai.order - bi.order
  })

  caseEntries.sort((a, b) => Number(a.num) - Number(b.num))
  articleEntries.sort((a, b) => a.order - b.order || a.id.localeCompare(b.id))

  for (const track of TRACKS) {
    if (track.id === 'special') track.chapterIds = courseEntries.filter((course) => course.trackId === 'special').map((course) => course.id)
    else track.chapterIds = courseEntries.filter((course) => course.trackId === track.id).map((course) => course.id)
    track.count = track.chapterIds.length
    track.minutes = courseEntries.filter((course) => track.chapterIds.includes(course.id)).reduce((sum, course) => sum + course.minutes, 0)
  }

  const search = []
  const docs = new Map()

  function renderDoc({ id, type, title, summary, raw, rel, minutes, extra = {} }) {
    const headings = []
    const md = makeRenderer(rel, fileRoutes, headings)
    let html = md.render(raw)
    html = html.replace(/^<h1[^>]*>[\s\S]*?<\/h1>\s*/, '')
    const key = `${type}-${id}`
    docs.set(key, {
      id,
      type,
      title,
      summary,
      minutes,
      html,
      headings: headings.filter((heading) => heading.text.length > 0),
      ...extra,
    })
    search.push({
      id,
      type,
      title,
      summary,
      track: extra.trackName || extra.categoryName || '',
      headings: headings.map((heading) => heading.text).slice(0, 30),
      body: extractPlain(raw).slice(0, 3200),
      path: type === 'course' ? `/courses/${id}` : type === 'appendix' ? `/courses/${id}` : type === 'template' ? `/templates/${id}` : type === 'case' ? `/cases/${id}` : `/articles/${id}`,
    })
    return key
  }

  const courseDocs = []
  for (const course of courseEntries) {
    const track = TRACKS.find((item) => item.id === course.trackId)
    const key = renderDoc({
      id: course.id,
      type: 'course',
      title: course.title,
      summary: course.summary,
      raw: course.raw,
      rel: course.rel,
      minutes: course.minutes,
      extra: {
        num: course.num,
        trackId: course.trackId,
        trackName: track?.name || '课程',
        trackColor: track?.color || '#0f766e',
      },
    })
    courseDocs.push({
      id: course.id,
      key,
      num: course.num,
      title: course.title,
      summary: course.summary,
      trackId: course.trackId,
      minutes: course.minutes,
      chars: course.chars,
      rel: course.rel,
    })
  }

  const appendixDocs = []
  for (const entry of appendixEntries) {
    const key = renderDoc({
      id: entry.id,
      type: 'appendix',
      title: entry.title,
      summary: entry.summary,
      raw: entry.raw,
      rel: entry.rel,
      minutes: entry.minutes,
      extra: { trackName: '附录' },
    })
    appendixDocs.push({ id: entry.id, key, title: entry.title, summary: entry.summary, minutes: entry.minutes, rel: entry.rel })
  }

  const templateDocs = []
  for (const entry of templateEntries) {
    const category = TEMPLATE_CATEGORIES.find((item) => item.id === entry.category)
    const key = renderDoc({
      id: entry.id,
      type: 'template',
      title: entry.title,
      summary: entry.summary,
      raw: entry.raw,
      rel: entry.rel,
      minutes: entry.minutes,
      extra: {
        category: entry.category,
        categoryName: category?.name || '架构模板',
        products: entry.products,
        highlights: entry.highlights,
        trackName: category?.name || '架构模板',
      },
    })
    templateDocs.push({
      id: entry.id,
      key,
      title: entry.title,
      summary: entry.summary,
      category: entry.category,
      products: entry.products,
      highlights: entry.highlights,
      minutes: entry.minutes,
      rel: entry.rel,
    })
  }

  const caseDocs = []
  for (const entry of caseEntries) {
    const category = CASE_CATEGORIES.find((item) => item.id === entry.category)
    const key = renderDoc({
      id: entry.id,
      type: 'case',
      title: entry.title,
      summary: entry.summary,
      raw: entry.raw,
      rel: entry.rel,
      minutes: entry.minutes,
      extra: {
        num: entry.num,
        category: entry.category,
        categoryName: category?.name || '实战案例',
        templates: entry.templates,
        learn: entry.learn,
        trackName: '实战案例',
      },
    })
    caseDocs.push({
      id: entry.id,
      key,
      num: entry.num,
      title: entry.title,
      summary: entry.summary,
      category: entry.category,
      templates: entry.templates,
      learn: entry.learn,
      minutes: entry.minutes,
      rel: entry.rel,
    })
  }

  const articleDocs = []
  articleEntries.forEach((entry, index) => {
    const category = ARTICLE_CATEGORIES.find((item) => item.id === entry.category)
    const key = renderDoc({
      id: entry.id,
      type: 'article',
      title: entry.title,
      summary: entry.summary,
      raw: entry.raw,
      rel: entry.rel,
      minutes: entry.minutes,
      extra: {
        num: String(index + 1).padStart(2, '0'),
        category: entry.category,
        categoryName: category?.name || '优秀文章',
        topic: entry.topic,
        sourceLabel: entry.sourceLabel,
        sources: entry.sources,
        tags: entry.tags,
        trackName: '优秀文章',
      },
    })
    articleDocs.push({
      id: entry.id,
      key,
      num: String(index + 1).padStart(2, '0'),
      title: entry.title,
      summary: entry.summary,
      category: entry.category,
      categoryName: category?.name || '优秀文章',
      topic: entry.topic,
      sourceLabel: entry.sourceLabel,
      sources: entry.sources,
      tags: entry.tags,
      minutes: entry.minutes,
      chars: entry.chars,
      rel: entry.rel,
    })
  })

  for (const [key, doc] of docs) {
    fs.writeFileSync(path.join(DOCS_OUT, `${key}.json`), JSON.stringify(doc))
  }

  const catalog = {
    generatedAt: new Date().toISOString(),
    upstream: REPO,
    stats: {
      coreCourses: courseDocs.filter((course) => !course.num.startsWith('T')).length,
      specials: courseDocs.filter((course) => course.num.startsWith('T')).length,
      allCourses: courseDocs.length,
      templates: templateDocs.length,
      cases: caseDocs.length,
      articles: articleDocs.length,
      minutes: courseDocs.reduce((sum, course) => sum + course.minutes, 0),
    },
    tracks: TRACKS.map(({ raw, ...track }) => track),
    courses: courseDocs,
    appendices: appendixDocs,
    templates: templateDocs,
    cases: caseDocs,
    articles: articleDocs,
    templateCategories: TEMPLATE_CATEGORIES,
    caseCategories: CASE_CATEGORIES,
    articleCategories: ARTICLE_CATEGORIES,
  }

  fs.writeFileSync(path.join(OUT, 'catalog.json'), JSON.stringify(catalog, null, 2))
  fs.writeFileSync(path.join(OUT, 'search.json'), JSON.stringify(search))

  console.log(`✓ ${courseDocs.length} courses, ${templateDocs.length} templates, ${caseDocs.length} cases, ${articleDocs.length} articles, ${appendixDocs.length} appendices`)
  console.log(`✓ ${(fs.statSync(path.join(OUT, 'search.json')).size / 1024).toFixed(0)} KB search index`)
}

main()
