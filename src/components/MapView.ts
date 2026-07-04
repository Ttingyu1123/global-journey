import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import { LANDMARKS } from '../data/landmarks'
import { escapeHtml, $ } from '../utils/html'
import type { ContinentKey, Landmark } from '../types'

declare module 'leaflet' {
  function markerClusterGroup(options?: Record<string, unknown>): L.LayerGroup & {
    addLayer(layer: L.Layer): void
    clearLayers(): void
  }
}

let map: L.Map | null = null
let clusterGroup: ReturnType<typeof L.markerClusterGroup> | null = null
let allMarkers: { marker: L.Marker; landmark: Landmark }[] = []

const CONTINENT_COLORS: Record<ContinentKey, string> = {
  'asia': '#C4A872',
  'europe': '#4D7E7A',
  'africa': '#A67C52',
  'south-america': '#7A9E7E',
  'north-america': '#8B6F47',
  'oceania': '#6B8FA3',
}

function createIcon(continent: ContinentKey): L.DivIcon {
  const color = CONTINENT_COLORS[continent]
  return L.divIcon({
    className: 'gj-marker',
    html: `<div style="background:${color};width:12px;height:12px;border-radius:50%;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.3)"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  })
}

export function initMap(): void {
  const toggle = $('mapToggle')
  toggle.addEventListener('click', () => {
    const container = $('mapSection')
    const isVisible = container.classList.toggle('show')
    toggle.classList.toggle('active', isVisible)
    if (isVisible && !map) {
      setTimeout(buildMap, 50)
    }
    if (isVisible && map) {
      map.invalidateSize()
    }
  })
}

export function filterMapByContinent(continent: string): void {
  if (!map || !clusterGroup) return
  clusterGroup.clearLayers()
  const filtered = continent === 'all'
    ? allMarkers
    : allMarkers.filter(m => m.landmark.continent === continent)
  filtered.forEach(m => clusterGroup!.addLayer(m.marker))
}

function buildMap(): void {
  const container = $('mapContainer')
  map = L.map(container, {
    center: [20, 0],
    zoom: 2,
    minZoom: 2,
    maxZoom: 18,
    zoomControl: true,
    scrollWheelZoom: true,
  })

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(map)

  clusterGroup = L.markerClusterGroup({
    maxClusterRadius: 50,
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    iconCreateFunction(cluster: { getChildCount(): number }) {
      const count = cluster.getChildCount()
      return L.divIcon({
        html: `<div class="gj-cluster">${count}</div>`,
        className: 'gj-cluster-icon',
        iconSize: L.point(36, 36),
      })
    },
  })

  allMarkers = LANDMARKS.map(l => {
    const marker = L.marker([l.lat, l.lng], { icon: createIcon(l.continent) })
    marker.bindPopup(`
      <div class="gj-popup">
        <strong>${escapeHtml(l.nameEn)}</strong>
        <div class="gj-popup-zh">${escapeHtml(l.nameZh)}</div>
        <div class="gj-popup-loc">${escapeHtml(l.city)}${l.country ? ', ' + escapeHtml(l.country) : ''}</div>
        <button class="gj-popup-btn" data-goto="${l.id}">View Prompt</button>
      </div>
    `, { maxWidth: 250 })
    clusterGroup!.addLayer(marker)
    return { marker, landmark: l }
  })

  map.addLayer(clusterGroup)

  map.getContainer().addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest('.gj-popup-btn') as HTMLElement | null
    if (btn) {
      const id = btn.dataset.goto
      const card = document.querySelector(`.card[data-id="${id}"]`) as HTMLElement | null
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' })
        card.classList.add('open')
      }
    }
  })
}
