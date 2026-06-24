import './styles/index.css'
import { loadApiKey } from './services/api-key'
import { renderContinentBar, onContinentChange } from './components/ContinentBar'
import { renderCards, setSearchQuery, initBookmarks } from './components/CardGrid'
import { initKeyPanel } from './components/KeyPanel'
import { initAiGenerator } from './components/AiGenerator'
import { initVideoTransition } from './components/VideoTransition'
import { $ } from './utils/html'

async function init(): Promise<void> {
  loadApiKey()
  initKeyPanel()
  await initBookmarks()
  renderContinentBar()
  onContinentChange(() => renderCards())
  await renderCards()
  initAiGenerator()
  initVideoTransition()

  $('searchInput').addEventListener('input', (e) => {
    setSearchQuery((e.target as HTMLInputElement).value)
    renderCards()
  })
}

init()
