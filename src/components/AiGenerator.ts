import { escapeHtml, $, promptSection } from '../utils/html'
import { hasApiKey } from '../services/api-key'
import { generatePrompt, type GenerateResult } from '../services/gemini'
import { showToast, flashCopied } from './Toast'

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
      ${promptSection('Image Prompt (EN)', 'data-gen-copy="promptEn"', String(parsed.promptEn || ''))}
      ${promptSection('Chinese Translation', 'data-gen-copy="promptZh"', String(parsed.promptZh || ''), 'prompt-text-zh')}
      ${parsed.animationPrompt ? promptSection('Animation Transition', 'data-gen-copy="animationPrompt"', String(parsed.animationPrompt || ''), 'prompt-text-anim') : ''}
    </div>`

  container.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const field = (btn as HTMLElement).dataset.genCopy as keyof GenerateResult
      flashCopied(btn as HTMLElement, String(parsed[field] || ''))
    })
  })
}
