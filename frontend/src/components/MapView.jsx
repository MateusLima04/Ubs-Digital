import { useEffect, useRef } from 'react'
import L from 'leaflet'
import { maplibreGL } from '@maplibre/maplibre-gl-leaflet'
import { setWorkerUrl } from 'maplibre-gl'
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'
import 'leaflet/dist/leaflet.css'
import 'maplibre-gl/dist/maplibre-gl.css'

const RECIFE = [-8.0631, -34.91]
setWorkerUrl(workerUrl)
export default function MapView({ unidades, location, selected, onSelect }) {
  const container = useRef(null)
  const map = useRef(null)
  const markers = useRef(null)
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect
  useEffect(() => {
    if (!container.current || map.current) return
    map.current = L.map(container.current, { zoomControl: false, attributionControl: false }).setView(RECIFE, 12)
    maplibreGL({ style: 'https://tiles.openfreemap.org/styles/liberty' }).addTo(map.current)
    L.control.zoom({ position: 'bottomright' }).addTo(map.current)
    markers.current = L.layerGroup().addTo(map.current)
    return () => { map.current?.remove(); map.current = null }
  }, [])
  useEffect(() => {
    if (!markers.current) return
    markers.current.clearLayers()
    unidades.forEach(unidade => {
      const active = selected?.id === unidade.id
      const icon = L.divIcon({ className: 'custom-map-icon', html: `<span class="map-pin ${active ? 'active' : ''}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7z" fill="currentColor"/></svg></span>`, iconSize: [38, 44], iconAnchor: [19, 42] })
      L.marker([Number(unidade.latitude), Number(unidade.longitude)], { icon, title: unidade.nome }).addTo(markers.current).on('click', () => onSelectRef.current(unidade))
    })
    if (location) {
      L.circleMarker([location.latitude, location.longitude], { radius: 9, color: '#fff', weight: 3, fillColor: '#1773db', fillOpacity: 1 }).addTo(markers.current).bindTooltip('Sua localização')
    }
    if (!location && !selected && unidades.length) {
      map.current.fitBounds(unidades.map(unidade => [Number(unidade.latitude), Number(unidade.longitude)]), { padding: [35, 35], maxZoom: 12 })
    }
  }, [unidades, location, selected])
  useEffect(() => { if (location && map.current) map.current.flyTo([location.latitude, location.longitude], 13) }, [location])
  useEffect(() => { if (selected && map.current) map.current.flyTo([Number(selected.latitude), Number(selected.longitude)], 14) }, [selected])
  return <div className="map-frame"><div ref={container} className="map-canvas" role="application" aria-label="Mapa das unidades de saúde do Recife" /><div className="map-overlay"><span className="map-live-dot"/> Explorando Recife, PE</div></div>
}
