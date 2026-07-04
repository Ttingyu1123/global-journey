import { $, copyToClipboard } from '../utils/html'

let timer: ReturnType<typeof setTimeout> | undefined

export function showToast(msg: string): void {
  const toast = $('toast')
  toast.textContent = msg
  toast.classList.add('show')
  clearTimeout(timer)
  timer = setTimeout(() => toast.classList.remove('show'), 2000)
}

const COPY_FEEDBACK_MS = 2000

export function flashCopied(btn: HTMLElement, text: string): void {
  copyToClipboard(text).then(() => {
    btn.classList.add('copied')
    btn.textContent = 'Copied!'
    showToast('Copied to clipboard')
    setTimeout(() => {
      btn.classList.remove('copied')
      btn.textContent = 'Copy'
    }, COPY_FEEDBACK_MS)
  })
}
