import { LANDMARKS } from '../data/landmarks'
import { escapeHtml, $, copyToClipboard } from '../utils/html'
import { getDirection } from '../utils/transition-directions'
import { getRoute, setRoute } from '../services/db'
import { showToast } from './Toast'

let routeIds: number[] = []

export async function initRoutePlanner(): Promise<void> {
  routeIds = await getRoute()
  renderRoute()
  setupAddLandmark()
  $('routeExportBtn').addEventListener('click', handleExport)
  $('routeClearBtn').addEventListener('click', handleClear)
}

function setupAddLandmark(): void {
  const select = $('routeAddSelect') as HTMLSelectElement
  select.innerHTML = '<option value="">+ Add landmark...</option>' +
    LANDMARKS.map(l =>
      `<option value="${l.id}">${escapeHtml(l.nameZh)} (${escapeHtml(l.nameEn)})</option>`
    ).join('')

  select.addEventListener('change', async () => {
    const id = Number(select.value)
    if (!id) return
    routeIds = [...routeIds, id]
    await setRoute(routeIds)
    select.value = ''
    renderRoute()
  })
}

function renderRoute(): void {
  const list = $('routeList')
  if (routeIds.length === 0) {
    list.innerHTML = '<div class="route-empty">No landmarks in route. Add some above.</div>'
    return
  }

  list.innerHTML = routeIds.map((id, i) => {
    const l = LANDMARKS.find(lm => lm.id === id)
    if (!l) return ''
    const transition = i > 0 ? renderTransition(routeIds[i - 1], id) : ''
    return `${transition}
      <div class="route-item" data-index="${i}" draggable="true">
        <span class="route-grip">&#8942;&#8942;</span>
        <span class="route-num">${i + 1}</span>
        <div class="route-info">
          <div class="route-name">${escapeHtml(l.nameEn)}</div>
          <div class="route-loc">${escapeHtml(l.city)}, ${escapeHtml(l.country)}</div>
        </div>
        <button class="route-remove" data-remove="${i}" title="Remove">&times;</button>
      </div>`
  }).join('')

  setupDragDrop()
  list.querySelectorAll('.route-remove').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const idx = Number((e.currentTarget as HTMLElement).dataset.remove)
      routeIds = routeIds.filter((_, i) => i !== idx)
      await setRoute(routeIds)
      renderRoute()
    })
  })
}

function renderTransition(fromId: number, toId: number): string {
  const from = LANDMARKS.find(l => l.id === fromId)
  const to = LANDMARKS.find(l => l.id === toId)
  if (!from || !to) return ''
  const dir = getDirection(from.continent, to.continent, from.nameZh, to.nameZh)
  return `<div class="route-transition">
    <span class="route-transition-arrow">&#8595;</span>
    <span class="route-transition-text">${escapeHtml(dir)}</span>
  </div>`
}

function setupDragDrop(): void {
  const list = $('routeList')
  let dragIdx: number | null = null

  list.querySelectorAll('.route-item').forEach(el => {
    el.addEventListener('dragstart', (e) => {
      dragIdx = Number((el as HTMLElement).dataset.index)
      ;(el as HTMLElement).classList.add('dragging')
      ;(e as DragEvent).dataTransfer!.effectAllowed = 'move'
    })
    el.addEventListener('dragend', () => {
      (el as HTMLElement).classList.remove('dragging')
      dragIdx = null
    })
    el.addEventListener('dragover', (e) => {
      e.preventDefault()
      ;(e as DragEvent).dataTransfer!.dropEffect = 'move'
    })
    el.addEventListener('drop', async (e) => {
      e.preventDefault()
      const dropIdx = Number((el as HTMLElement).dataset.index)
      if (dragIdx === null || dragIdx === dropIdx) return
      const item = routeIds[dragIdx]
      const newIds = routeIds.filter((_, i) => i !== dragIdx)
      newIds.splice(dropIdx, 0, item)
      routeIds = newIds
      await setRoute(routeIds)
      renderRoute()
    })
  })
}

async function handleClear(): Promise<void> {
  routeIds = []
  await setRoute(routeIds)
  renderRoute()
  showToast('Route cleared')
}

function handleExport(): void {
  if (routeIds.length === 0) {
    showToast('Route is empty')
    return
  }

  const lines: string[] = []
  routeIds.forEach((id, i) => {
    const l = LANDMARKS.find(lm => lm.id === id)
    if (!l) return

    if (i > 0) {
      const prev = LANDMARKS.find(lm => lm.id === routeIds[i - 1])
      if (prev) {
        const dir = getDirection(prev.continent, l.continent, prev.nameZh, l.nameZh)
        const transition = `穿梭動畫，一鏡到底，鏡頭從${prev.nameZh}上空快速拉遠，${dir}，飛快地朝${l.nameZh}前進，來到一片空白地面上，${l.nameZh}的建築物如雨後春筍一般從空白地面拔地而起。`
        lines.push('')
        lines.push(`--- Transition ${i} → ${i + 1} ---`)
        lines.push(transition)
      }
    }

    lines.push('')
    lines.push(`=== ${i + 1}. ${l.nameEn} (${l.nameZh}) ===`)
    lines.push(`[Image Prompt EN] ${l.promptEn}`)
    lines.push(`[Chinese Translation] ${l.promptZh}`)
    if (l.animationPrompt) {
      lines.push(`[Animation] ${l.animationPrompt}`)
    }
  })

  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `global-journey-route-${routeIds.length}-stops.txt`
  a.click()
  URL.revokeObjectURL(url)
  showToast(`Exported ${routeIds.length} stops`)
}
