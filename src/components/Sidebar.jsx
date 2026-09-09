import { useNavigate, useLocation } from 'react-router-dom'
import { useAppStore } from '../store/appStore'
import {
    LayoutDashboard, Map, FileText, ShieldCheck, Zap, BarChart3,
    MessageSquarePlus, Settings, Activity, Info, Cpu, ChevronLeft,
    ChevronRight, Wind, AlertTriangle, LogOut, Radio, Home
} from 'lucide-react'

const navItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/map', icon: Map, label: 'Live Map' },
    { path: '/reports', icon: FileText, label: 'Reports' },
    { path: '/events', icon: Zap, label: 'Events' },
    { path: '/live-news', icon: Radio, label: 'Weather News' },
    { path: '/alerts', icon: AlertTriangle, label: 'Alerts' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/report', icon: MessageSquarePlus, label: 'Citizen Report' },
    { path: '/admin', icon: Settings, label: 'Settings' },

    // Keeping these as admin/extra tools
    { path: '/dashboard', icon: LayoutDashboard, label: 'Global Dashboard' },
    { path: '/verification', icon: ShieldCheck, label: 'Verification' },
    { path: '/system', icon: Activity, label: 'System Health' },
]

export default function Sidebar() {

    const navigate = useNavigate()
    const location = useLocation()
    const { sidebarOpen, setSidebarOpen, stats, wsConnected } = useAppStore()

    return (
        <aside
            style={{
                width: sidebarOpen ? 220 : 64,
                transition: 'width 0.3s ease',
                background: '#f1f5f9',
                borderRight: '1px solid rgba(0,0,0,0.08)',
                display: 'flex',
                flexDirection: 'column',
                flexShrink: 0,
                zIndex: 100,
                overflow: 'hidden',
            }}
        >
            {/* Logo */}
            <div style={{ padding: '16px 12px', borderBottom: '1px solid rgba(0,0,0,0.08)', minHeight: 72 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                        width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                        background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 20
                    }}>
                        <Wind size={20} color="white" />
                    </div>
                    {sidebarOpen && (
                        <div>
                            <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a', whiteSpace: 'nowrap' }}>VayuNetra</div>
                            <div style={{ fontSize: 9, color: '#64748b', whiteSpace: 'nowrap' }}>Data Platform</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Live status */}
            {sidebarOpen && (
                <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{
                            width: 8, height: 8, borderRadius: '50%',
                            background: wsConnected ? '#10b981' : '#ef4444',
                            boxShadow: wsConnected ? '0 0 6px #10b981' : '0 0 6px #ef4444',
                            animation: 'pulse-live 2s infinite'
                        }} />
                        <span style={{ fontSize: 11, color: wsConnected ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                            {wsConnected ? 'SYSTEM LIVE' : 'RECONNECTING...'}
                        </span>
                    </div>
                    <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 3 }}>{stats.activeEvents} active events</div>
                </div>
            )}

            {/* Nav items */}
            <nav style={{ flex: 1, padding: '8px 6px', overflowY: 'auto' }}>
                {navItems.map(item => {
                    const isActive = location.pathname === item.path
                    const Icon = item.icon
                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            title={!sidebarOpen ? item.label : undefined}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                padding: '8px 10px',
                                borderRadius: 8,
                                border: 'none',
                                background: isActive ? 'rgba(59,130,246,0.15)' : 'transparent',
                                color: isActive ? '#60a5fa' : '#475569',
                                cursor: 'pointer',
                                marginBottom: 2,
                                transition: 'all 0.2s',
                                fontFamily: 'Inter, sans-serif',
                                fontSize: 13,
                                fontWeight: isActive ? 600 : 400,
                                textAlign: 'left',
                                borderLeft: isActive ? '2px solid #3b82f6' : '2px solid transparent',
                            }}
                            onMouseEnter={e => !isActive && (e.currentTarget.style.background = 'rgba(0,0,0,0.05)')}
                            onMouseLeave={e => !isActive && (e.currentTarget.style.background = 'transparent')}
                        >
                            <Icon size={16} style={{ flexShrink: 0 }} />
                            {sidebarOpen && <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>}
                        </button>
                    )
                })}
            </nav>

            {/* Pending alerts (sidebar bottom) */}
            {sidebarOpen && (
                <div style={{ padding: '10px 14px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <AlertTriangle size={12} color="#f59e0b" />
                        <span style={{ fontSize: 11, color: '#f59e0b' }}>Pending Review</span>
                        <span style={{
                            marginLeft: 'auto', background: '#f59e0b', color: '#000',
                            borderRadius: 999, fontSize: 10, fontWeight: 700,
                            padding: '1px 6px'
                        }}>{stats.pending}</span>
                    </div>
                    <div style={{ fontSize: 10, color: '#94a3b8' }}>Suspicious: {stats.suspicious}</div>
                </div>
            )}

            {/* Toggle button and Logout */}
            <div style={{ display: 'flex', padding: 8, gap: 8 }}>
                <button
                    onClick={() => {
                        // Simulate logout
                        navigate('/login');
                    }}
                    style={{
                        flex: 1, padding: 8, borderRadius: 8, border: 'none',
                        background: 'rgba(239,68,68,0.1)', color: '#ef4444',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'background 0.2s', gap: 6
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                >
                    <LogOut size={16} />
                    {sidebarOpen && <span style={{ fontSize: 13, fontWeight: 600 }}>Sign Out</span>}
                </button>

                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    style={{
                        padding: 8, borderRadius: 8, border: 'none',
                        background: 'rgba(0,0,0,0.05)', color: '#64748b',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'background 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
                >
                    {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                </button>
            </div>
        </aside>
    )
}
