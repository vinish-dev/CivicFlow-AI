/**
 * services/checklist.service.js
 * Business logic for user checklist CRUD operations.
 * Falls back to in-memory store when Firebase is not configured.
 */

const { getDb } = require('./firebase.service');

// ─── In-memory fallback store (for demo/dev mode) ─────────────────────────
const memoryStore = new Map();

const COLLECTION = 'checklists';

/**
 * Gets the checklist for a user.
 * @param {string} userId
 * @returns {Promise<object>} checklist data
 */
async function getChecklist(userId) {
  const db = getDb();

  if (!db) {
    return memoryStore.get(userId) || { userId, items: getDefaultItems(), updatedAt: new Date().toISOString() };
  }

  const doc = await db.collection(COLLECTION).doc(userId).get();
  if (!doc.exists) {
    return { userId, items: getDefaultItems(), updatedAt: new Date().toISOString() };
  }
  return doc.data();
}

/**
 * Updates a single checklist item's completion status.
 * @param {string} userId
 * @param {string} itemId
 * @param {boolean} completed
 * @returns {Promise<object>} updated checklist
 */
async function updateChecklistItem(userId, itemId, completed) {
  const db = getDb();
  const existing = await getChecklist(userId);

  const updatedItems = existing.items.map((item) =>
    item.id === itemId ? { ...item, completed } : item
  );

  const updated = { userId, items: updatedItems, updatedAt: new Date().toISOString() };

  if (!db) {
    memoryStore.set(userId, updated);
    return updated;
  }

  await db.collection(COLLECTION).doc(userId).set(updated, { merge: true });
  return updated;
}

/**
 * Resets all checklist items for a user.
 * @param {string} userId
 * @returns {Promise<object>}
 */
async function resetChecklist(userId) {
  const db = getDb();
  const reset = { userId, items: getDefaultItems(), updatedAt: new Date().toISOString() };

  if (!db) {
    memoryStore.set(userId, reset);
    return reset;
  }

  await db.collection(COLLECTION).doc(userId).set(reset);
  return reset;
}

/**
 * Returns the default election process checklist items.
 * @returns {Array}
 */
function getDefaultItems() {
  return [
    { id: 'eligibility', label: 'Check Eligibility', labelHi: 'पात्रता जांचें', completed: false, step: 1 },
    { id: 'registration', label: 'Register to Vote', labelHi: 'मतदाता पंजीकरण करें', completed: false, step: 2 },
    { id: 'voter-id', label: 'Get Voter ID Card', labelHi: 'मतदाता पहचान पत्र प्राप्त करें', completed: false, step: 3 },
    { id: 'polling-booth', label: 'Find Your Polling Booth', labelHi: 'मतदान केंद्र खोजें', completed: false, step: 4 },
    { id: 'vote', label: 'Cast Your Vote', labelHi: 'मतदान करें', completed: false, step: 5 },
  ];
}

module.exports = { getChecklist, updateChecklistItem, resetChecklist };
