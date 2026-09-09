import { create } from 'zustand'
import { MOCK_REPORTS, MOCK_EVENTS, MOCK_STATS } from '../data/mockData'
import {
    fetchReports, fetchEvents, fetchStats,
    updateReportStatus, createReport as apiCreateReport
} from '../services/api'

export const useAppStore = create((set, get) => ({
    // Data
    reports: [],
    events: [],
    stats: MOCK_STATS,

    // Loading state
    loading: true,
    apiOnline: false,

    // Filters
    filters: {
        date: 'all',
        eventType: 'all',
        status: 'all',
        source: 'all',
        search: '',
    },

    // UI State
    demoMode: false,
    demoScenarioRunning: false,
    wsConnected: true,
    activeTab: 'dashboard',
    selectedEvent: null,
    selectedReport: null,
    notifications: [
        { id: 1, type: 'critical', message: 'High-risk flood event detected in Guwahati', time: '2 min ago', read: false },
        { id: 2, type: 'warning', message: 'Suspicious report #MSA-2026-10342 requires review', time: '5 min ago', read: false },
        { id: 3, type: 'success', message: 'Dehradun rainfall event verified successfully', time: '8 min ago', read: true },
        { id: 4, type: 'info', message: '23 duplicate reports auto-grouped into EV-1024', time: '12 min ago', read: true },
    ],
    sidebarOpen: true,

    // ── Bootstrap: load all data from API (falls back to mock) ────────────────
    loadData: async () => {
        set({ loading: true })
        try {
            const [reports, events, stats] = await Promise.all([
                fetchReports(),
                fetchEvents(),
                fetchStats(),
            ])
            set({ reports, events, stats, loading: false, apiOnline: true })
        } catch {
            // Full fallback to mock data
            set({ reports: MOCK_REPORTS, events: MOCK_EVENTS, stats: MOCK_STATS, loading: false, apiOnline: false })
        }
    },

    // ── Filters ───────────────────────────────────────────────────────────────
    setFilter: (key, value) => set(state => ({
        filters: { ...state.filters, [key]: value }
    })),

    resetFilters: () => set({
        filters: { date: 'all', eventType: 'all', status: 'all', source: 'all', search: '' }
    }),

    // ── Reports ───────────────────────────────────────────────────────────────
    addReport: async (reportData) => {
        const saved = await apiCreateReport(reportData)
        set(state => ({
            reports: [saved, ...state.reports],
            stats: { ...state.stats, totalReports: state.stats.totalReports + 1, pending: state.stats.pending + 1 }
        }))
        return saved
    },

    verifyReport: async (id) => {
        await updateReportStatus(id, 'verified')
        set(state => ({
            reports: state.reports.map(r => r.id === id ? { ...r, verification_status: 'verified' } : r),
            stats: { ...state.stats, verified: state.stats.verified + 1, pending: Math.max(0, state.stats.pending - 1) }
        }))
    },

    rejectReport: async (id) => {
        await updateReportStatus(id, 'rejected')
        set(state => ({
            reports: state.reports.map(r => r.id === id ? { ...r, verification_status: 'rejected' } : r),
            stats: { ...state.stats, rejected: (state.stats.rejected || 0) + 1, pending: Math.max(0, state.stats.pending - 1) }
        }))
    },

    markSuspicious: async (id) => {
        await updateReportStatus(id, 'suspicious')
        set(state => ({
            reports: state.reports.map(r => r.id === id ? { ...r, verification_status: 'suspicious' } : r),
        }))
    },

    // ── UI Setters ────────────────────────────────────────────────────────────
    setDemoMode: (val) => set({ demoMode: val }),
    setDemoScenarioRunning: (val) => set({ demoScenarioRunning: val }),
    setWsConnected: (val) => set({ wsConnected: val }),
    setSidebarOpen: (val) => set({ sidebarOpen: val }),
    setSelectedEvent: (ev) => set({ selectedEvent: ev }),
    setSelectedReport: (r) => set({ selectedReport: r }),

    markNotificationRead: (id) => set(state => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
    })),

    addNotification: (notif) => set(state => ({
        notifications: [{ id: Date.now(), ...notif, read: false, time: 'just now' }, ...state.notifications]
    })),

    // ── Filtered view ─────────────────────────────────────────────────────────
    getFilteredReports: () => {
        const { reports, filters } = get()
        return reports.filter(r => {
            if (filters.eventType !== 'all' && r.event_type !== filters.eventType) return false
            if (filters.status !== 'all' && r.verification_status !== filters.status) return false
            if (filters.source !== 'all' && r.source !== filters.source) return false
            if (filters.search && !r.text?.toLowerCase().includes(filters.search.toLowerCase()) &&
                !r.location?.toLowerCase().includes(filters.search.toLowerCase())) return false
            return true
        })
    },
}))
