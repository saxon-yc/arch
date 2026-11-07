import catalog from '../generated/catalog.json'

const docLoaders = import.meta.glob('../generated/docs/*.json')

export { catalog }

export const courseById = new Map(catalog.courses.map((course) => [course.id, course]))
export const appendixById = new Map(catalog.appendices.map((item) => [item.id, item]))
export const templateById = new Map(catalog.templates.map((item) => [item.id, item]))
export const caseById = new Map(catalog.cases.map((item) => [item.id, item]))
export const trackById = new Map(catalog.tracks.map((track) => [track.id, track]))

export const coreCourses = catalog.courses.filter((course) => !course.num.startsWith('T'))
export const specialCourses = catalog.courses.filter((course) => course.num.startsWith('T'))

export function findDoc(type, id) {
  if (type === 'course') return courseById.get(id)
  if (type === 'appendix') return appendixById.get(id)
  if (type === 'template') return templateById.get(id)
  if (type === 'case') return caseById.get(id)
  return null
}

export function findDocByUid(uid) {
  const [type, ...rest] = String(uid).split(':')
  const id = rest.join(':')
  return { type, id, doc: findDoc(type, id) }
}

export function docUid(type, id) {
  return `${type}:${id}`
}

export function docHref(type, id) {
  if (type === 'course' || type === 'appendix') return `/courses/${id}`
  if (type === 'template') return `/templates/${id}`
  if (type === 'case') return `/cases/${id}`
  return '/'
}

export async function loadDoc(key) {
  const loader = docLoaders[`../generated/docs/${key}.json`]
  if (!loader) throw new Error(`Unknown document: ${key}`)
  const module = await loader()
  return module.default || module
}

let searchCache = null
export async function loadSearchIndex() {
  if (!searchCache) {
    const module = await import('../generated/search.json')
    searchCache = module.default || module
  }
  return searchCache
}

export function typeLabel(type) {
  return {
    course: '课程',
    appendix: '附录',
    template: '架构地图',
    case: '实战案例',
  }[type] || '文档'
}

export function formatMinutes(minutes) {
  if (!minutes) return '—'
  if (minutes < 60) return `${minutes} 分钟`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest ? `${hours} 小时 ${rest} 分` : `${hours} 小时`
}

export function trackCourses(trackId) {
  const track = trackById.get(trackId)
  if (!track) return []
  return track.chapterIds.map((id) => courseById.get(id)).filter(Boolean)
}

export function getCourseSequence() {
  return catalog.courses
}

export function getPrevNext(type, id) {
  let list = []
  if (type === 'course') list = catalog.courses
  else if (type === 'appendix') list = catalog.appendices
  else if (type === 'template') list = catalog.templates
  else if (type === 'case') list = catalog.cases
  const index = list.findIndex((item) => item.id === id)
  if (index < 0) return { prev: null, next: null }
  return {
    prev: index > 0 ? list[index - 1] : null,
    next: index < list.length - 1 ? list[index + 1] : null,
  }
}

export function docTitleFor(type, id) {
  return findDoc(type, id)?.title || id
}
