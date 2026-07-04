import { LANDMARKS } from '../data/landmarks'
import { escapeHtml, $ } from '../utils/html'
import { getDirection } from '../utils/transition-directions'
import { flashCopied } from './Toast'

export function initVideoTransition(): void {
  renderSelects()
  $('videoGenBtn').addEventListener('click', handleGenerate)
}

function renderSelects(): void {
  const fromSel = $('videoFrom') as HTMLSelectElement
  const toSel = $('videoTo') as HTMLSelectElement
  const opts = LANDMARKS.map(l =>
    `<option value="${l.id}">${escapeHtml(l.nameZh)} (${escapeHtml(l.nameEn)})</option>`
  ).join('')
  fromSel.innerHTML = opts
  toSel.innerHTML = opts
  if (LANDMARKS.length > 1) toSel.selectedIndex = 1
}

function handleGenerate(): void {
  const fromId = Number((($('videoFrom') as HTMLSelectElement).value))
  const toId = Number((($('videoTo') as HTMLSelectElement).value))
  const from = LANDMARKS.find(l => l.id === fromId)
  const to = LANDMARKS.find(l => l.id === toId)
  if (!from || !to) return

  const direction = getDirection(from.continent, to.continent, from.nameZh, to.nameZh)
  const prompt = `穿梭動畫，一鏡到底，鏡頭從${from.nameZh}上空快速拉遠，${direction}，飛快地朝${to.nameZh}前進，來到一片空白地面上，${to.nameZh}的建築物如雨後春筍一般從空白地面拔地而起。`

  const resultDiv = $('videoResult')
  resultDiv.innerHTML = `
    <div style="margin-top:16px;padding:16px;background:var(--linen);border:1px solid var(--gold);border-radius:var(--radius)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <span style="font:600 12px var(--font-body);letter-spacing:0.5px;text-transform:uppercase;color:var(--sienna)">Transition Prompt</span>
        <button class="copy-btn" id="videoResultCopy">Copy</button>
      </div>
      <div class="prompt-text-anim">${escapeHtml(prompt)}</div>
    </div>`

  $('videoResultCopy').addEventListener('click', () => {
    flashCopied($('videoResultCopy'), prompt)
  })
}
