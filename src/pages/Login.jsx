import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/appStore'
import { Mail, Lock, ArrowRight, ShieldCheck, User } from 'lucide-react'

// ── Credential presets ────────────────────────────────────────────────────────
const ACCOUNTS = {
    user: { email: 'user@vayunetra.in', password: 'user123', role: 'user' },
    admin: { email: 'admin@vayunetra.in', password: 'admin123', role: 'admin' },
}

export default function Login() {
    const navigate = useNavigate()
    const { setRole } = useAppStore()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [selected, setSelected] = useState('user')   // which tile is highlighted

    // Prefill credentials when tile is clicked
    const selectRole = (role) => {
        setSelected(role)
        setEmail(ACCOUNTS[role].email)
        setPassword(ACCOUNTS[role].password)
        setError('')
    }

    const handleLogin = (e) => {
        e.preventDefault()
        setError('')
        const match = Object.values(ACCOUNTS).find(
            a => a.email === email.trim() && a.password === password
        )
        if (!match) { setError('Invalid credentials. Use the quick-login tiles above.'); return }
        setIsLoading(true)
        setTimeout(() => {
            setRole(match.role)
            setIsLoading(false)
            navigate('/home')
        }, 900)
    }

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, #f0f7ff 0%, #f8fafc 50%, #f0fdf4 100%)',
            position: 'relative', overflow: 'hidden', fontFamily: 'Inter, sans-serif',
        }}>
            {/* BG blobs */}
            <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '40%', height: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(255,255,255,0) 70%)', zIndex: 0 }} />
            <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '40%', height: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, rgba(255,255,255,0) 70%)', zIndex: 0 }} />

            {/* Logo top-left */}
            <div style={{ position: 'absolute', top: 32, left: 40, zIndex: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }} onClick={() => navigate('/')}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, boxShadow: '0 4px 12px rgba(59,130,246,0.3)' }}>🌬️</div>
                <div style={{ fontWeight: 800, fontSize: 17, color: '#0f172a' }}>VayuNetra <span style={{ color: '#3b82f6' }}>AI</span></div>
            </div>

            <div style={{ width: '100%', maxWidth: 460, position: 'relative', zIndex: 10 }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                    <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', color: '#3b82f6' }}>
                        <ShieldCheck size={28} />
                    </div>
                    <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>Welcome Back</h1>
                    <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>Select your role to continue</p>
                </div>

                {/* Role tiles */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24 }}>
                    <RoleTile
                        icon={<User size={22} />}
                        title="User"
                        sub="View weather, alerts & map"
                        color="#3b82f6"
                        active={selected === 'user'}
                        onClick={() => selectRole('user')}
                    />
                    <RoleTile
                        icon={<ShieldCheck size={22} />}
                        title="Admin"
                        sub="Manage reports & verification"
                        color="#8b5cf6"
                        active={selected === 'admin'}
                        onClick={() => selectRole('admin')}
                    />
                </div>

                {/* Card */}
                <div style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 24, padding: '32px 36px', boxShadow: '0 20px 50px rgba(0,0,0,0.06)' }}>

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                        {/* Email */}
                        <div>
                            <label style={labelSt}>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={16} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input
                                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                                    placeholder="your@email.com" required
                                    style={inputSt}
                                    onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.12)' }}
                                    onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.1)'; e.target.style.boxShadow = 'none' }}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                <label style={labelSt}>Password</label>
                                <span style={{ fontSize: 12, color: '#3b82f6', cursor: 'pointer' }}>Forgot?</span>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Lock size={16} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input
                                    type="password" value={password} onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••" required
                                    style={inputSt}
                                    onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.12)' }}
                                    onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.1)'; e.target.style.boxShadow = 'none' }}
                                />
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#ef4444' }}>
                                ⚠️ {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button type="submit" disabled={isLoading} style={{
                            marginTop: 4, padding: '13px', borderRadius: 12, border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer',
                            background: selected === 'admin' ? 'linear-gradient(135deg,#8b5cf6,#6366f1)' : 'linear-gradient(135deg,#3b82f6,#06b6d4)',
                            color: '#fff', fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            fontFamily: 'Inter, sans-serif', boxShadow: '0 4px 14px rgba(59,130,246,0.3)', opacity: isLoading ? 0.8 : 1, transition: 'all 0.2s',
                        }}>
                            {isLoading ? 'Signing in...' : <>{selected === 'admin' ? '🛡 Admin Login' : '👤 User Login'} <ArrowRight size={15} /></>}
                        </button>

                        <div style={{ textAlign: 'center', fontSize: 11, color: '#94a3b8' }}>
                            Demo mode — credentials are prefilled when you click a role tile above.
                        </div>
                    </form>
                </div>

                {/* Back to landing */}
                <div style={{ textAlign: 'center', marginTop: 20 }}>
                    <span style={{ fontSize: 13, color: '#64748b', cursor: 'pointer' }} onClick={() => navigate('/')}>
                        ← Back to Landing
                    </span>
                </div>
            </div>

            <div style={{ position: 'absolute', bottom: 24, width: '100%', textAlign: 'center', fontSize: 12, color: '#cbd5e1', zIndex: 0 }}>
                VayuNetra AI © 2026
            </div>
        </div>
    )
}

// ── Sub-component: Role Tile ───────────────────────────────────────────────────
function RoleTile({ icon, title, sub, color, active, onClick }) {
    return (
        <button onClick={onClick} style={{
            padding: '18px 14px', border: `2px solid ${active ? color : 'rgba(0,0,0,0.08)'}`,
            borderRadius: 16, background: active ? `${color}0d` : '#fff',
            cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
            boxShadow: active ? `0 4px 16px ${color}22` : 'none',
            fontFamily: 'Inter, sans-serif',
        }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: active ? `${color}18` : 'rgba(0,0,0,0.04)', border: `1px solid ${active ? color + '30' : 'transparent'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: active ? color : '#94a3b8', margin: '0 auto 10px', transition: 'all 0.2s' }}>
                {icon}
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: active ? '#0f172a' : '#64748b', marginBottom: 3 }}>{title}</div>
            <div style={{ fontSize: 11, color: active ? '#475569' : '#94a3b8', lineHeight: 1.4 }}>{sub}</div>
        </button>
    )
}

// ── Styles ────────────────────────────────────────────────────────────────────
const labelSt = { display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6 }
const inputSt = {
    width: '100%', padding: '11px 12px 11px 38px',
    background: '#f8fafc', border: '1px solid rgba(0,0,0,0.1)',
    borderRadius: 11, color: '#0f172a', fontSize: 13,
    outline: 'none', transition: 'all 0.2s', fontFamily: 'Inter, sans-serif',
    boxSizing: 'border-box',
}
