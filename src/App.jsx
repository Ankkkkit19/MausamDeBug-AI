import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Reports from './pages/Reports'
import ReportDetail from './pages/ReportDetail'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import CitizenReport from './pages/CitizenReport'
import Analytics from './pages/Analytics'
import Verification from './pages/Verification'
import AdminPanel from './pages/AdminPanel'
import LiveMap from './pages/LiveMap'
import SystemHealth from './pages/SystemHealth'
import Architecture from './pages/Architecture'
import About from './pages/About'
import LiveNews from './pages/LiveNews'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Standalone pages */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* App with sidebar/navbar layout */}
        <Route element={<AppLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/map" element={<LiveMap />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/reports/:id" element={<ReportDetail />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/report" element={<CitizenReport />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/verification" element={<Verification />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/system" element={<SystemHealth />} />
          <Route path="/architecture" element={<Architecture />} />
          <Route path="/live-news" element={<LiveNews />} />
          <Route path="/about" element={<About />} />
          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
