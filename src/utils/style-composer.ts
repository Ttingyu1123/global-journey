import type { Landmark } from '../types'
import type { StyleTemplate } from '../data/styles'

export function composePrompt(landmark: Landmark, style: StyleTemplate): string {
  return `${landmark.city}, ${landmark.country}: ${style.prefix} ${landmark.features}, ${style.colors} ${style.suffix}`
}
