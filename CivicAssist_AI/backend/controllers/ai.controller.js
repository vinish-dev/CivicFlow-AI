/**
 * controllers/ai.controller.js
 * Handles AI chat and simplified explanation requests.
 */

const { getAIResponse } = require('../services/gemini.service');

/**
 * POST /api/ai/chat
 * Body: { query, userProfile, simplified }
 */
async function chat(req, res, next) {
  try {
    const { query, userProfile = {}, simplified = false } = req.body;

    const responseText = await getAIResponse(query, { userProfile, simplified });

    res.json({
      success: true,
      query,
      response: responseText,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { chat };
