import { escapeHtml, $, copyToClipboard } from '../utils/html'
import { hasApiKey } from '../services/api-key'
import { generatePrompt, type GenerateResult } from '../services/gemini'
import { showToast } from './Toast'

export function initAiGenerator(): void {
  const btn = $('genBtn') as HTMLButtonElement
  const input = $('genInput') as HTMLInputElement

  btn.addEventListener('click', handleGenerate)
  input.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter') handleGenerate()
  })
}

async function handleGenerate(): Promise<void> {
  if (!hasApiKey()) {
    showToast('Please set your Gemini API Key first')
    $('keyPanel').classList.add('show')
    return
  }

  const input = $('genInput') as HTMLInputElement
  const text = input.value.trim()
  if (!text) return

  const btn = $('genBtn') as HTMLButtonElement
  const result = $('genResult')
  btn.disabled = true
  btn.textContent = 'Generating...'
  result.innerHTML = `<div class="gen-loading"><div class="spinner"></div><br>Generating prompt for "${escapeHtml(text)}"...</div>`

  try {
    const parsed = await generatePrompt(text)
    renderResult(result, text, parsed)
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    result.innerHTML = `<div class="gen-error">${escapeHtml(msg)}</div>`
  } finally {
    btn.disabled = false
    btn.textContent = 'Generate'
  }
}

function renderResult(container: HTMLElement, input: string, parsed: GenerateResult): void {
  container.innerHTML = `
    <div class="gen-result-card">
      <div style="font-weight:600;font-size:16px;margin-bottom:12px;color:var(--gold)">${escapeHtml(input)}</div>
      <div class="prompt-section">
        <div class="prompt-label">Image Prompt (EN) <button class="copy-btn" data-gen-copy="promptEn">Copy</button></div>
        <div class="prompt-text">${escapeHtml(String(parsed.promptEn || ''))}</div>
      </div>
      <div class="prompt-section">
        <div class="prompt-label">Chinese Translation <button class="copy-btn" data-gen-copy="promptZh">Copy</button></div>
        <div class="prompt-text-zh">${escapeHtml(String(parsed.promptZh || ''))}</div>
      </div>
      ${parsed.animationPrompt ? `<div class="prompt-section">
        <div class="prompt-label">Animation Transition <button class="copy-btn" data-gen-copy="animationPrompt">Copy</button></div>
        <div class="prompt-text-anim">${escapeHtml(String(parsed.animationPrompt || ''))}</div>
      </div>` : ''}
    </div>`

  container.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const field = (btn as HTMLElement).dataset.genCopy as keyof GenerateResult
      copyToClipboard(String(parsed[field] || '')).then(() => {
        btn.classList.add('copied')
        btn.textContent = 'Copied!'
        showToast('Copied to clipboard')
        setTimeout(() => {
          btn.classList.remove('copied')
          btn.textContent = 'Copy'
        }, 2000)
      })
    })
  })
}
