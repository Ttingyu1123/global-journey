import { STYLE_TEMPLATES } from '../data/styles'
import type { StyleTemplate } from '../data/styles'
import { LANDMARKS } from '../data/landmarks'
import { escapeHtml, $ } from '../utils/html'
import { composePrompt } from '../utils/style-composer'
import { flashCopied } from './Toast'

let activeStyle: StyleTemplate = STYLE_TEMPLATES[0]
let onChangeCallback: (() => void) | null = null

export function getActiveStyle(): StyleTemplate {
  return activeStyle
}

export function isDefaultStyle(): boolean {
  return activeStyle.key === '3d-relief'
}

export function onStyleChange(cb: () => void): void {
  onChangeCallback = cb
}

export function initStylePicker(): void {
  const container = $('stylePicker')
  container.innerHTML = STYLE_TEMPLATES.map(s => {
    const isActive = s.key === activeStyle.key ? ' active' : ''
    return `<button class="style-pill${isActive}" data-style="${s.key}">${escapeHtml(s.labelZh)} ${escapeHtml(s.label)}</button>`
  }).join('')

  container.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest('.style-pill') as HTMLElement | null
    if (!btn) return
    const key = btn.dataset.style!
    const found = STYLE_TEMPLATES.find(s => s.key === key)
    if (found) {
      activeStyle = found
      container.querySelectorAll('.style-pill').forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      updatePreview()
      onChangeCallback?.()
    }
  })

  updatePreview()
}

function updatePreview(): void {
  const previewBox = $('stylePreview')
  const sample = LANDMARKS[0]
  if (!sample) {
    previewBox.innerHTML = ''
    return
  }
  const composed = composePrompt(sample, activeStyle)
  previewBox.innerHTML = `
    <div class="style-preview-label">
      <span>Preview: ${escapeHtml(sample.nameEn)}</span>
      <button class="copy-btn" id="stylePreviewCopy">Copy</button>
    </div>
    <div class="prompt-text">${escapeHtml(composed)}</div>
  `
  $('stylePreviewCopy').addEventListener('click', () => {
    flashCopied($('stylePreviewCopy'), composed)
  })
}
