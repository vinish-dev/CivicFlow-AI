/**
 * server.js — CivicFlow AI Express Server Entry Point
 * Bootstraps middleware, routes, and starts the HTTP server.
 */

require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🗳️  CivicFlow AI backend running on http://localhost:${PORT}`);
});
