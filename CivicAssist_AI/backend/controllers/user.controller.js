/**
 * controllers/user.controller.js
 * Handles user profile storage and eligibility checking.
 */

const { checkEligibility } = require('../services/eligibility.service');
const { getDb } = require('../services/firebase.service');

// In-memory user store for demo mode
const memoryUsers = new Map();

/**
 * POST /api/user/profile
 * Body: { userId, age, isFirstTimeVoter, language }
 */
async function saveProfile(req, res, next) {
  try {
    const { userId, age, isFirstTimeVoter = false, language = 'en' } = req.body;
    const profile = { userId, age, isFirstTimeVoter, language, updatedAt: new Date().toISOString() };

    const db = getDb();
    if (db) {
      await db.collection('users').doc(userId).set(profile, { merge: true });
    } else {
      memoryUsers.set(userId, profile);
    }

    res.json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/user/profile/:userId
 */
async function getProfile(req, res, next) {
  try {
    const { userId } = req.params;
    const db = getDb();

    let profile = null;
    if (db) {
      const doc = await db.collection('users').doc(userId).get();
      profile = doc.exists ? doc.data() : null;
    } else {
      profile = memoryUsers.get(userId) || null;
    }

    if (!profile) {
      return res.status(404).json({ success: false, error: 'User profile not found' });
    }

    res.json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/user/eligibility
 * Body: { age, isCitizen, hasCriminalDisqualification }
 */
async function eligibility(req, res, next) {
  try {
    const { age, isCitizen = true, hasCriminalDisqualification = false } = req.body;
    const result = checkEligibility({ age: Number(age), isCitizen, hasCriminalDisqualification });
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

module.exports = { saveProfile, getProfile, eligibility };
