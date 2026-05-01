/**
 * routes/user.routes.js
 * User profile and eligibility routes.
 */

const express = require('express');
const { saveProfile, getProfile, eligibility } = require('../controllers/user.controller');
const { validateBody, profileSchema, eligibilitySchema } = require('../middleware/validate.middleware');

const router = express.Router();

/** POST /api/user/profile — Save or update user profile */
router.post('/profile', validateBody(profileSchema), saveProfile);

/** GET /api/user/profile/:userId — Get user profile */
router.get('/profile/:userId', getProfile);

/** POST /api/user/eligibility — Check voter eligibility */
router.post('/eligibility', validateBody(eligibilitySchema), eligibility);

module.exports = router;
