/**
 * app.js — Express App Configuration
 * Sets up middleware, routes, and exports the app for testing.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const aiRoutes = require('./routes/ai.routes');
const checklistRoutes = require('./routes/checklist.routes');
const userRoutes = require('./routes/user.routes');
const { errorHandler } = require('./middleware/error.middleware');

const app = express();

// ─── Security Middleware ─────────────────────────────────────────────────────
app.use(helmet());

// ─── CORS ────────────────────────────────────────────────────────────────────
const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:5173';
app.use(cors({ origin: allowedOrigin, credentials: true }));

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Logging ─────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ─── Global Rate Limiter ─────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
});
app.use('/api/', globalLimiter);

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/ai', aiRoutes);
app.use('/api/checklist', checklistRoutes);
app.use('/api/user', userRoutes);

const path = require('path');

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'CivicFlow AI', timestamp: new Date().toISOString() });
});

// ─── Static Frontend Serving ──────────────────────────────────────────────────
// Serve static files from the 'dist' directory (Vite build output)
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// ─── 404 / SPA Routing ───────────────────────────────────────────────────────
// If a request doesn't match an API route or a static file, serve index.html
app.get('*', (req, res) => {
  // If it's an API request that wasn't handled, return 404
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
  }
  // Otherwise serve the React app
  res.sendFile(path.join(distPath, 'index.html'));
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
