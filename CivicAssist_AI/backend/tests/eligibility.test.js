/**
 * tests/eligibility.test.js
 * Unit tests for the eligibility service.
 */

const { checkEligibility } = require('../services/eligibility.service');

describe('checkEligibility()', () => {
  test('eligible: adult Indian citizen', () => {
    const result = checkEligibility({ age: 25, isCitizen: true });
    expect(result.eligible).toBe(true);
    expect(result.steps.length).toBeGreaterThan(0);
  });

  test('ineligible: under 18', () => {
    const result = checkEligibility({ age: 16, isCitizen: true });
    expect(result.eligible).toBe(false);
    expect(result.reason).toMatch(/18/);
  });

  test('ineligible: non-citizen', () => {
    const result = checkEligibility({ age: 30, isCitizen: false });
    expect(result.eligible).toBe(false);
    expect(result.reason).toMatch(/citizen/i);
  });

  test('ineligible: criminal disqualification', () => {
    const result = checkEligibility({ age: 30, isCitizen: true, hasCriminalDisqualification: true });
    expect(result.eligible).toBe(false);
  });

  test('exactly 18: eligible', () => {
    const result = checkEligibility({ age: 18, isCitizen: true });
    expect(result.eligible).toBe(true);
  });
});
