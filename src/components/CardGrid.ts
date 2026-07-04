import { LANDMARKS } from '../data/landmarks'
import { escapeHtml, $, promptSection } from '../utils/html'
import { getActiveContinent } from './ContinentBar'
import { getActiveStyle, isDefaultStyle } from './StylePicker'
import { composePrompt } from '../utils/style-composer'
import { showToast, flashCopied } from './Toast'
import { toggleBookmark, getBookmarks } from '../services/db'
import type { Landmark } from '../types'

let searchQuery = ''
let bookmarkedIds = new Set<number>()

export function setSearchQuery(q: string): void {
  searchQuery = q
}

export async function initBookmarks(): Promise<void> {
  bookmarkedIds = await getBookmarks()
}

export async function renderCards(): Promise<void> {
  const grid = $('cardsGrid')
  const continent = getActiveContinent()
  const search = searchQuery.toLowerCase().trim()
  const style = getActiveStyle()
  const useComposed = !isDefaultStyle()

  let filtered: Landmark[] = LANDMARKS
  if (continent !== 'all') {
    filtered = filtered.filter(l => l.continent === continent)
  }
  if (search) {
    filtered = filtered.filter(l =>
      l.nameEn.toLowerCase().includes(search) ||
      l.nameZh.includes(search) ||
      l.city.toLowerCase().includes(search) ||
      l.country.toLowerCase().includes(search)
    )
  }

  if (filtered.length === 0) {
    grid.innerHTML = '<div class="no-results">No landmarks found</div>'
    return
  }

  grid.innerHTML = filtered.map(l => {
    const bookmarkClass = bookmarkedIds.has(l.id) ? ' saved' : ''
    const bookmarkIcon = bookmarkedIds.has(l.id)
      ? '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M5 2h14a1 1 0 011 1v19.143a.5.5 0 01-.766.424L12 18.03l-7.234 4.537A.5.5 0 014 22.143V3a1 1 0 011-1z"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 2h14a1 1 0 011 1v19.143a.5.5 0 01-.766.424L12 18.03l-7.234 4.537A.5.5 0 014 22.143V3a1 1 0 011-1z"/></svg>'

    const composedPrompt = useComposed ? composePrompt(l, style) : ''
    const styleLabel = useComposed ? ` (${style.label})` : ''

    return `
    <div class="card" data-id="${l.id}">
      <div class="card-header">
        <span class="card-num">#${String(l.id).padStart(2, '0')}</span>
        <div class="card-info">
          <div class="card-name-en">${escapeHtml(l.nameEn)}</div>
          <div class="card-name-zh">${escapeHtml(l.nameZh)}</div>
          <div class="card-location">${escapeHtml(l.city)}${l.country ? ', ' + escapeHtml(l.country) : ''}</div>
        </div>
        <div class="card-actions">
          <button class="card-bookmark${bookmarkClass}" data-bookmark="${l.id}" title="收藏">${bookmarkIcon}</button>
          <svg class="card-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
        </div>
      </div>
      <div class="card-detail">
        <div class="card-detail-inner">
          <div class="card-detail-content">
            ${useComposed ? promptSection(`${style.label} Prompt${styleLabel}`, `data-copy-composed="${l.id}"`, composedPrompt) : ''}
            ${promptSection(`${useComposed ? 'Original ' : ''}Image Prompt (EN)`, `data-copy="promptEn" data-id="${l.id}"`, l.promptEn, 'prompt-text', useComposed ? ' prompt-section-original' : '')}
            ${promptSection('Chinese Translation', `data-copy="promptZh" data-id="${l.id}"`, l.promptZh, 'prompt-text-zh')}
            ${l.animationPrompt ? promptSection('Animation Transition', `data-copy="animationPrompt" data-id="${l.id}"`, l.animationPrompt, 'prompt-text-anim') : ''}
          </div>
        </div>
      </div>
    </div>`
  }).join('')

  grid.addEventListener('click', handleGridClick)
}

function handleGridClick(e: Event): void {
  const target = e.target as HTMLElement

  const composedCopy = target.closest('[data-copy-composed]') as HTMLElement | null
  if (composedCopy) {
    e.stopPropagation()
    const id = Number(composedCopy.dataset.copyComposed)
    const landmark = LANDMARKS.find(l => l.id === id)
    if (landmark) {
      flashCopied(composedCopy, composePrompt(landmark, getActiveStyle()))
    }
    return
  }

  const copyBtn = target.closest('.copy-btn') as HTMLElement | null
  if (copyBtn) {
    e.stopPropagation()
    const field = copyBtn.dataset.copy as keyof Landmark
    const id = Number(copyBtn.dataset.id)
    const landmark = LANDMARKS.find(l => l.id === id)
    if (landmark) {
      flashCopied(copyBtn, String(landmark[field]))
    }
    return
  }

  const bookmarkBtn = target.closest('.card-bookmark') as HTMLElement | null
  if (bookmarkBtn) {
    e.stopPropagation()
    const id = Number(bookmarkBtn.dataset.bookmark)
    toggleBookmark(id).then(isNowSaved => {
      if (isNowSaved) {
        bookmarkedIds.add(id)
        showToast('已收藏')
      } else {
        bookmarkedIds.delete(id)
        showToast('已取消收藏')
      }
      renderCards()
    })
    return
  }

  const card = target.closest('.card') as HTMLElement | null
  if (card) {
    card.classList.toggle('open')
  }
}

export function openCard(id: number): void {
  const card = document.querySelector(`.card[data-id="${id}"]`) as HTMLElement | null
  if (card) {
    card.scrollIntoView({ behavior: 'smooth', block: 'center' })
    card.classList.add('open')
  }
}
