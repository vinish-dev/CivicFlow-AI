/**
 * routes/checklist.routes.js
 * CRUD routes for user checklist management.
 */

const express = require('express');
const { fetchChecklist, patchItem, reset } = require('../controllers/checklist.controller');
const { validateBody, checklistItemSchema } = require('../middleware/validate.middleware');

const router = express.Router();

/** GET /api/checklist/:userId — Fetch user's checklist */
router.get('/:userId', fetchChecklist);

/** PATCH /api/checklist/:userId/item/:itemId — Update a checklist item */
router.patch('/:userId/item/:itemId', validateBody(checklistItemSchema), patchItem);

/** DELETE /api/checklist/:userId/reset — Reset checklist to defaults */
router.delete('/:userId/reset', reset);

module.exports = router;
