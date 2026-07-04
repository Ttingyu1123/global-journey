import { createStore, get, set } from 'idb-keyval'

const bookmarksStore = createStore('gj-bookmarks', 'bookmarks')
const routeStore = createStore('gj-route', 'route')

// ─── Bookmarks (individual landmark saves) ───

export async function getBookmarks(): Promise<Set<number>> {
  const data = await get<number[]>('ids', bookmarksStore)
  return new Set(data ?? [])
}

export async function toggleBookmark(landmarkId: number): Promise<boolean> {
  const bookmarks = await getBookmarks()
  const wasBookmarked = bookmarks.has(landmarkId)
  if (wasBookmarked) {
    bookmarks.delete(landmarkId)
  } else {
    bookmarks.add(landmarkId)
  }
  await set('ids', [...bookmarks], bookmarksStore)
  return !wasBookmarked
}

// ─── Route ───

export async function getRoute(): Promise<number[]> {
  const data = await get<number[]>('ids', routeStore)
  return data ?? []
}

export async function setRoute(ids: number[]): Promise<void> {
  await set('ids', ids, routeStore)
}
