import { createStore, get, set, del, entries } from 'idb-keyval'
import type { SavedCollection, GenerationHistoryItem } from '../types'

const bookmarksStore = createStore('gj-bookmarks', 'bookmarks')
const historyStore = createStore('gj-history', 'history')
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

export async function isBookmarked(landmarkId: number): Promise<boolean> {
  const bookmarks = await getBookmarks()
  return bookmarks.has(landmarkId)
}

// ─── Generation History ───

export async function saveToHistory(item: GenerationHistoryItem): Promise<void> {
  await set(item.id, item, historyStore)
}

export async function getHistory(): Promise<GenerationHistoryItem[]> {
  const all = await entries<string, GenerationHistoryItem>(historyStore)
  return all.map(([, v]) => v).sort((a, b) => b.createdAt - a.createdAt)
}

export async function deleteHistoryItem(id: string): Promise<void> {
  await del(id, historyStore)
}

// ─── Route ───

export async function getRoute(): Promise<number[]> {
  const data = await get<number[]>('ids', routeStore)
  return data ?? []
}

export async function setRoute(ids: number[]): Promise<void> {
  await set('ids', ids, routeStore)
}
