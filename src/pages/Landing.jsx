import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/appStore'
import IndiaMap from '../components/IndiaMap'
import { Search, Map as MapIcon, Bell, ArrowRight, ShieldCheck, Thermometer, Wind, AlertTriangle } from 'lucide-react'

export default function Landing() {
    const navigate = useNavigate()
    const { events } = useAppStore()

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Nav */}
            <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 60px', background: '#f8fafc', zIndex: 100 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, boxShadow: '0 4px 14px rgba(59,130,246,0.3)' }}>🌬️</div>
                    <div style={{ fontWeight: 800, fontSize: 18, color: '#0f172a' }}>VayuNetra</div>
                </div>

                <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: 32, fontSize: 14, fontWeight: 500, color: '#475569' }}>
                        <span style={navLink}>Home</span>
                        <span style={navLink} onClick={() => navigate('/map')}>Live Map</span>
                        <span style={navLink} onClick={() => navigate('/events')}>Features</span>
                        <span style={navLink} onClick={() => navigate('/reports')}>Alerts</span>
                        <span style={navLink} onClick={() => navigate('/about')}>About</span>
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <button onClick={() => navigate('/login')} style={loginBtn}>Login</button>
                        <button onClick={() => navigate('/dashboard')} style={primaryBtn}>Sign Up</button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '40px 60px 80px', maxWidth: 1400, margin: '0 auto', width: '100%' }}>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center', flex: 1 }}>

                    {/* Left Copy */}
                    <div style={{ paddingRight: 40 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#3b82f6', letterSpacing: '0.08em', marginBottom: 20 }}>
                            REAL-TIME WEATHER INTELLIGENCE
                        </div>
                        <h1 style={{ fontSize: 56, fontWeight: 900, color: '#0f172a', margin: '0 0 24px', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                            A Clearer Sky <br />
                            for a <span style={{ color: '#3b82f6' }}>Safer India</span>
                        </h1>
                        <p style={{ fontSize: 18, color: '#475569', lineHeight: 1.6, marginBottom: 40, maxWidth: 500 }}>
                            VayuNetra integrates satellite, ground, and citizen data with AI verification to deliver reliable weather insights and early alerts for a better tomorrow.
                        </p>

                        <div style={{ display: 'flex', gap: 16 }}>
                            <button onClick={() => navigate('/dashboard')} style={heroPrimaryBtn}>
                                Explore Live Map
                            </button>
                            <button onClick={() => navigate('/about')} style={heroSecondaryBtn}>
                                Learn More
                            </button>
                        </div>
                    </div>

                    {/* Right Map Widget (Inspired by Design 4) */}
                    <div style={{
                        background: '#0f172a',
                        borderRadius: 24,
                        overflow: 'hidden',
                        boxShadow: '0 25px 50px -12px rgba(59,130,246,0.25)',
                        position: 'relative',
                        height: 500,
                        border: '8px solid #ffffff'
                    }}>
                        {/* Fake Map UI Overlays */}
                        <div style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.9)', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, color: '#0f172a', zIndex: 400, display: 'flex', alignItems: 'center', gap: 8, backdropFilter: 'blur(4px)' }}>
                            Live Weather Map <ArrowRight size={14} />
                        </div>

                        {/* Fake Sidebar in Map */}
                        <div style={{ position: 'absolute', top: 20, left: 20, background: '#ffffff', borderRadius: 12, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 16, zIndex: 400, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                            <div style={mapIconBtn}><MapIcon size={18} color="#3b82f6" /></div>
                            <div style={mapIconBtn}><Search size={18} color="#94a3b8" /></div>
                            <div style={mapIconBtn}><ShieldCheck size={18} color="#94a3b8" /></div>
                            <div style={mapIconBtn}><Bell size={18} color="#94a3b8" /></div>
                        </div>

                        {/* Bottom Legend in Map */}
                        <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', background: '#ffffff', borderRadius: 12, padding: '12px 24px', display: 'flex', gap: 24, zIndex: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', whiteSpace: 'nowrap' }}>
                            <span style={legendItem}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6' }} /> Rain</span>
                            <span style={legendItem}><Thermometer size={14} color="#f59e0b" /> Temperature</span>
                            <span style={legendItem}><Wind size={14} color="#10b981" /> Wind</span>
                            <span style={legendItem}><AlertTriangle size={14} color="#ef4444" /> Alerts</span>
                        </div>

                        <div style={{ width: '100%', height: '100%', filter: 'grayscale(0.4) contrast(1.1) brightness(0.9)', opacity: 0.9 }}>
                            <IndiaMap events={events} height="100%" />
                        </div>
                    </div>
                </div>

                {/* Bottom Value Props */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginTop: 80 }}>
                    <div style={featureCard}>
                        <div style={{ ...featureIcon, background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}><Search size={24} /></div>
                        <div>
                            <div style={featureTitle}>Verify</div>
                            <div style={featureDesc}>Check the authenticity<br />of weather reports</div>
                        </div>
                    </div>

                    <div style={featureCard}>
                        <div style={{ ...featureIcon, background: 'rgba(16,185,129,0.1)', color: '#10b981' }}><ShieldCheck size={24} /></div>
                        <div>
                            <div style={featureTitle}>Explore</div>
                            <div style={featureDesc}>Interactive weather<br />maps & insights</div>
                        </div>
                    </div>

                    <div style={featureCard}>
                        <div style={{ ...featureIcon, background: 'rgba(139,92,246,0.1)', color: '#8b5cf6' }}><Bell size={24} /></div>
                        <div>
                            <div style={featureTitle}>Stay Alert</div>
                            <div style={featureDesc}>Get early warnings<br />for your area</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const navLink = { cursor: 'pointer', transition: 'color 0.2s' }
const loginBtn = { padding: '8px 20px', borderRadius: 8, border: '1px solid #cbd5e1', background: 'transparent', color: '#0f172a', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }
const primaryBtn = { padding: '8px 20px', borderRadius: 8, border: 'none', background: '#0f172a', color: '#ffffff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }

const heroPrimaryBtn = { padding: '14px 32px', borderRadius: 12, border: 'none', background: '#0f172a', color: '#ffffff', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', boxShadow: '0 4px 14px rgba(15,23,42,0.2)' }
const heroSecondaryBtn = { padding: '14px 32px', borderRadius: 12, border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }

const mapIconBtn = { width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: 8, transition: 'background 0.2s' }
const legendItem = { display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: '#475569' }

const featureCard = { background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '24px', display: 'flex', alignItems: 'center', gap: 20, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }
const featureIcon = { width: 56, height: 56, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }
const featureTitle = { fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 4 }
const featureDesc = { fontSize: 13, color: '#64748b', lineHeight: 1.5 }
