import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'

// ─── Animated Counter ──────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = '', prefix = '' }) {
    const [count, setCount] = useState(0)
    const ref = useRef()
    useEffect(() => {
        const observer = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) {
                let start = 0
                const step = target / 60
                const timer = setInterval(() => {
                    start += step
                    if (start >= target) { setCount(target); clearInterval(timer) }
                    else setCount(Math.floor(start))
                }, 16)
                observer.disconnect()
            }
        }, { threshold: 0.5 })
        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [target])
    return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>
}

// ─── Testimonials Data ─────────────────────────────────────────────────────────
const testimonials = [
    { name: 'Riya Sharma', loc: 'Delhi', text: '"VayuNetra AI gives me accurate forecasts and alerts. It\'s now a part of my daily routine!"', stars: 5, avatar: '👩' },
    { name: 'Arjun Verma', loc: 'Mumbai', text: '"The AI assistant is amazing! It feels like having a personal meteorologist in my pocket."', stars: 5, avatar: '👨' },
    { name: 'Neha Singh', loc: 'Noida', text: '"Timely alerts kept me stay prepared during unexpected weather changes. Highly recommended."', stars: 5, avatar: '👩‍💼' },
]

// ─── App Screenshots Data ──────────────────────────────────────────────────────
const screens = [
    { label: 'Home Dashboard', sub: 'All key weather info', bg: 'linear-gradient(135deg,#1a1a2e 0%,#16213e 100%)', icon: '🏠' },
    { label: 'Hourly & Daily Forecast', sub: 'Plan your day with confidence', bg: 'linear-gradient(135deg,#0f3460 0%,#533483 100%)', icon: '📊' },
    { label: 'Weather Map', sub: 'Real-time layers and radar view', bg: 'linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)', icon: '🗺️' },
    { label: 'Weather Events', sub: 'Stay updated with instant alerts', bg: 'linear-gradient(135deg,#16213e 0%,#1a1a2e 100%)', icon: '⚡' },
    { label: 'AI Assistant', sub: 'Get instant, smart answers', bg: 'linear-gradient(135deg,#0f3460 0%,#1a1a2e 100%)', icon: '🤖' },
]

export default function Landing() {
    const navigate = useNavigate()
    const [activeSlide, setActiveSlide] = useState(0)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => {
        const timer = setInterval(() => setActiveSlide(s => (s + 1) % screens.length), 3000)
        return () => clearInterval(timer)
    }, [])

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", background: '#0a0e1a', color: '#fff', overflowX: 'hidden' }}>

            {/* ── NAVBAR ── */}
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0 60px', height: 64,
                background: scrolled ? 'rgba(10,14,26,0.95)' : 'rgba(10,14,26,0.7)',
                backdropFilter: 'blur(20px)',
                borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent',
                transition: 'all 0.3s ease',
            }}>
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#3b82f6,#06b6d4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                        boxShadow: '0 4px 15px rgba(59,130,246,0.4)',
                    }}>🌬️</div>
                    <span style={{ fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>VayuNetra <span style={{ color: '#3b82f6' }}>AI</span></span>
                </div>

                {/* Nav Links */}
                <div style={{ display: 'flex', gap: 36, fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>
                    {['Home', 'Features', 'Screens', 'About', 'Pricing'].map(item => (
                        <span key={item} onClick={() => item === 'About' && navigate('/about')}
                            style={{ cursor: 'pointer', transition: 'color 0.2s' }}
                            onMouseEnter={e => e.target.style.color = '#fff'}
                            onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.7)'}>
                            {item}
                        </span>
                    ))}
                </div>

                {/* CTA */}
                <button onClick={() => navigate('/dashboard')} style={{
                    padding: '8px 22px', borderRadius: 10, border: 'none', cursor: 'pointer',
                    background: 'linear-gradient(135deg,#3b82f6,#06b6d4)', color: '#fff',
                    fontSize: 13, fontWeight: 700, boxShadow: '0 4px 15px rgba(59,130,246,0.35)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                    onMouseEnter={e => { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 6px 20px rgba(59,130,246,0.5)' }}
                    onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 15px rgba(59,130,246,0.35)' }}
                >
                    Download App
                </button>
            </nav>

            {/* ── HERO ── */}
            <section style={{
                minHeight: '100vh', display: 'flex', alignItems: 'center',
                padding: '100px 60px 80px',
                background: 'linear-gradient(180deg, #0a0e1a 0%, #0d1535 50%, #0a0e1a 100%)',
                position: 'relative', overflow: 'hidden',
            }}>
                {/* BG glows */}
                <div style={{ position: 'absolute', top: '20%', left: '10%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(59,130,246,0.07)', filter: 'blur(80px)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', top: '30%', right: '10%', width: 350, height: 350, borderRadius: '50%', background: 'rgba(6,182,212,0.06)', filter: 'blur(80px)', pointerEvents: 'none' }} />

                <div style={{ maxWidth: 1300, margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
                    {/* Left copy */}
                    <div>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px',
                            borderRadius: 20, background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)',
                            fontSize: 12, fontWeight: 700, color: '#60a5fa', letterSpacing: '0.06em', marginBottom: 24,
                        }}>
                            🤖 AI-Powered Weather Intelligence
                        </div>

                        <h1 style={{ fontSize: 62, fontWeight: 900, lineHeight: 1.08, letterSpacing: '-0.03em', marginBottom: 24, color: '#fff' }}>
                            See the Weather.<br />
                            <span style={{ background: 'linear-gradient(90deg,#3b82f6,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                                Understand
                            </span><br />
                            the Future.
                        </h1>

                        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: 40, maxWidth: 460 }}>
                            VayuNetra AI is your intelligent weather companion, providing real-time conditions, hyper-local forecasts, AI insights, and timely alerts — all in one app.
                        </p>

                        {/* Store Badges */}
                        <div style={{ display: 'flex', gap: 16, marginBottom: 40 }}>
                            <StoreBadge store="google" onClick={() => navigate('/dashboard')} />
                            <StoreBadge store="apple" onClick={() => navigate('/dashboard')} />
                        </div>

                        {/* Trust Row */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <div style={{ display: 'flex' }}>
                                {['👩', '👨', '👩‍💼', '👨‍🔬'].map((a, i) => (
                                    <div key={i} style={{
                                        width: 32, height: 32, borderRadius: '50%', border: '2px solid #0a0e1a',
                                        background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 14, marginLeft: i === 0 ? 0 : -10,
                                    }}>{a}</div>
                                ))}
                            </div>
                            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>
                                Trusted by weather-aware<br />users across India
                            </p>
                        </div>
                    </div>

                    {/* Right: Phone mockups */}
                    <div style={{ position: 'relative', height: 560, display: 'flex', justifyContent: 'center' }}>
                        {/* Main phone */}
                        <PhoneMockup style={{ position: 'absolute', left: '50%', transform: 'translateX(-60%) scale(1.05)', zIndex: 2 }} screen="main" navigate={navigate} />
                        {/* Secondary phone */}
                        <PhoneMockup style={{ position: 'absolute', left: '50%', transform: 'translateX(0%) scale(0.88)', zIndex: 1, opacity: 0.85, top: 40 }} screen="map" navigate={navigate} />
                    </div>
                </div>
            </section>

            {/* ── ICON STRIP ── */}
            <section style={{ background: '#0d1020', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0 }}>
                    {[
                        { icon: '⚡', color: '#f59e0b', title: 'Real-Time Weather', sub: 'Accurate & hyper-local data' },
                        { icon: '🔔', color: '#3b82f6', title: 'Smart Alerts', sub: 'Get notified before it happens' },
                        { icon: '🤖', color: '#06b6d4', title: 'AI Assistant', sub: 'Ask anything about weather' },
                        { icon: '🗺️', color: '#10b981', title: 'Interactive Maps', sub: 'Visualise weather like never before' },
                    ].map((item, i) => (
                        <div key={i} style={{
                            padding: '28px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 10,
                            borderRight: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                        }}>
                            <div style={{
                                width: 52, height: 52, borderRadius: 14, fontSize: 22,
                                background: `${item.color}18`, border: `1px solid ${item.color}30`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>{item.icon}</div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{item.title}</div>
                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>{item.sub}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── SMARTER WAY SECTION ── */}
            <section style={{ padding: '100px 60px', background: '#0a0e1a' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
                    {/* Left copy */}
                    <div>
                        <div style={badgePill}>POWERED BY AI & REAL DATA</div>
                        <h2 style={{ fontSize: 44, fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, margin: '20px 0 24px', color: '#fff' }}>
                            A Smarter Way<br />to Stay Weather-Ready
                        </h2>
                        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: 40 }}>
                            VayuNetra AI combines real-time weather data, advanced AI models, and intelligent alerts to help you make better decisions, every day.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {[
                                { icon: '📍', text: 'Hyper-local forecasts' },
                                { icon: '🤖', text: 'AI-generated weather briefings' },
                                { icon: '🚨', text: 'Severe weather alerts' },
                                { icon: '🗺️', text: 'Interactive weather maps' },
                                { icon: '🌿', text: 'Air quality & environmental data' },
                                { icon: '🔔', text: 'Personalized notifications' },
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                    <span style={{ fontSize: 18 }}>{item.icon}</span>
                                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: AI Chat UI mockup */}
                    <div style={{
                        background: '#111827', borderRadius: 24, padding: 24, boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
                        border: '1px solid rgba(255,255,255,0.07)',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#3b82f6,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🤖</div>
                            <div>
                                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>AI Weather Assistant</div>
                                <div style={{ fontSize: 11, color: '#10b981' }}>● Online</div>
                            </div>
                        </div>
                        <ChatMessage from="bot" text="Will it flood today in Dehradun?" time="10:22 AM" />
                        <ChatMessage from="user" text="Yes, there is a 62% chance of flooding in Dehradun today. AQI is currently at Unhealthy, at 156 pm..." time="10:22 AM" />
                        <ChatMessage from="bot" text="You can also ask:" time="10:23 AM" options={['🌧 Will it rain tonight?', '🌡 What\'s the temperature tomorrow?', '☁ Is it safe to travel today?']} />
                        <div style={{ marginTop: 16, display: 'flex', background: '#1f2937', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)' }}>
                            <input readOnly placeholder="Ask anything about weather..." style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 13, color: 'rgba(255,255,255,0.6)', padding: '12px 16px', fontFamily: 'Inter, sans-serif' }} />
                            <div style={{ width: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'linear-gradient(135deg,#3b82f6,#06b6d4)', margin: 4, borderRadius: 8, fontSize: 16 }}>➤</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FEATURES GRID ── */}
            <section style={{ padding: '100px 60px', background: '#0d1020' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 60 }}>
                        <div style={badgePill}>EXPLORE FEATURES</div>
                        <h2 style={{ fontSize: 44, fontWeight: 900, letterSpacing: '-0.03em', marginTop: 16, color: '#fff' }}>Everything You Need in One App</h2>
                        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', marginTop: 12, maxWidth: 600, margin: '12px auto 0' }}>
                            From real-time weather to AI insights and event alerts — VayuNetra AI keeps you informed and prepared.
                        </p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
                        {[
                            { icon: '🌡️', color: '#3b82f6', title: 'Live Weather Dashboard', sub: 'Get real-time temperature, AQI, wind, AQI and more.' },
                            { icon: '🤖', color: '#06b6d4', title: 'AI Weather Insights', sub: 'Understand the reason behind the weather.' },
                            { icon: '🚨', color: '#ef4444', title: 'Severe Weather Alerts', sub: 'Be the first to know about storms, heatwaves, fog and more.' },
                            { icon: '🗺️', color: '#10b981', title: 'Interactive Weather Maps', sub: 'Explore real-time radar, satellite, rainfall, wind and AQI layers.' },
                            { icon: '📍', color: '#f59e0b', title: 'Multi-Location Support', sub: 'Track weather for your home, work and favourite places.' },
                            { icon: '⚙️', color: '#8b5cf6', title: 'Personalized Notifications', sub: 'Get alerts and daily briefings based on your preferences.' },
                        ].map((f, i) => (
                            <FeatureCard key={i} {...f} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── STATS STRIP ── */}
            <section style={{ padding: '70px 60px', background: 'linear-gradient(135deg,#0f1a3a 0%,#0a1628 100%)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0 }}>
                    {[
                        { value: 50, suffix: 'K+', label: 'Happy Users' },
                        { value: 500, suffix: '+', label: 'Cities Covered' },
                        { value: 99, suffix: '%', label: 'Accuracy Rate' },
                        { value: 24, suffix: '/7', label: 'Live Updates' },
                    ].map((s, i) => (
                        <div key={i} style={{ textAlign: 'center', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.07)' : 'none', padding: '20px 0' }}>
                            <div style={{ fontSize: 40, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>
                                <AnimatedCounter target={s.value} suffix={s.suffix} />
                            </div>
                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 6, fontWeight: 500 }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── APP SCREENSHOTS CAROUSEL ── */}
            <section style={{ padding: '100px 60px', background: '#0a0e1a', overflow: 'hidden' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <h2 style={{ fontSize: 44, fontWeight: 900, letterSpacing: '-0.03em', textAlign: 'center', marginBottom: 12, color: '#fff' }}>
                        Beautiful. Powerful. Built for You.
                    </h2>
                    <p style={{ textAlign: 'center', fontSize: 15, color: 'rgba(255,255,255,0.5)', marginBottom: 60 }}>
                        A seamless and intuitive experience with a modern design, crafted for weather-aware individuals.
                    </p>

                    <div style={{ display: 'flex', gap: 20, justifyContent: 'center', alignItems: 'flex-end', marginBottom: 40 }}>
                        {screens.map((s, i) => (
                            <div key={i} onClick={() => setActiveSlide(i)} style={{
                                width: i === activeSlide ? 180 : 140,
                                height: i === activeSlide ? 320 : 280,
                                borderRadius: 28, background: s.bg,
                                border: i === activeSlide ? '2px solid rgba(59,130,246,0.5)' : '1px solid rgba(255,255,255,0.08)',
                                cursor: 'pointer', transition: 'all 0.4s ease',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                position: 'relative', overflow: 'hidden',
                                boxShadow: i === activeSlide ? '0 20px 50px rgba(59,130,246,0.2)' : 'none',
                            }}>
                                <div style={{ fontSize: 48, marginBottom: 16 }}>{s.icon}</div>
                                {i === activeSlide && (
                                    <div style={{ textAlign: 'center', padding: '0 12px' }}>
                                        <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{s.label}</div>
                                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>{s.sub}</div>
                                    </div>
                                )}
                                {/* notch */}
                                <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', width: 40, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.15)' }} />
                            </div>
                        ))}
                    </div>

                    {/* Screen Labels */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 16 }}>
                        {screens.map((s, i) => (
                            <div key={i} style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 12, fontWeight: 700, color: i === activeSlide ? '#60a5fa' : 'rgba(255,255,255,0.5)', marginBottom: 4, transition: 'color 0.3s' }}>{s.label}</div>
                                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{s.sub}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── TESTIMONIALS ── */}
            <section style={{ padding: '100px 60px', background: '#0d1020' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 60 }}>
                        <div style={badgePill}>WHAT USERS SAY</div>
                        <h2 style={{ fontSize: 44, fontWeight: 900, letterSpacing: '-0.03em', marginTop: 16, color: '#fff' }}>Trusted by Thousands</h2>
                        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', marginTop: 12 }}>Join a growing community of weather-aware users across India.</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
                        {testimonials.map((t, i) => (
                            <TestimonialCard key={i} {...t} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── DOWNLOAD CTA ── */}
            <section style={{
                padding: '100px 60px',
                background: 'linear-gradient(135deg,#0f1a3a 0%,#0a1628 60%,#0a0e1a 100%)',
                textAlign: 'center',
                position: 'relative', overflow: 'hidden',
            }}>
                <div style={{ position: 'absolute', top: '30%', left: '20%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(59,130,246,0.06)', filter: 'blur(60px)' }} />
                <div style={{ position: 'absolute', top: '20%', right: '15%', width: 250, height: 250, borderRadius: '50%', background: 'rgba(6,182,212,0.06)', filter: 'blur(60px)' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <h2 style={{ fontSize: 44, fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 16, color: '#fff' }}>
                        Download VayuNetra AI Today
                    </h2>
                    <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', marginBottom: 40, maxWidth: 500, margin: '0 auto 40px' }}>
                        Be informed. Be prepared. Stay ahead with AI-powered weather intelligence.
                    </p>
                    <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginBottom: 16 }}>
                        <StoreBadge store="google" onClick={() => navigate('/dashboard')} large />
                        <StoreBadge store="apple" onClick={() => navigate('/dashboard')} large />
                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer style={{ background: '#080c18', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '40px 60px' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                    {/* Logo */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#3b82f6,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🌬️</div>
                        <span style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>VayuNetra <span style={{ color: '#3b82f6' }}>AI</span></span>
                    </div>
                    {/* Footer Nav */}
                    <div style={{ display: 'flex', gap: 24, fontSize: 12, color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>
                        {['Home', 'Features', 'FAQs', 'Privacy', 'Terms', 'Contact'].map(item => (
                            <span key={item} style={{ cursor: 'pointer' }} onClick={() => item === 'Home' && navigate('/')}>{item}</span>
                        ))}
                    </div>
                    {/* Social */}
                    <div style={{ display: 'flex', gap: 12 }}>
                        {['𝕏', '📷', '▶'].map((icon, i) => (
                            <div key={i} style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, cursor: 'pointer' }}>{icon}</div>
                        ))}
                    </div>
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 24, textAlign: 'center' }}>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>See the Weather. Understand the Future. | © 2026 VayuNetra AI. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}

// ─── Sub-Components ────────────────────────────────────────────────────────────

function StoreBadge({ store, onClick, large }) {
    const isGoogle = store === 'google'
    return (
        <button onClick={onClick} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: large ? '12px 24px' : '8px 18px',
            borderRadius: 14, border: '1px solid rgba(255,255,255,0.15)',
            background: 'rgba(255,255,255,0.06)', color: '#fff',
            cursor: 'pointer', backdropFilter: 'blur(10px)',
            transition: 'all 0.2s',
        }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
        >
            <span style={{ fontSize: large ? 28 : 22 }}>{isGoogle ? '▶' : ''}</span>
            {!isGoogle && <span style={{ fontSize: large ? 26 : 20 }}>🍎</span>}
            <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', lineHeight: 1, marginBottom: 2 }}>{isGoogle ? 'GET IT ON' : 'Download on the'}</div>
                <div style={{ fontSize: large ? 14 : 12, fontWeight: 700, lineHeight: 1, color: '#fff' }}>{isGoogle ? 'Google Play' : 'App Store'}</div>
            </div>
        </button>
    )
}

function PhoneMockup({ style, screen, navigate }) {
    const [time, setTime] = useState('')
    useEffect(() => {
        const update = () => {
            const now = new Date()
            setTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }))
        }
        update()
        const t = setInterval(update, 1000)
        return () => clearInterval(t)
    }, [])

    return (
        <div style={{
            width: 240, height: 480,
            borderRadius: 40,
            background: '#111827',
            border: '8px solid #1f2937',
            boxShadow: '0 40px 100px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.05)',
            position: 'relative', overflow: 'hidden',
            ...style,
        }}>
            {/* Notch */}
            <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', width: 60, height: 10, background: '#1f2937', borderRadius: 5, zIndex: 10 }} />

            {screen === 'main' ? (
                <div style={{ padding: '24px 16px 16px', height: '100%', background: 'linear-gradient(180deg,#0f172a 0%,#1e293b 100%)' }}>
                    {/* Status bar */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'rgba(255,255,255,0.5)', marginBottom: 16, marginTop: 6 }}>
                        <span>{time}</span>
                        <span>📶 🔋</span>
                    </div>
                    {/* Logo */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
                        <div style={{ width: 22, height: 22, borderRadius: 6, background: 'linear-gradient(135deg,#3b82f6,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>🌬️</div>
                        <span style={{ fontSize: 11, fontWeight: 800, color: '#fff' }}>VayuNetra AI</span>
                    </div>
                    {/* Temp */}
                    <div style={{ textAlign: 'center', padding: '12px 0 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 12 }}>
                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>📍 New Delhi, India</div>
                        <div style={{ fontSize: 44, fontWeight: 900, color: '#fff', lineHeight: 1 }}>29°C</div>
                        <div style={{ fontSize: 11, color: '#3b82f6', marginTop: 4 }}>Partly Cloudy</div>
                    </div>
                    {/* Stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
                        {[{ i: '💧', v: '78%', l: 'Humidity' }, { i: '💨', v: '14km/h', l: 'Wind' }, { i: '🌿', v: '85', l: 'AQI' }].map((s, i) => (
                            <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '8px 4px', textAlign: 'center' }}>
                                <div style={{ fontSize: 14 }}>{s.i}</div>
                                <div style={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>{s.v}</div>
                                <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)' }}>{s.l}</div>
                            </div>
                        ))}
                    </div>
                    {/* Hourly */}
                    <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: 8, letterSpacing: '0.06em' }}>HOURLY FORECAST</div>
                    <div style={{ display: 'flex', gap: 6 }}>
                        {['11PM', '12AM', '1AM', '2AM', '3AM'].map((h, i) => (
                            <div key={i} style={{ flex: 1, background: i === 0 ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '6px 2px', textAlign: 'center', border: i === 0 ? '1px solid rgba(59,130,246,0.3)' : '1px solid transparent' }}>
                                <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{h}</div>
                                <div style={{ fontSize: 12 }}>{['🌧', '🌧', '⛅', '🌡', '☀️'][i]}</div>
                                <div style={{ fontSize: 9, fontWeight: 700, color: '#fff', marginTop: 4 }}>{[27, 26, 25, 25, 27][i]}°</div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div style={{ height: '100%', background: 'linear-gradient(180deg,#0f172a 0%,#0a1628 100%)', padding: 16, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.5)', marginTop: 12, marginBottom: 12 }}>Weather Map</div>
                    <div style={{ flex: 1, background: 'rgba(59,130,246,0.08)', borderRadius: 16, border: '1px solid rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        <div style={{ fontSize: 36, opacity: 0.5 }}>🗺️</div>
                        {[{ top: '30%', left: '40%', color: '#3b82f6' }, { top: '55%', left: '60%', color: '#ef4444' }, { top: '45%', left: '25%', color: '#10b981' }].map((dot, i) => (
                            <div key={i} style={{ position: 'absolute', top: dot.top, left: dot.left, width: 8, height: 8, borderRadius: '50%', background: dot.color, boxShadow: `0 0 8px ${dot.color}` }} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

function ChatMessage({ from, text, time, options }) {
    const isBot = from === 'bot'
    return (
        <div style={{ display: 'flex', flexDirection: isBot ? 'row' : 'row-reverse', gap: 8, marginBottom: 12 }}>
            {isBot && <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#3b82f6,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>🤖</div>}
            <div>
                <div style={{
                    background: isBot ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg,#3b82f6,#06b6d4)',
                    borderRadius: isBot ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
                    padding: '8px 12px', maxWidth: 300, fontSize: 12, color: '#fff', lineHeight: 1.5,
                }}>
                    {text}
                </div>
                {options && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                        {options.map((o, i) => (
                            <div key={i} style={{ fontSize: 11, color: '#60a5fa', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', padding: '6px 10px', borderRadius: 8, cursor: 'pointer' }}>{o}</div>
                        ))}
                    </div>
                )}
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 4, textAlign: isBot ? 'left' : 'right' }}>{time}</div>
            </div>
        </div>
    )
}

function FeatureCard({ icon, color, title, sub }) {
    const [hov, setHov] = useState(false)
    return (
        <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
            background: hov ? `${color}0d` : '#111827',
            border: `1px solid ${hov ? color + '30' : 'rgba(255,255,255,0.06)'}`,
            borderRadius: 20, padding: '28px 24px',
            transition: 'all 0.3s ease', cursor: 'default',
            display: 'flex', gap: 18, alignItems: 'flex-start',
            boxShadow: hov ? `0 8px 30px ${color}15` : 'none',
        }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{icon}</div>
            <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{title}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{sub}</div>
            </div>
        </div>
    )
}

function TestimonialCard({ name, loc, text, stars, avatar }) {
    return (
        <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 28 }}>
            <div style={{ display: 'flex', marginBottom: 16 }}>
                {Array.from({ length: stars }).map((_, i) => <span key={i} style={{ color: '#f59e0b', fontSize: 16 }}>★</span>)}
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, marginBottom: 20, fontStyle: 'italic' }}>{text}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(59,130,246,0.15)', border: '2px solid rgba(59,130,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{avatar}</div>
                <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{name}</div>
                    <div style={{ fontSize: 11, color: '#3b82f6' }}>{loc}</div>
                </div>
            </div>
        </div>
    )
}

const badgePill = {
    display: 'inline-block', padding: '5px 14px', borderRadius: 20,
    background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)',
    fontSize: 10, fontWeight: 800, color: '#60a5fa', letterSpacing: '0.08em',
}
