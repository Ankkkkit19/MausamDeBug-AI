import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/appStore'
import { Bell, Search, MapPin, Wind, Droplets, Thermometer, AlertTriangle, CheckCircle, Navigation, ArrowRight, CloudRain, Cloud, Sun } from 'lucide-react'
import { MOCK_NEWS_ARTICLES, formatRelativeTime } from '../services/newsService'
import { EventTypeBadge } from '../components/ui'
import IndiaMap from '../components/IndiaMap'

const FORECAST_HOURLY = [
    { time: 'Now', temp: 18, icon: <CloudRain size={24} color="#3b82f6" fill="#3b82f6" /> },
    { time: '11 AM', temp: 19, icon: <Cloud size={24} color="#94a3b8" fill="#cbd5e1" /> },
    { time: '2 PM', temp: 22, icon: <Cloud size={24} color="#94a3b8" fill="#cbd5e1" /> },
    { time: '5 PM', temp: 21, icon: <Sun size={24} color="#f59e0b" fill="#fcd34d" /> },
    { time: '8 PM', temp: 19, icon: <Cloud size={24} color="#94a3b8" fill="#cbd5e1" /> },
]

const FORECAST_7DAY = [
    { day: 'Mon', high: 22, low: 14, icon: <CloudRain size={20} color="#3b82f6" fill="#3b82f6" /> },
    { day: 'Tue', high: 24, low: 15, icon: <Sun size={20} color="#f59e0b" fill="#fcd34d" /> },
    { day: 'Wed', high: 23, low: 14, icon: <Cloud size={20} color="#94a3b8" fill="#cbd5e1" /> },
    { day: 'Thu', high: 21, low: 13, icon: <Cloud size={20} color="#94a3b8" fill="#cbd5e1" /> },
    { day: 'Fri', high: 20, low: 12, icon: <Cloud size={20} color="#94a3b8" fill="#cbd5e1" /> },
    { day: 'Sat', high: 19, low: 12, icon: <Cloud size={20} color="#94a3b8" fill="#cbd5e1" /> },
    { day: 'Sun', high: 21, low: 13, icon: <Cloud size={20} color="#94a3b8" fill="#cbd5e1" /> },
]

const ALERTS = [
    { title: 'Heavy Rainfall Alert', location: 'Dehradun, Uttarakhand', validTill: 'Valid till 8:00 PM', severity: 'High', color: '#ef4444', bg: '#fee2e2' },
    { title: 'Possible Landslide Risk', location: 'Chamoli, Uttarakhand', validTill: 'Valid till 11:59 PM', severity: 'Moderate', color: '#f59e0b', bg: '#fef3c7' },
]

export default function Home() {
    const navigate = useNavigate()
    const { reports, events } = useAppStore()
    const latestNews = MOCK_NEWS_ARTICLES.slice(0, 3)
    const recentReports = reports.slice(0, 3)

    return (
        <div style={{ padding: 24, maxWidth: 1600, margin: '0 auto', background: '#f8fafc', minHeight: '100vh' }}>
            {/* Top Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                <div style={{ position: 'relative', width: 400 }}>
                    <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                    <input
                        type="text" placeholder="Search city, state, event, or keyword..."
                        style={{
                            width: '100%', padding: '10px 14px 10px 40px', background: '#e2e8f0',
                            border: 'none', borderRadius: 8, fontSize: 13, color: '#0f172a', outline: 'none'
                        }}
                    />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#475569', fontWeight: 600 }}>
                        <MapPin size={16} /> Dehradun, Uttarakhand
                    </div>
                    <div style={{ position: 'relative', cursor: 'pointer' }}>
                        <Bell size={20} color="#475569" />
                        <div style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, background: '#ef4444', borderRadius: '50%', border: '2px solid #f8fafc' }} />
                    </div>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#334155', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>
                        A
                    </div>
                </div>
            </div>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', margin: '0 0 4px', display: 'flex', gap: 10, alignItems: 'center' }}>
                        Good Morning, Ananya 👋
                    </h1>
                    <p style={{ fontSize: 15, color: '#64748b', margin: 0 }}>Here's your weather and safety update for today</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, marginBottom: 4 }}>
                        Monday, 17 Nov 2025
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700 }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} /> System Live
                        </span>
                    </div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }}>10:24 AM</div>
                </div>
            </div>

            {/* Top Row: Weather + Forecasts */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) 2fr 2fr', gap: 20, marginBottom: 20 }}>
                {/* Main Weather Card */}
                <div style={{ background: 'linear-gradient(135deg, #1e40af, #3b82f6)', borderRadius: 16, padding: '24px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600 }}>Dehradun, Uttarakhand <Navigation size={12} /></div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div>
                            <div style={{ fontSize: 56, fontWeight: 800, lineHeight: 1 }}>18°c</div>
                            <div style={{ fontSize: 16, fontWeight: 500, marginTop: 8 }}>Light Rain</div>
                        </div>
                        <CloudRain size={64} color="#fff" fill="rgba(255,255,255,0.7)" />
                    </div>
                    <div style={{ display: 'flex', gap: 16, marginTop: 24, fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>
                        <span>Feels like 17°C</span>
                        <span>|</span>
                        <span>Humidity 82%</span>
                        <span>|</span>
                        <span>Wind 12 km/h</span>
                    </div>
                </div>

                {/* Today's Forecast */}
                <div style={card}>
                    <h3 style={cardTitle}>Today's Forecast</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12 }}>
                        {FORECAST_HOURLY.map((f, i) => (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                                <div style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>{f.time}</div>
                                <div>{f.icon}</div>
                                <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>{f.temp}°</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 7 Day Forecast */}
                <div style={card}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <h3 style={cardTitle}>7 Day Forecast</h3>
                        <a href="#" style={{ fontSize: 12, color: '#3b82f6', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>View Details <ArrowRight size={12} /></a>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        {FORECAST_7DAY.map((f, i) => (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                                <div style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>{f.day}</div>
                                <div>{f.icon}</div>
                                <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{f.high}°</div>
                                <div style={{ fontSize: 11, color: '#94a3b8' }}>{f.low}°</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Middle Row: Highlights + Map + Alerts */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) 2fr 1.5fr', gap: 20, marginBottom: 20 }}>
                {/* Highlights */}
                <div style={card}>
                    <h3 style={cardTitle}>Today's Highlights</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <HighlightCard icon={<Droplets size={20} color="#3b82f6" />} title="Rainfall (Today)" value="12 mm" sub="↑ 20% from yesterday" subColor="#10b981" />
                        <HighlightCard icon={<Thermometer size={20} color="#ef4444" />} title="Temperature" value="18°C" sub="Min 14° / Max 22°" />
                        <HighlightCard icon={<Wind size={20} color="#06b6d4" />} title="Wind Speed" value="12 km/h" sub="From NW" />
                        <HighlightCard icon={<Droplets size={20} color="#3b82f6" />} title="Humidity" value="82%" sub="Comfortable" subColor="#10b981" />
                    </div>
                </div>

                {/* Weather Risk Map */}
                <div style={{ ...card, padding: 0, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '20px 20px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0f172a' }}>Weather Risk Map <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>(Uttarakhand)</span></h3>
                        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/map') }} style={{ fontSize: 12, color: '#3b82f6', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>View Full Map <ArrowRight size={12} /></a>
                    </div>
                    <div style={{ flex: 1, position: 'relative', minHeight: 200, background: '#e2e8f0', borderRadius: '0 0 16px 16px', overflow: 'hidden' }}>
                        <IndiaMap events={events.filter(e => e.state?.includes('Uttarakhand') || e.city === 'Dehradun')} />
                    </div>
                </div>

                {/* Active Alerts */}
                <div style={card}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <h3 style={cardTitle}>Active Alerts</h3>
                        <a href="#" style={{ fontSize: 12, color: '#3b82f6', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>View All <ArrowRight size={12} /></a>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {ALERTS.map((alert, i) => (
                            <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: 16, background: alert.bg, border: `1px solid ${alert.color}33`, borderRadius: 12 }}>
                                <AlertTriangle size={24} color={alert.color} style={{ flexShrink: 0 }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>{alert.title}</div>
                                    <div style={{ fontSize: 12, color: '#475569', marginBottom: 4 }}>{alert.location}</div>
                                    <div style={{ fontSize: 11, color: '#64748b' }}>{alert.validTill}</div>
                                </div>
                                <div style={{ background: alert.color, color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999 }}>
                                    {alert.severity}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Row: News + Citizen Reports */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(600px, 2fr) 1fr', gap: 20, paddingBottom: 40 }}>
                {/* News */}
                <div style={card}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <h3 style={cardTitle}>Latest Weather News</h3>
                        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/live-news') }} style={{ fontSize: 12, color: '#3b82f6', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>View All <ArrowRight size={12} /></a>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                        {latestNews.map(news => (
                            <div key={news.id} style={{ display: 'flex', flexDirection: 'column', gap: 10, cursor: 'pointer' }} onClick={() => navigate('/live-news')}>
                                <div style={{ height: 120, borderRadius: 12, background: `url(${news.image}) center/cover` }} />
                                <div>
                                    <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: '0 0 6px', lineHeight: 1.4 }}>{news.title}</h4>
                                    <div style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
                                        {news.source} · {formatRelativeTime(news.publishedAt)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Citizen Reports */}
                <div style={card}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <h3 style={cardTitle}>Recent Citizen Reports</h3>
                        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/reports') }} style={{ fontSize: 12, color: '#3b82f6', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>View All <ArrowRight size={12} /></a>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {recentReports.map(rp => (
                            <div key={rp.id} onClick={() => navigate(`/reports/${rp.id}`)} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px', borderRadius: 12, border: '1px solid rgba(0,0,0,0.05)', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                {rp.has_image ? (
                                    <div style={{ width: 64, height: 48, borderRadius: 8, background: `url(https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=200&q=80) center/cover` }} />
                                ) : (
                                    <div style={{ width: 64, height: 48, borderRadius: 8, background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{rp.event_type === 'rainfall' ? '🌧' : '🌊'}</div>
                                )}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{rp.text}</h4>
                                    <div style={{ fontSize: 11, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <MapPin size={10} /> {rp.location} · {rp.minutes_ago} min ago
                                    </div>
                                </div>
                                <div>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: rp.verification_status === 'verified' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: rp.verification_status === 'verified' ? '#10b981' : '#f59e0b', padding: '4px 8px', borderRadius: 999, fontSize: 10, fontWeight: 700 }}>
                                        {rp.verification_status === 'verified' ? <CheckCircle size={10} /> : <AlertTriangle size={10} />}
                                        {rp.verification_status === 'verified' ? 'Verified' : 'Under Review'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

function HighlightCard({ icon, title, value, sub, subColor = '#64748b' }) {
    return (
        <div style={{ background: '#f8fafc', borderRadius: 12, padding: '16px', display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                {icon}
            </div>
            <div>
                <div style={{ fontSize: 12, color: '#475569', fontWeight: 500, marginBottom: 2 }}>{title}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 2 }}>{value}</div>
                <div style={{ fontSize: 11, color: subColor, fontWeight: 500 }}>{sub}</div>
            </div>
        </div>
    )
}

const cardTitle = { margin: '0 0 12px', fontSize: 15, fontWeight: 800, color: '#0f172a' }
const card = { background: '#ffffff', borderRadius: 16, padding: '20px', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }
