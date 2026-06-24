export type ContinentKey =
  | 'asia'
  | 'europe'
  | 'africa'
  | 'south-america'
  | 'north-america'
  | 'oceania'

export interface Landmark {
  id: number
  continent: ContinentKey
  city: string
  country: string
  nameEn: string
  nameZh: string
  lat: number
  lng: number
  features: string
  promptEn: string
  promptZh: string
  animationPrompt: string
}

export interface ContinentInfo {
  key: string
  label: string
  labelZh: string
}

export interface SavedCollection {
  id: string
  name: string
  landmarkIds: number[]
  createdAt: number
}

export interface GenerationHistoryItem {
  id: string
  input: string
  promptEn: string
  promptZh: string
  animationPrompt: string
  style: string
  createdAt: number
}

export interface RouteItem {
  landmarkId: number
  order: number
}
