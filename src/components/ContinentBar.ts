import { LANDMARKS } from '../data/landmarks'
import { CONTINENTS } from '../data/continents'
import { escapeHtml, $ } from '../utils/html'

let activeContinent = 'all'
let onChangeCallback: ((continent: string) => void) | null = null

export function getActiveContinent(): string {
  return activeContinent
}

export function onContinentChange(cb: (continent: string) => void): void {
  onChangeCallback = cb
}

export function renderContinentBar(): void {
  const bar = $('continentBar')
  const counts: Record<string, number> = {}
  LANDMARKS.forEach(l => { counts[l.continent] = (counts[l.continent] || 0) + 1 })
  counts.all = LANDMARKS.length

  bar.innerHTML = CONTINENTS.map(c => {
    const isActive = c.key === activeContinent ? ' active' : ''
    return `<button class="continent-pill${isActive}" data-continent="${c.key}">
      ${escapeHtml(c.labelZh)} ${escapeHtml(c.label)} <span class="count">${counts[c.key] || 0}</span>
    </button>`
  }).join('')

  bar.querySelectorAll('.continent-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      activeContinent = (btn as HTMLElement).dataset.continent!
      renderContinentBar()
      onChangeCallback?.(activeContinent)
    })
  })
}
