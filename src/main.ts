import './styles/index.css'
import { loadApiKey } from './services/api-key'
import { renderContinentBar, onContinentChange } from './components/ContinentBar'
import { renderCards, setSearchQuery, initBookmarks } from './components/CardGrid'
import { initKeyPanel } from './components/KeyPanel'
import { initAiGenerator } from './components/AiGenerator'
import { initVideoTransition } from './components/VideoTransition'
import { initMap } from './components/MapView'
import { initStylePicker } from './components/StylePicker'
import { initRoutePlanner } from './components/RoutePlanner'
import { $ } from './utils/html'

async function init(): Promise<void> {
  loadApiKey()
  initKeyPanel()
  initMap()
  initStylePicker()
  await initBookmarks()
  renderContinentBar()
  onContinentChange(() => renderCards())
  await renderCards()
  initAiGenerator()
  initVideoTransition()
  await initRoutePlanner()

  $('searchInput').addEventListener('input', (e) => {
    setSearchQuery((e.target as HTMLInputElement).value)
    renderCards()
  })
}

init()
