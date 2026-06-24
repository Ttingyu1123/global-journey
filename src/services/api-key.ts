const STORAGE_KEY = 'gemini_api_key_gj'

let currentKey = ''

export function getApiKey(): string {
  return currentKey
}

export function loadApiKey(): void {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) currentKey = saved
}

export function saveApiKey(key: string, remember: boolean): { ok: boolean; message: string } {
  if (!key.startsWith('AIza') || key.length < 35) {
    return { ok: false, message: 'Invalid key format (should start with AIza and be 35+ chars)' }
  }
  currentKey = key
  if (remember) {
    localStorage.setItem(STORAGE_KEY, key)
  } else {
    sessionStorage.setItem(STORAGE_KEY, key)
    localStorage.removeItem(STORAGE_KEY)
  }
  return { ok: true, message: 'Key saved successfully' }
}

export function hasApiKey(): boolean {
  return currentKey.length > 0
}
