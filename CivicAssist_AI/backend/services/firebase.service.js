/**
 * services/firebase.service.js
 * Initializes Firebase Admin SDK using environment variables.
 * Exports a Firestore db instance for use across the backend.
 */

const admin = require('firebase-admin');

let db = null;

/**
 * Returns a Firestore db instance (singleton pattern).
 * Skips initialization in test environment if credentials are missing.
 */
function getDb() {
  if (db) return db;

  // Skip real Firebase in test/demo mode when credentials aren't set
  if (!process.env.FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID === 'your_firebase_project_id') {
    console.warn('⚠️  Firebase credentials not set. Running in mock mode — data will not persist.');
    return null;
  }

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Replace escaped newlines in private key (common issue with .env files)
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }

  db = admin.firestore();
  return db;
}

module.exports = { getDb };
