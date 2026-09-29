/**
 * MausamDeBug Backend API Server
 * Express + Mongoose — connects to MongoDB
 */
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Report, Event } = require('./models');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middlewares ──────────────────────────────────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json());

// ─── MongoDB Connection ───────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected:', process.env.MONGO_URI))
    .catch(err => {
        console.error('❌ MongoDB connection failed:', err.message);
        process.exit(1);
    });

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => res.json({ status: 'ok', service: 'MausamDeBug API', version: '1.0.0' }));
app.get('/api/health', (req, res) => {
    const dbState = ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] ?? 'unknown';
    res.json({ status: 'ok', db: dbState, timestamp: new Date().toISOString() });
});

// ─── REPORTS ─────────────────────────────────────────────────────────────────
// GET /api/reports — with optional filters: ?status=&eventType=&source=&search=&limit=&skip=
app.get('/api/reports', async (req, res) => {
    try {
        const { status, eventType, source, search, limit = 100, skip = 0 } = req.query;
        const query = {};
        if (status && status !== 'all') query.verification_status = status;
        if (eventType && eventType !== 'all') query.event_type = eventType;
        if (source && source !== 'all') query.source = source;
        if (search) {
            query.$or = [
                { text: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } },
                { city: { $regex: search, $options: 'i' } },
                { state: { $regex: search, $options: 'i' } },
            ];
        }
        const total = await Report.countDocuments(query);
        const reports = await Report.find(query).sort({ timestamp: -1 }).limit(+limit).skip(+skip).lean();
        res.json({ total, reports });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// GET /api/reports/:id
app.get('/api/reports/:id', async (req, res) => {
    try {
        const report = await Report.findOne({ id: req.params.id }).lean();
        if (!report) return res.status(404).json({ error: 'Report not found' });
        res.json(report);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/reports — add a citizen report
app.post('/api/reports', async (req, res) => {
    try {
        const body = req.body;
        const id = `MSA-2026-${Date.now()}`;
        const report = new Report({ id, ...body });
        await report.save();
        res.status(201).json(report);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
});

// PATCH /api/reports/:id/status  — verify / reject / flag
app.patch('/api/reports/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const allowed = ['verified', 'pending', 'suspicious', 'rejected'];
        if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' });
        const report = await Report.findOneAndUpdate(
            { id: req.params.id },
            { verification_status: status },
            { new: true }
        );
        if (!report) return res.status(404).json({ error: 'Not found' });
        res.json(report);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── EVENTS ──────────────────────────────────────────────────────────────────
app.get('/api/events', async (req, res) => {
    try {
        const events = await Event.find({}).sort({ report_count: -1 }).lean();
        res.json({ total: events.length, events });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/events/:id', async (req, res) => {
    try {
        const event = await Event.findOne({ id: req.params.id }).lean();
        if (!event) return res.status(404).json({ error: 'Event not found' });
        res.json(event);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── STATS ───────────────────────────────────────────────────────────────────
app.get('/api/stats', async (req, res) => {
    try {
        const [total, verified, pending, suspicious, rejected, activeEvents] = await Promise.all([
            Report.countDocuments(),
            Report.countDocuments({ verification_status: 'verified' }),
            Report.countDocuments({ verification_status: 'pending' }),
            Report.countDocuments({ verification_status: 'suspicious' }),
            Report.countDocuments({ verification_status: 'rejected' }),
            Event.countDocuments({ status: { $in: ['verified', 'active', 'monitoring'] } }),
        ]);
        res.json({ totalReports: total, verified, pending, suspicious, rejected, activeEvents, regionsMonitored: 28, dataQuality: 91.4 });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`🚀 MausamDeBug API running at http://localhost:${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/api/health`);
    console.log(`   Reports:http://localhost:${PORT}/api/reports`);
    console.log(`   Events: http://localhost:${PORT}/api/events`);
    console.log(`   Stats:  http://localhost:${PORT}/api/stats`);
});
