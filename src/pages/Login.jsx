import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react'

export default function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = (e) => {
        e.preventDefault()
        setIsLoading(true)
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false)
            navigate('/home')
        }, 1200)
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f1f5f9', // Light theme bg
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background elements */}
            <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '40%', height: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(255,255,255,0) 70%)', zIndex: 0 }} />
            <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '40%', height: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, rgba(255,255,255,0) 70%)', zIndex: 0 }} />

            <div style={{ position: 'absolute', top: 40, left: 40, zIndex: 10, cursor: 'pointer' }} onClick={() => navigate('/')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🌬️</div>
                    <div style={{ fontWeight: 800, fontSize: 16, color: '#0f172a' }}>VayuNetra</div>
                </div>
            </div>

            <div style={{
                width: '100%',
                maxWidth: 420,
                background: '#ffffff',
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: 24,
                padding: '40px',
                position: 'relative',
                zIndex: 10,
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.05)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{
                        width: 56, height: 56, borderRadius: 16,
                        background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 20px', color: '#3b82f6'
                    }}>
                        <ShieldCheck size={28} />
                    </div>
                    <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>Welcome Back</h1>
                    <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>Sign in to the intelligence platform</p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="official@agency.gov.in"
                                required
                                style={{
                                    width: '100%', padding: '12px 14px 12px 42px',
                                    background: '#f8fafc', border: '1px solid rgba(0,0,0,0.1)',
                                    borderRadius: 12, color: '#0f172a', fontSize: 14,
                                    outline: 'none', transition: 'all 0.2s',
                                    fontFamily: 'Inter, sans-serif'
                                }}
                                onFocus={e => { e.target.style.background = '#ffffff'; e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 4px rgba(59,130,246,0.1)' }}
                                onBlur={e => { e.target.style.background = '#f8fafc'; e.target.style.borderColor = 'rgba(0,0,0,0.1)'; e.target.style.boxShadow = 'none' }}
                            />
                        </div>
                    </div>

                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                            <label style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>Password</label>
                            <a href="#" style={{ fontSize: 12, color: '#3b82f6', textDecoration: 'none', fontWeight: 500 }}>Forgot?</a>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                style={{
                                    width: '100%', padding: '12px 14px 12px 42px',
                                    background: '#f8fafc', border: '1px solid rgba(0,0,0,0.1)',
                                    borderRadius: 12, color: '#0f172a', fontSize: 14,
                                    outline: 'none', transition: 'all 0.2s',
                                    fontFamily: 'Inter, sans-serif'
                                }}
                                onFocus={e => { e.target.style.background = '#ffffff'; e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 4px rgba(59,130,246,0.1)' }}
                                onBlur={e => { e.target.style.background = '#f8fafc'; e.target.style.borderColor = 'rgba(0,0,0,0.1)'; e.target.style.boxShadow = 'none' }}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            marginTop: 8,
                            padding: '14px',
                            background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: 12,
                            fontSize: 15,
                            fontWeight: 700,
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                            fontFamily: 'Inter, sans-serif',
                            boxShadow: '0 4px 14px rgba(59,130,246,0.3)',
                            opacity: isLoading ? 0.8 : 1,
                            transition: 'opacity 0.2s'
                        }}
                    >
                        {isLoading ? 'Authenticating...' : (
                            <>Sign In <ArrowRight size={16} /></>
                        )}
                    </button>

                    <div style={{ textAlign: 'center', marginTop: 12, fontSize: 12, color: '#64748b' }}>
                        Authorized personnel only. Access is logged.
                    </div>
                </form>
            </div>

            <div style={{ position: 'absolute', bottom: 30, textAlign: 'center', width: '100%', fontSize: 12, color: '#94a3b8' }}>
                VayuNetra System © {new Date().getFullYear()}
            </div>
        </div>
    )
}
