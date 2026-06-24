import { $ } from '../utils/html'

let timer: ReturnType<typeof setTimeout> | undefined

export function showToast(msg: string): void {
  const toast = $('toast')
  toast.textContent = msg
  toast.classList.add('show')
  clearTimeout(timer)
  timer = setTimeout(() => toast.classList.remove('show'), 2000)
}
