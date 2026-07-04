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

// btnAttrs must be caller-built static attributes (data-* with numeric ids), never user input
export function promptSection(
  label: string,
  btnAttrs: string,
  text: string,
  textClass = 'prompt-text',
  sectionClass = '',
): string {
  return `
    <div class="prompt-section${sectionClass}">
      <div class="prompt-label">
        ${escapeHtml(label)}
        <button class="copy-btn" ${btnAttrs}>Copy</button>
      </div>
      <div class="${textClass}">${escapeHtml(text)}</div>
    </div>`
}
