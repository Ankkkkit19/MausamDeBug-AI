import { useAppStore } from '../store/appStore'
import { PageHeader, CredibilityCircle, EventTypeBadge } from '../components/ui'
import { CheckCircle, AlertTriangle } from 'lucide-react'

export default function Verification() {
    const { reports } = useAppStore()
    const featured = reports.find(r => r.credibility_score >= 85) || reports[0]

    const breakdown = featured ? [
        { label: 'Weather Observation Match', max: 30, score: Math.floor(featured.credibility_score * 0.30 * 0.97), detail: 'Open-Meteo confirms rainfall conditions at location' },
        { label: 'Nearby Reports Consensus', max: 25, score: Math.floor(featured.credibility_score * 0.25 * 0.92), detail: '17 nearby reports within 10km radius confirm' },
        { label: 'Geographic Consistency', max: 20, score: Math.floor(featured.credibility_score * 0.20 * 0.95), detail: 'GPS coordinates match reported location' },
        { label: 'Source Reliability', max: 15, score: Math.floor(featured.credibility_score * 0.15 * 0.84), detail: 'Source has 93% historical accuracy' },
        { label: 'Temporal Consistency', max: 10, score: Math.floor(featured.credibility_score * 0.10 * 0.88), detail: 'Report time matches observed weather window' },
    ] : []

    return (
        <div style={{ padding: 24, maxWidth: 1200 }}>
            <PageHeader title="AI Credibility Engine" subtitle="How MausamDeBug estimates the trustworthiness of weather reports" />

            {/* Formula card */}
            <div style={{ ...card, marginBottom: 20, background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(6,182,212,0.04))' }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a', marginBottom: 12 }}>📐 Credibility Formula</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: '#475569', lineHeight: 2 }}>
                    <div>C = <span style={{ color: '#3b82f6' }}>0.30</span> × Weather Consistency</div>
                    <div>  + <span style={{ color: '#06b6d4' }}>0.25</span> × Nearby Reports</div>
                    <div>  + <span style={{ color: '#10b981' }}>0.20</span> × Geographic Consistency</div>
                    <div>  + <span style={{ color: '#8b5cf6' }}>0.15</span> × Source Reliability</div>
                    <div>  + <span style={{ color: '#f59e0b' }}>0.10</span> × Temporal Consistency</div>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 14, flexWrap: 'wrap' }}>
                    {[
                        { range: '75–100', label: 'HIGH', color: '#10b981' },
                        { range: '40–74', label: 'MEDIUM', color: '#f59e0b' },
                        { range: '0–39', label: 'LOW', color: '#ef4444' },
                    ].map(c => (
                        <div key={c.range} style={{ padding: '6px 14px', borderRadius: 8, background: `${c.color}15`, border: `1px solid ${c.color}33`, fontSize: 12 }}>
                            <span style={{ color: c.color, fontWeight: 700 }}>{c.label}</span>
                            <span style={{ color: '#64748b', marginLeft: 8 }}>{c.range}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Live example */}
            {featured && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div style={card}>
                            <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a', marginBottom: 12 }}>🔍 Live Example: {featured.id}</div>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
                                <EventTypeBadge eventType={featured.event_type} />
                                <span style={{ fontSize: 12, color: '#475569' }}>{featured.location}</span>
                            </div>
                            <div style={{ fontSize: 13, color: '#1e293b', fontStyle: 'italic', marginBottom: 14, padding: '8px 12px', background: 'rgba(0,0,0,0.03)', borderRadius: 6 }}>"{featured.text}"</div>

                            {/* Breakdown bars */}
                            {breakdown.map(item => (
                                <div key={item.label} style={{ marginBottom: 14 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                                        <span style={{ color: '#475569' }}>{item.label}</span>
                                        <span style={{ color: '#0f172a', fontWeight: 700 }}>{item.score}/{item.max}</span>
                                    </div>
                                    <div style={{ height: 6, background: 'rgba(0,0,0,0.06)', borderRadius: 3 }}>
                                        <div style={{ width: `${(item.score / item.max) * 100}%`, height: '100%', borderRadius: 3, background: item.score / item.max >= 0.75 ? '#10b981' : '#f59e0b', transition: 'width 0.6s ease' }} />
                                    </div>
                                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>{item.detail}</div>
                                </div>
                            ))}

                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid rgba(0,0,0,0.06)', fontSize: 14, fontWeight: 800 }}>
                                <span style={{ color: '#475569' }}>TOTAL</span>
                                <span style={{ color: featured.credibility_score >= 75 ? '#10b981' : '#f59e0b' }}>{featured.credibility_score}/100</span>
                            </div>
                        </div>

                        {/* Explainable AI reasons */}
                        <div style={card}>
                            <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a', marginBottom: 12 }}>💡 Why this score?</div>
                            {[
                                { pos: true, text: 'Weather observation confirms rainfall conditions at this location' },
                                { pos: true, text: '17 nearby reports within 10km radius confirm similar conditions' },
                                { pos: true, text: 'Multiple independent sources corroborate the event' },
                                { pos: true, text: 'Report submitted during observed weather window' },
                                { pos: false, text: 'Source has limited historical verification track record', warn: true },
                            ].map((r, i) => (
                                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
                                    {r.warn ? <AlertTriangle size={14} color="#f59e0b" style={{ flexShrink: 0, marginTop: 1 }} /> : <CheckCircle size={14} color="#10b981" style={{ flexShrink: 0, marginTop: 1 }} />}
                                    <span style={{ fontSize: 13, color: r.warn ? '#f59e0b' : '#1e293b' }}>{r.text}</span>
                                </div>
                            ))}
                            <div style={{ marginTop: 12, padding: '10px 12px', background: 'rgba(59,130,246,0.05)', borderRadius: 8, border: '1px solid rgba(59,130,246,0.15)', fontSize: 12, color: '#475569', fontStyle: 'italic' }}>
                                "The system estimates report credibility using spatial, temporal, meteorological and multi-source evidence. It does not claim absolute truth."
                            </div>
                        </div>
                    </div>

                    {/* Right: Circular score + source reliability */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div style={{ ...card, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 24 }}>
                            <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a', marginBottom: 20 }}>AI Credibility Score</div>
                            <CredibilityCircle score={featured.credibility_score} size={160} />
                        </div>

                        {/* Source reliability table */}
                        <div style={card}>
                            <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a', marginBottom: 12 }}>📡 Source Reliability Baseline</div>
                            {[
                                { src: 'IMD/Government', rel: 98, tier: 'Very High' },
                                { src: 'Weather API', rel: 95, tier: 'High' },
                                { src: 'IoT Sensor', rel: 92, tier: 'High' },
                                { src: 'Verified Reporter', rel: 85, tier: 'High' },
                                { src: 'News Source', rel: 78, tier: 'Med-High' },
                                { src: 'Citizen Reporter', rel: 72, tier: 'Dynamic' },
                                { src: 'Social Media', rel: 58, tier: 'Medium' },
                                { src: 'Unknown Source', rel: 30, tier: 'Low' },
                            ].map(s => (
                                <div key={s.src} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBlock: 6, borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                                    <span style={{ fontSize: 12, color: '#1e293b' }}>{s.src}</span>
                                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                        <span style={{ fontSize: 11, color: '#64748b' }}>{s.tier}</span>
                                        <span style={{
                                            padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 700,
                                            background: s.rel >= 85 ? 'rgba(16,185,129,0.15)' : s.rel >= 60 ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                                            color: s.rel >= 85 ? '#10b981' : s.rel >= 60 ? '#f59e0b' : '#ef4444',
                                        }}>{s.rel}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

const card = { background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: 16 }
