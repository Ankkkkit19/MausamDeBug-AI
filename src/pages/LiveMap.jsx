import { useAppStore } from '../store/appStore'
import { FilterBar, PageHeader } from '../components/ui'
import IndiaMap from '../components/IndiaMap'
import { useNavigate } from 'react-router-dom'

export default function LiveMap() {
    const navigate = useNavigate()
    const { events, filters, setFilter, setSelectedEvent } = useAppStore()
    const filtered = events.filter(ev => {
        if (filters.eventType !== 'all' && ev.event_type !== filters.eventType) return false
        if (filters.status !== 'all' && ev.status !== filters.status) return false
        return true
    })

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Toolbar */}
            <div style={{ padding: '12px 20px', background: '#f1f5f9', borderBottom: '1px solid rgba(0,0,0,0.08)', display: 'flex', gap: 12, alignItems: 'center', flexShrink: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>India Live Weather Map</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>{filtered.length} events</div>
                <FilterBar filters={filters} onFilterChange={setFilter} />
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {[
                        { label: '🌧 Rainfall', color: '#3b82f6' }, { label: '🌊 Flood', color: '#06b6d4' },
                        { label: '⛈ Storm', color: '#8b5cf6' }, { label: '🌡 Heat', color: '#f97316' },
                        { label: '🌫 Fog', color: '#475569' }, { label: '💨 Dust', color: '#d97706' },
                    ].map(l => (
                        <span key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#475569' }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.color }} />
                            {l.label}
                        </span>
                    ))}
                </div>
            </div>

            {/* Full-screen map */}
            <div style={{ flex: 1, position: 'relative' }}>
                <IndiaMap
                    events={filtered}
                    height="100%"
                    onEventClick={(ev) => {
                        setSelectedEvent(ev)
                        navigate(`/events/${ev.id}`)
                    }}
                />
                {/* Stats overlay */}
                <div style={{
                    position: 'absolute', top: 16, right: 16, background: 'rgba(10,22,40,0.9)',
                    border: '1px solid rgba(0,0,0,0.1)', borderRadius: 10, padding: '12px 16px',
                    backdropFilter: 'blur(8px)', zIndex: 1000,
                }}>
                    <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Live Statistics</div>
                    {[
                        { label: 'Events', value: filtered.length, color: '#3b82f6' },
                        { label: 'Verified', value: filtered.filter(e => e.status === 'verified').length, color: '#10b981' },
                        { label: 'Active', value: filtered.filter(e => e.status === 'active').length, color: '#f59e0b' },
                    ].map(s => (
                        <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 20, marginBottom: 4 }}>
                            <span style={{ fontSize: 12, color: '#475569' }}>{s.label}</span>
                            <span style={{ fontSize: 12, fontWeight: 700, color: s.color }}>{s.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
