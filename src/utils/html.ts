const escapeEl = document.createElement('div')

export function escapeHtml(str: string): string {
  escapeEl.textContent = str
  return escapeEl.innerHTML
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text)
}

export function $(id: string): HTMLElement {
  return document.getElementById(id)!
}
