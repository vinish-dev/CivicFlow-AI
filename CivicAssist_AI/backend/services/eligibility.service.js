/**
 * services/eligibility.service.js
 * Deterministic eligibility checking logic (no AI needed).
 */

/**
 * Checks if a user is eligible to vote based on Indian election law.
 * @param {object} params - { age, isCitizen, hasCriminalDisqualification }
 * @returns {{ eligible: boolean, reason: string, steps: string[] }}
 */
function checkEligibility({ age, isCitizen = true, hasCriminalDisqualification = false }) {
  const steps = [];
  let eligible = true;
  let reason = '';

  // Rule 1: Must be 18 or older
  if (typeof age !== 'number' || age < 18) {
    eligible = false;
    reason = age < 18
      ? `You must be at least 18 years old to vote. You need ${18 - age} more year(s).`
      : 'Invalid age provided.';
  }

  // Rule 2: Must be an Indian citizen
  if (!isCitizen) {
    eligible = false;
    reason = 'Only Indian citizens are eligible to vote.';
  }

  // Rule 3: No criminal disqualification
  if (hasCriminalDisqualification) {
    eligible = false;
    reason = 'Voters disqualified under election law cannot vote.';
  }

  if (eligible) {
    reason = `Great news! You appear to be eligible to vote in Indian elections.`;
    steps.push(
      'Ensure you are registered on the electoral roll of your constituency.',
      'Carry valid photo ID on election day (Voter ID / EPIC card preferred).',
      'Check your polling booth location at voterportal.eci.gov.in.',
      'Vote on election day — polling hours are typically 7 AM to 6 PM.'
    );
  } else {
    steps.push(
      'Review the eligibility criteria at eci.gov.in.',
      'Contact the Election Commission helpline at 1950 for guidance.',
      'Check back when you meet all eligibility requirements.'
    );
  }

  return { eligible, reason, steps };
}

module.exports = { checkEligibility };
