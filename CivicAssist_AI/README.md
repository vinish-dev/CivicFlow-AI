# 🗳️ CivicFlow AI

> An intelligent, AI-powered civic assistant that guides users through Indian election and civic processes step-by-step — from eligibility checks to casting their vote.

![CivicFlow AI](https://img.shields.io/badge/CivicFlow-AI-blue?style=for-the-badge&logo=react)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-20+-green?style=for-the-badge&logo=node.js)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **AI Assistant** | Powered by Google Gemini 2.0 Flash — accepts civic queries and returns step-by-step guidance |
| 💡 **Simplify Mode** | "Explain Simply" toggle for plain-language explanations |
| 👤 **Personalization** | Tailors responses based on age and first-time voter status |
| 🗺️ **Process Flow UI** | Visual election journey map from eligibility → registration → voting |
| ✅ **Smart Checklist** | Interactive progress tracker stored in Firebase Firestore |
| 📊 **Dashboard** | Progress percentage, step indicators, and next-action suggestions |
| 🌐 **Bilingual** | Full English and Hindi (हिंदी) language support |
| 🔊 **Text-to-Speech** | Web Speech API integration for accessible audio responses |
| 🔒 **Security** | Helmet, CORS, rate limiting, Zod validation, env-stored secrets |

---

## 🏗️ Architecture

```
CivicAssist_AI/
├── backend/                    # Node.js + Express API
│   ├── controllers/            # Route handlers (thin layer)
│   │   ├── ai.controller.js
│   │   ├── checklist.controller.js
│   │   └── user.controller.js
│   ├── services/               # Business logic
│   │   ├── gemini.service.js   # Gemini AI integration + caching
│   │   ├── firebase.service.js # Firestore admin SDK
│   │   ├── checklist.service.js
│   │   └── eligibility.service.js
│   ├── middleware/
│   │   ├── validate.middleware.js  # Zod schema validation
│   │   └── error.middleware.js     # Global error handler
│   ├── routes/
│   │   ├── ai.routes.js
│   │   ├── checklist.routes.js
│   │   └── user.routes.js
│   ├── tests/
│   │   ├── eligibility.test.js  # Unit tests
│   │   └── api.test.js          # Integration tests
│   ├── app.js                   # Express app config
│   └── server.js                # Server entry point
│
└── src/                        # React + Tailwind Frontend
    ├── components/
    │   ├── Navbar.jsx
    │   ├── AIChat.jsx
    │   ├── ProcessFlow.jsx
    │   ├── SmartChecklist.jsx
    │   ├── Dashboard.jsx
    │   └── UserProfileForm.jsx
    ├── pages/
    │   ├── HomePage.jsx
    │   ├── AssistantPage.jsx
    │   └── ChecklistPage.jsx
    ├── hooks/
    │   ├── useAIChat.js        # Chat state + debouncing
    │   ├── useChecklist.js     # Optimistic checklist updates
    │   └── useUserProfile.js   # localStorage + backend sync
    ├── services/
    │   ├── api.service.js      # Axios client + interceptors
    │   └── tts.service.js      # Web Speech API wrapper
    └── __tests__/
        └── App.test.jsx        # Frontend smoke tests
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/health` | Server health check | None |
| `POST` | `/api/ai/chat` | AI civic guidance | None |
| `POST` | `/api/user/eligibility` | Check voter eligibility | None |
| `POST` | `/api/user/profile` | Save user profile | None |
| `GET` | `/api/user/profile/:userId` | Get user profile | None |
| `GET` | `/api/checklist/:userId` | Get user's checklist | None |
| `PATCH` | `/api/checklist/:userId/item/:itemId` | Update checklist item | None |
| `DELETE` | `/api/checklist/:userId/reset` | Reset checklist | None |

### Example: AI Chat Request
```json
POST /api/ai/chat
{
  "query": "How do I register to vote?",
  "simplified": false,
  "userProfile": {
    "age": 22,
    "isFirstTimeVoter": true,
    "language": "en"
  }
}
```

### Example: Eligibility Check
```json
POST /api/user/eligibility
{
  "age": 25,
  "isCitizen": true,
  "hasCriminalDisqualification": false
}
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 20+
- npm 9+
- Google Gemini API Key ([Get one here](https://aistudio.google.com/app/apikey))
- Firebase Project ([Console](https://console.firebase.google.com))

### 1. Clone & Install

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend && npm install
```

### 2. Configure Environment Variables

**Backend** — copy and fill `backend/.env.example` → `backend/.env`:
```env
PORT=5000
GEMINI_API_KEY=your_actual_gemini_api_key
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
ALLOWED_ORIGIN=http://localhost:5173
```

**Frontend** — copy `.env.example` → `.env.local`:
```env
VITE_API_URL=
```
> Leave `VITE_API_URL` empty to use the Vite proxy (recommended for dev).

### 3. Run the Application

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# Server starts on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
npm run dev
# App opens on http://localhost:5173
```

### 4. Run Tests

```bash
# Backend tests (Jest)
cd backend && npm test

# Frontend tests (Vitest)
npm test
```

---

## 🔑 Google Services

### Gemini AI
- Model: `gemini-2.0-flash`
- Responses are cached in memory for 5 minutes to avoid redundant API calls
- Mock responses are served automatically when no API key is configured

### Firebase Firestore
- Stores user checklists and profiles
- Falls back to in-memory storage when Firebase credentials are not configured
- Collections: `checklists`, `users`

---

## 🛡️ Security Measures

- ✅ All secrets stored in `.env` files (never hardcoded)
- ✅ `helmet` for HTTP security headers
- ✅ Global rate limit: 100 requests / 15 min
- ✅ AI endpoint rate limit: 20 requests / 15 min
- ✅ Zod schema validation on all request bodies
- ✅ CORS restricted to configured origin
- ✅ Input length limits (500 chars max for queries)

---

## 🌐 Accessibility

- ✅ Text-to-speech using Web Speech API
- ✅ ARIA labels on all interactive elements
- ✅ Keyboard navigation support
- ✅ High contrast light theme
- ✅ Responsive layout (mobile-first)
- ✅ Bilingual: English + Hindi

---

## 📄 License

MIT — Free to use and modify.

---

*Built with ❤️ for Indian democracy. Your vote is your voice. 🇮🇳*
