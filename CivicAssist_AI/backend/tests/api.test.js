const request = require('supertest');

// Force mock mode for Gemini (no real API calls during tests)
process.env.GEMINI_API_KEY = 'your_gemini_api_key_here';

const app = require('../app');


describe('GET /api/health', () => {
  it('returns 200 with service name', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('CivicFlow AI');
  });
});

describe('POST /api/user/eligibility', () => {
  it('returns eligible for a 25-year-old citizen', async () => {
    const res = await request(app)
      .post('/api/user/eligibility')
      .send({ age: 25, isCitizen: true });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.eligible).toBe(true);
  });

  it('returns ineligible for a 16-year-old', async () => {
    const res = await request(app)
      .post('/api/user/eligibility')
      .send({ age: 16, isCitizen: true });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.eligible).toBe(false);
  });

  it('returns 400 for invalid age (string)', async () => {
    const res = await request(app)
      .post('/api/user/eligibility')
      .send({ age: 'abc' });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe('POST /api/ai/chat', () => {
  it('returns a response for a valid query', async () => {
    const res = await request(app)
      .post('/api/ai/chat')
      .send({ query: 'How do I vote in India?' });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(typeof res.body.response).toBe('string');
    expect(res.body.response.length).toBeGreaterThan(10);
  });

  it('returns 400 for an empty query', async () => {
    const res = await request(app)
      .post('/api/ai/chat')
      .send({ query: '' });
    expect(res.statusCode).toBe(400);
  });

  it('returns 400 for a missing query', async () => {
    const res = await request(app)
      .post('/api/ai/chat')
      .send({});
    expect(res.statusCode).toBe(400);
  });
});

describe('GET /api/checklist/:userId', () => {
  it('returns default checklist for a new user', async () => {
    const res = await request(app).get('/api/checklist/test-user-001');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.items)).toBe(true);
    expect(res.body.data.items.length).toBe(5);
  });
});
