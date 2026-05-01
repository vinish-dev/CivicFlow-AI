/**
 * services/gemini.service.js
 * Wraps the Google Gemini API with caching and structured prompts.
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

// ─── In-memory response cache (keyed by prompt fingerprint) ──────────────────
const responseCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Generates a cache key from query params.
 * @param {string} query
 * @param {object} context
 * @returns {string}
 */
function buildCacheKey(query, context) {
  return JSON.stringify({ query: query.toLowerCase().trim(), context });
}

/**
 * Builds a structured, personalized system prompt for Gemini.
 * @param {object} userProfile - { age, isFirstTimeVoter, language }
 * @returns {string}
 */
function buildSystemPrompt(userProfile = {}) {
  const { age, isFirstTimeVoter, language = 'en' } = userProfile;
  const langInstruction = language === 'hi'
    ? 'IMPORTANT: Respond entirely in Hindi (Devanagari script).'
    : 'Respond in clear, simple English.';

  const personalization = [];
  if (age) personalization.push(`The user is ${age} years old.`);
  if (isFirstTimeVoter) personalization.push('This is their first time voting — be extra encouraging and detailed.');

  return `You are CivicFlow AI, a friendly and knowledgeable civic assistant specializing in Indian election processes.
Your role is to help citizens understand and complete election-related tasks step by step.
${langInstruction}
${personalization.length > 0 ? personalization.join(' ') : ''}

Guidelines:
- Provide accurate, actionable step-by-step guidance
- Use simple, clear language (avoid jargon)
- Format responses with numbered steps when appropriate
- Be encouraging and supportive
- If asked to explain simply, use very basic language, analogies, and examples
- Always end with an encouraging note about civic participation`;
}

/**
 * Calls Gemini API to answer a civic query.
 * @param {string} query - User's question
 * @param {object} options - { userProfile, simplified }
 * @returns {Promise<string>} - AI response text
 */
async function getAIResponse(query, options = {}) {
  const { userProfile = {}, simplified = false } = options;

  const cacheKey = buildCacheKey(query, { userProfile, simplified });

  // Return cached response if still fresh
  const cached = responseCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.text;
  }

  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    // Return a mock response for demo purposes
    return getMockResponse(query, simplified);
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const systemPrompt = buildSystemPrompt(userProfile);
  const userMessage = simplified
    ? `Please explain this in very simple terms, as if explaining to a child: ${query}`
    : query;

  const result = await model.generateContent([
    { text: systemPrompt },
    { text: userMessage },
  ]);

  const text = result.response.text();

  // Cache the result
  responseCache.set(cacheKey, { text, timestamp: Date.now() });

  return text;
}

/**
 * Returns a structured mock response for demo/testing without a real API key.
 * @param {string} query
 * @param {boolean} simplified
 * @returns {string}
 */
function getMockResponse(query, simplified) {
  const lq = query.toLowerCase();

  if (lq.includes('vote') || lq.includes('voting')) {
    return simplified
      ? `Voting is how you choose your leaders! Here's how:\n1. Go to your polling booth on election day\n2. Show your Voter ID card\n3. Get your finger marked with ink\n4. Press the button next to your chosen candidate on the EVM\n5. You're done! 🎉`
      : `**How to Vote in India — Step by Step:**\n\n1. **Find your polling booth** — Check your Voter ID card or visit voterportal.eci.gov.in\n2. **Carry valid ID** — Voter ID (EPIC card) is preferred; alternatives include Aadhaar, Passport, etc.\n3. **Arrive at the booth** — Queue up during polling hours (usually 7 AM – 6 PM)\n4. **Verification** — Officers will verify your name in the electoral roll\n5. **Biometric verification** — Your finger will be marked with indelible ink\n6. **Cast your vote** — Press the button on the EVM next to your preferred candidate\n7. **VVPAT slip** — A slip will appear briefly for verification\n\nYour vote matters! Every vote counts in a democracy. 🗳️`;
  }

  if (lq.includes('register') || lq.includes('registration')) {
    return `**Voter Registration in India — Step by Step:**\n\n1. **Check eligibility** — Must be 18+ years old and an Indian citizen\n2. **Visit voterportal.eci.gov.in** — The official Election Commission portal\n3. **Fill Form 6** — New voter registration form\n4. **Upload documents** — Age proof (birth certificate/Aadhaar) + address proof\n5. **Submit the form** — Online submission is quickest\n6. **Track status** — Use the portal to track your application\n7. **Receive EPIC card** — Your Voter ID will be sent to your address\n\nThe entire process typically takes 4-6 weeks. 📋`;
  }

  if (lq.includes('eligib')) {
    return `**Voter Eligibility in India:**\n\n✅ You are eligible to vote if:\n1. You are an **Indian citizen**\n2. You are **18 years or older** on the qualifying date (January 1st of the year)\n3. You are **ordinarily resident** at the address in your constituency\n4. Your name is on the **electoral roll** of that constituency\n\n❌ You are NOT eligible if:\n- You are of unsound mind (declared by court)\n- You are disqualified under any law related to elections\n\nCheck your eligibility at voterportal.eci.gov.in 🏛️`;
  }

  return `**CivicFlow AI — Demo Mode**\n\nThank you for your question about: "${query}"\n\nTo get personalized AI responses, please configure your Gemini API key in the backend .env file.\n\nMeanwhile, here are key civic resources:\n- **Voter Portal**: voterportal.eci.gov.in\n- **ECI Official**: eci.gov.in\n- **Helpline**: 1950 (National Voter Helpline)\n\nRemember: Your participation in democracy makes India stronger! 🇮🇳`;
}

module.exports = { getAIResponse };
