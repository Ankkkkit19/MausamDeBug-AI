import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useAppStore } from '../store/appStore'
import { StatusBadge, SeverityBadge } from './ui'

// Fix leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const EVENT_COLORS = {
    rainfall: '#3b82f6', flood: '#06b6d4', thunderstorm: '#8b5cf6',
    heatwave: '#f97316', fog: '#475569', dust_storm: '#d97706',
    strong_wind: '#10b981', hailstorm: '#60a5fa', landslide: '#a16207', cyclone: '#ef4444',
}

const EVENT_ICONS = {
    rainfall: '🌧', flood: '🌊', thunderstorm: '⛈', heatwave: '🌡',
    fog: '🌫', dust_storm: '💨', strong_wind: '🌬', hailstorm: '🌨',
    landslide: '⛰', cyclone: '🌀',
}

function createCustomIcon(eventType, severity) {
    const color = EVENT_COLORS[eventType] || '#475569'
    const icon = EVENT_ICONS[eventType] || '📍'
    const severitySize = { LOW: 28, MODERATE: 32, HIGH: 36, SEVERE: 40, EXTREME: 44 }
    const size = severitySize[severity] || 32

    return L.divIcon({
        html: `<div style="
      width:${size}px; height:${size}px; border-radius:50%;
      background:${color}33; border:2px solid ${color};
      display:flex; align-items:center; justify-content:center;
      font-size:${size * 0.45}px;
      box-shadow:0 0 12px ${color}66;
      cursor:pointer;
      transition: transform 0.2s;
    ">${icon}</div>`,
        className: '',
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        popupAnchor: [0, -size / 2],
    })
}

function MapUpdater({ center }) {
    const map = useMap()
    useEffect(() => {
        if (center) map.setView(center, 6, { animate: true })
    }, [center, map])
    return null
}

export default function IndiaMap({ events, center, onEventClick, height = '100%' }) {
    const { filters } = useAppStore()

    const filtered = (events || []).filter(ev => {
        if (filters.eventType !== 'all' && ev.event_type !== filters.eventType) return false
        if (filters.status !== 'all' && ev.status !== filters.status) return false
        return true
    })

    return (
        <MapContainer
            center={center || [20.5937, 78.9629]}
            zoom={5}
            style={{ height, width: '100%', borderRadius: 0 }}
            zoomControl={true}
            attributionControl={false}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
            />
            {center && <MapUpdater center={center} />}

            {filtered.map(event => (
                <Marker
                    key={event.id}
                    position={[event.latitude, event.longitude]}
                    icon={createCustomIcon(event.event_type, event.severity)}
                    eventHandlers={{
                        click: () => onEventClick && onEventClick(event),
                    }}
                >
                    <Popup>
                        <div style={{ minWidth: 220, fontFamily: 'Inter, sans-serif' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                                <span style={{ fontSize: 20 }}>{EVENT_ICONS[event.event_type]}</span>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a', textTransform: 'capitalize' }}>
                                        {event.event_type.replace('_', ' ')}
                                    </div>
                                    <div style={{ fontSize: 11, color: '#475569' }}>{event.location}</div>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px', fontSize: 12 }}>
                                <div style={{ color: '#64748b' }}>Reports</div>
                                <div style={{ color: '#0f172a', fontWeight: 600 }}>{event.report_count}</div>
                                <div style={{ color: '#64748b' }}>Sources</div>
                                <div style={{ color: '#0f172a', fontWeight: 600 }}>{event.source_count}</div>
                                <div style={{ color: '#64748b' }}>Credibility</div>
                                <div style={{ color: event.confidence >= 75 ? '#10b981' : '#f59e0b', fontWeight: 600 }}>{event.confidence}%</div>
                                <div style={{ color: '#64748b' }}>Severity</div>
                                <div>
                                    <SeverityBadge severity={event.severity} />
                                </div>
                                <div style={{ color: '#64748b' }}>Status</div>
                                <div>
                                    <StatusBadge status={event.status} />
                                </div>
                            </div>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    )
}
