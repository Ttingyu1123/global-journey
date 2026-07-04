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

