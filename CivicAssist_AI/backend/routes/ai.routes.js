/**
 * routes/ai.routes.js
 * AI chat endpoint with a stricter per-route rate limiter.
 */

const express = require('express');
const rateLimit = require('express-rate-limit');
const { chat } = require('../controllers/ai.controller');
const { validateBody, chatSchema } = require('../middleware/validate.middleware');

const router = express.Router();

// AI-specific rate limit: 20 requests per 15 minutes per IP
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'AI request limit reached. Please wait before sending more messages.' },
});

/**
 * POST /api/ai/chat
 * Sends a query to Gemini AI and returns a step-by-step civic guidance response.
 */
router.post('/chat', aiLimiter, validateBody(chatSchema), chat);

module.exports = router;
