import type { Landmark } from '../types'
import type { StyleTemplate } from '../data/styles'

export function composePrompt(landmark: Landmark, style: StyleTemplate): string {
  const location = landmark.country
    ? `${landmark.city}, ${landmark.country}`
    : landmark.city
  return `${location}: ${style.prefix} ${landmark.features}, ${style.colors} ${style.suffix}`
}
