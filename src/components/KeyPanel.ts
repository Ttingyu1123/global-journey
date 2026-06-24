import { $} from '../utils/html'
import { saveApiKey, getApiKey, hasApiKey } from '../services/api-key'

export function initKeyPanel(): void {
  $('keyToggle').addEventListener('click', toggleKeyPanel)
  $('keySaveBtn').addEventListener('click', handleSave)

  if (hasApiKey()) {
    $('keyToggle').classList.add('active')
  }
}

function toggleKeyPanel(): void {
  const panel = $('keyPanel')
  panel.classList.toggle('show')
  if (panel.classList.contains('show') && hasApiKey()) {
    ;($('keyInput') as HTMLInputElement).value = getApiKey()
    const status = $('keyStatus')
    status.textContent = 'Key saved'
    status.className = 'key-status ok'
  }
}

function handleSave(): void {
  const input = ($('keyInput') as HTMLInputElement).value.trim()
  const remember = ($('keyRemember') as HTMLInputElement).checked
  const result = saveApiKey(input, remember)
  const status = $('keyStatus')
  status.textContent = result.message
  status.className = result.ok ? 'key-status ok' : 'key-status err'
  if (result.ok) {
    $('keyToggle').classList.add('active')
  }
}
