import { useState } from 'react'
import { useAppStore } from '../store/appStore'
import { PageHeader, FilterBar, CredibilityCircle, EventTypeBadge, StatusBadge, SeverityBadge } from '../components/ui'
import ReportCard from '../components/ReportCard'
import { Search } from 'lucide-react'

export default function Reports() {
    const { reports, filters, setFilter, getFilteredReports, resetFilters } = useAppStore()
    const [searchLocal, setSearchLocal] = useState(filters.search || '')
    const [page, setPage] = useState(1)
    const PAGE_SIZE = 12

    const handleSearch = (e) => {
        setSearchLocal(e.target.value)
        setFilter('search', e.target.value)
        setPage(1)
    }

    const filtered = getFilteredReports()
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    const totalPages = Math.ceil(filtered.length / PAGE_SIZE)

    return (
        <div style={{ padding: 24, maxWidth: 1400 }}>
            <PageHeader
                title="Weather Reports"
                subtitle={`${filtered.length} reports matching current filters`}
                actions={
                    <button onClick={resetFilters} style={btnStyle}>Reset Filters</button>
                }
            />

            {/* Filters row */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20, alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                    <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                        value={searchLocal}
                        onChange={handleSearch}
                        placeholder="Search reports..."
                        style={{
                            paddingLeft: 32, paddingRight: 12, paddingBlock: 7,
                            background: '#f8fafc', border: '1px solid rgba(0,0,0,0.1)',
                            borderRadius: 8, color: '#0f172a', fontSize: 12, outline: 'none',
                            fontFamily: 'Inter, sans-serif', width: 200,
                        }}
                    />
                </div>
                <FilterBar filters={filters} onFilterChange={(k, v) => { setFilter(k, v); setPage(1) }} />
            </div>

            {/* Report grid */}
            {paginated.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>📭</div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: '#64748b' }}>No reports found</div>
                    <div style={{ fontSize: 13, marginTop: 4 }}>Try adjusting your filters</div>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16, marginBottom: 20 }}>
                    {paginated.map(r => <ReportCard key={r.id} report={r} />)}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 8 }}>
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={pgBtn(page === 1)}>← Prev</button>
                    {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                        const p = i + 1
                        return (
                            <button key={p} onClick={() => setPage(p)} style={{ ...pgBtn(false), background: page === p ? 'rgba(59,130,246,0.2)' : 'transparent', color: page === p ? '#60a5fa' : '#475569' }}>{p}</button>
                        )
                    })}
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={pgBtn(page === totalPages)}>Next →</button>
                </div>
            )}
        </div>
    )
}

const btnStyle = { padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.1)', background: 'rgba(0,0,0,0.05)', color: '#475569', fontSize: 12, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }
const pgBtn = (disabled) => ({ padding: '5px 12px', borderRadius: 6, border: '1px solid rgba(0,0,0,0.08)', background: 'transparent', color: disabled ? '#cbd5e1' : '#475569', cursor: disabled ? 'not-allowed' : 'pointer', fontSize: 12, fontFamily: 'Inter, sans-serif' })
