import './styles/index.css'
import { loadApiKey } from './services/api-key'
import { renderContinentBar, onContinentChange } from './components/ContinentBar'
import { renderCards, setSearchQuery, initBookmarks } from './components/CardGrid'
import { initKeyPanel } from './components/KeyPanel'
import { initAiGenerator } from './components/AiGenerator'
import { initVideoTransition } from './components/VideoTransition'
import { initMap, filterMapByContinent } from './components/MapView'
import { initStylePicker, onStyleChange } from './components/StylePicker'
import { initRoutePlanner } from './components/RoutePlanner'
import { $ } from './utils/html'

async function init(): Promise<void> {
  loadApiKey()
  initKeyPanel()
  initMap()
  initStylePicker()
  onStyleChange(() => renderCards())
  await initBookmarks()
  renderContinentBar()
  onContinentChange((continent) => {
    renderCards()
    filterMapByContinent(continent)
  })
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
