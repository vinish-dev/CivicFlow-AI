/**
 * controllers/checklist.controller.js
 * Handles user checklist get/update/reset operations.
 */

const { getChecklist, updateChecklistItem, resetChecklist } = require('../services/checklist.service');

/**
 * GET /api/checklist/:userId
 */
async function fetchChecklist(req, res, next) {
  try {
    const { userId } = req.params;
    const data = await getChecklist(userId);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/checklist/:userId/item/:itemId
 * Body: { completed: boolean }
 */
async function patchItem(req, res, next) {
  try {
    const { userId, itemId } = req.params;
    const { completed } = req.body;
    const data = await updateChecklistItem(userId, itemId, completed);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/checklist/:userId/reset
 */
async function reset(req, res, next) {
  try {
    const { userId } = req.params;
    const data = await resetChecklist(userId);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

module.exports = { fetchChecklist, patchItem, reset };
