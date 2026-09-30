import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/appStore'
import { PageHeader } from '../components/ui'
import { CheckCircle, MapPin, Send, Upload } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

const EVENT_OPTIONS = [
    'Heavy Rainfall', 'Flood', 'Thunderstorm', 'Heatwave', 'Dense Fog',
    'Dust Storm', 'Strong Wind', 'Hailstorm', 'Landslide', 'Lightning Strike', 'Cyclone'
]

const EVENT_TYPE_MAP = {
    'Heavy Rainfall': 'rainfall', 'Flood': 'flood', 'Thunderstorm': 'thunderstorm',
    'Heatwave': 'heatwave', 'Dense Fog': 'fog', 'Dust Storm': 'dust_storm',
    'Strong Wind': 'strong_wind', 'Hailstorm': 'hailstorm', 'Landslide': 'landslide',
    'Lightning Strike': 'strong_wind', 'Cyclone': 'cyclone',
}

export default function CitizenReport() {
    const navigate = useNavigate()
    const { addReport } = useAppStore()
    const [submitted, setSubmitted] = useState(false)
    const [submittedId, setSubmittedId] = useState('')
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        event: '', description: '', location: '', lat: '', lng: '', datetime: new Date().toISOString().slice(0, 16), contact: ''
    })

    const handleChange = (k, v) => setForm(f => ({ ...f, [k]: v }))

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(pos => {
                handleChange('lat', pos.coords.latitude.toFixed(4))
                handleChange('lng', pos.coords.longitude.toFixed(4))
                toast.success('Location captured!')
            }, () => {
                handleChange('lat', '28.6139')
                handleChange('lng', '77.2090')
                toast('Using default location (Delhi)', { icon: '📍' })
            })
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!form.event || !form.description || !form.location) {
            toast.error('Please fill required fields')
            return
        }
        setLoading(true)
        setTimeout(() => {
            const id = `MSA-2026-${10000 + Math.floor(Math.random() * 5000)}`
            const newReport = {
                id,
                event_type: EVENT_TYPE_MAP[form.event] || 'rainfall',
                text: form.description,
                source: 'citizen',
                source_label: 'Citizen Report',
                location: form.location,
                city: form.location.split(',')[0].trim(),
                state: 'India',
                latitude: parseFloat(form.lat) || 28.6139,
                longitude: parseFloat(form.lng) || 77.2090,
                credibility_score: Math.floor(50 + Math.random() * 30),
                verification_status: 'pending',
                severity: 'MODERATE',
                timestamp: new Date().toISOString(),
                minutes_ago: 0,
                has_image: false,
                duplicate_group: null,
            }
            addReport(newReport).then(saved => setSubmittedId(saved?.id || id))
            setSubmittedId(id)
            setSubmitted(true)
            setLoading(false)
        }, 2000)
    }

    if (submitted) {
        return (
            <div style={{ padding: 40, maxWidth: 600, margin: '0 auto' }}>
                <div style={{ background: '#ffffff', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 16, padding: 36, textAlign: 'center' }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                    <h2 style={{ fontSize: 22, fontWeight: 800, color: '#10b981', margin: '0 0 8px' }}>Report Submitted!</h2>
                    <div style={{ fontSize: 13, color: '#475569', marginBottom: 20 }}>Thank you for contributing to national weather intelligence.</div>

                    <div style={{ background: 'rgba(0,0,0,0.04)', borderRadius: 10, padding: 16, marginBottom: 20 }}>
                        <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>Report ID</div>
                        <div style={{ fontSize: 20, fontWeight: 800, color: '#60a5fa', fontFamily: 'JetBrains Mono, monospace' }}>{submittedId}</div>
                    </div>

                    {/* AI processing steps */}
                    <div style={{ textAlign: 'left', marginBottom: 20 }}>
                        {[
                            { icon: '✓', text: 'Report received by MausamDeBug', done: true },
                            { icon: '🔤', text: 'NLP processing — extracting event info', done: true },
                            { icon: '🤖', text: 'AI credibility analysis running...', done: false },
                            { icon: '🗺️', text: 'Duplicate detection in progress...', done: false },
                            { icon: '📊', text: 'Event correlation pending...', done: false },
                        ].map((s, i) => (
                            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '6px 0', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                                <span style={{ color: s.done ? '#10b981' : '#64748b' }}>{s.icon}</span>
                                <span style={{ fontSize: 12, color: s.done ? '#1e293b' : '#64748b' }}>{s.text}</span>
                                {s.done ? <CheckCircle size={12} color="#10b981" style={{ marginLeft: 'auto' }} /> : <span style={{ marginLeft: 'auto', fontSize: 10, color: '#94a3b8' }}>pending</span>}
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                        <button onClick={() => { setSubmitted(false); setForm({ event: '', description: '', location: '', lat: '', lng: '', datetime: new Date().toISOString().slice(0, 16), contact: '' }) }}
                            style={secondaryBtn}>Submit Another</button>
                        <button onClick={() => navigate('/dashboard')} style={primaryBtn}>View Dashboard</button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div style={{ padding: 24, maxWidth: 700 }}>
            <PageHeader
                title="Submit Weather Report"
                subtitle="Report a weather event in your area. Your report helps build national weather intelligence."
            />

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Event type */}
                <div style={fieldStyle}>
                    <label style={labelStyle}>Weather Event *</label>
                    <select value={form.event} onChange={e => handleChange('event', e.target.value)} style={inputStyle} required>
                        <option value="">Select event type...</option>
                        {EVENT_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                </div>

                {/* Description */}
                <div style={fieldStyle}>
                    <label style={labelStyle}>Description *</label>
                    <textarea
                        value={form.description}
                        onChange={e => handleChange('description', e.target.value)}
                        placeholder="Describe what you're observing. Include details like intensity, road conditions, visibility, etc. You can write in English, Hindi, or Hinglish."
                        rows={4}
                        style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
                        required
                    />
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>Supports English, Hindi, and Hinglish</div>
                </div>

                {/* Location */}
                <div style={fieldStyle}>
                    <label style={labelStyle}>Location *</label>
                    <input
                        value={form.location}
                        onChange={e => handleChange('location', e.target.value)}
                        placeholder="e.g., Rajpur Road, Dehradun, Uttarakhand"
                        style={inputStyle}
                        required
                    />
                </div>

                {/* GPS */}
                <div style={fieldStyle}>
                    <label style={labelStyle}>GPS Coordinates (optional)</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <input value={form.lat} onChange={e => handleChange('lat', e.target.value)} placeholder="Latitude" style={{ ...inputStyle, flex: 1 }} />
                        <input value={form.lng} onChange={e => handleChange('lng', e.target.value)} placeholder="Longitude" style={{ ...inputStyle, flex: 1 }} />
                        <button type="button" onClick={getLocation} style={{ ...secondaryBtn, whiteSpace: 'nowrap' }}>
                            <MapPin size={12} /> Auto-detect
                        </button>
                    </div>
                </div>

                {/* Datetime */}
                <div style={fieldStyle}>
                    <label style={labelStyle}>Date & Time</label>
                    <input type="datetime-local" value={form.datetime} onChange={e => handleChange('datetime', e.target.value)} style={inputStyle} />
                </div>

                {/* Image upload placeholder */}
                <div style={fieldStyle}>
                    <label style={labelStyle}>Upload Image/Video (optional)</label>
                    <div style={{
                        border: '2px dashed rgba(0,0,0,0.1)', borderRadius: 10, padding: '24px',
                        textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s',
                    }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(59,130,246,0.4)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'}
                    >
                        <Upload size={24} color="#94a3b8" style={{ marginBottom: 8 }} />
                        <div style={{ fontSize: 13, color: '#64748b' }}>Click to upload or drag & drop</div>
                        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>JPG, PNG, MP4 up to 50MB</div>
                    </div>
                </div>

                {/* Contact */}
                <div style={fieldStyle}>
                    <label style={labelStyle}>Contact (optional — not shared publicly)</label>
                    <input value={form.contact} onChange={e => handleChange('contact', e.target.value)} placeholder="Phone / Email (for follow-up only)" style={inputStyle} />
                </div>

                {/* Disclaimer */}
                <div style={{ padding: '10px 14px', background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 8, fontSize: 12, color: '#475569', lineHeight: 1.6 }}>
                    ⚠️ Submitting false or misleading weather reports affects emergency response. Your report will be AI-verified and reviewed by operators.
                </div>

                <button type="submit" disabled={loading} style={{ ...primaryBtn, opacity: loading ? 0.7 : 1 }}>
                    <Send size={14} />
                    {loading ? 'Analyzing Report...' : 'Submit Report'}
                </button>
            </form>
            <Toaster position="top-center" />
        </div>
    )
}

const fieldStyle = { display: 'flex', flexDirection: 'column', gap: 6 }
const labelStyle = { fontSize: 12, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }
const inputStyle = { padding: '9px 12px', background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8, color: '#0f172a', fontSize: 13, outline: 'none', fontFamily: 'Inter, sans-serif', transition: 'border-color 0.2s' }
const primaryBtn = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 24px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'opacity 0.2s' }
const secondaryBtn = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(0,0,0,0.05)', color: '#475569', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }
