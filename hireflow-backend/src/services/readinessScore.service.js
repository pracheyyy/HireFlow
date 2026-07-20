// Pure function — combines already-computed scores from the other three
// modules into one weighted readiness number. This is arithmetic, not a
// new AI judgment: each input (ATS score, interview score, coding activity)
// was itself already produced by a rule-based analyzer elsewhere.

const WEIGHTS = {
  resume: 0.25,
  interview: 0.25,
  coding: 0.25,
  profile: 0.25,
};

/**
 * Coding activity score: rewards volume with diminishing need past a
 * reasonable baseline. 25 problems solved reaches the cap — chosen as a
 * realistic "actively practicing" threshold for a student, not a hard
 * industry benchmark.
 */
function codingActivityScore(totalSolved) {
  return Math.min(100, Math.round((totalSolved / 25) * 100));
}

/**
 * @param {object} inputs
 * @param {number|null} inputs.resumeScore - latest ATS score (0-100) or null if no resume uploaded
 * @param {number|null} inputs.avgInterviewScore - average of past interview scores (0-100) or null if none taken
 * @param {number} inputs.totalSolved - total coding problems logged
 * @param {boolean} inputs.profileComplete - whether profile has skills/education filled in
 * @returns {{ overallScore: number, breakdown: object }}
 */
function computeReadinessScore({ resumeScore, avgInterviewScore, totalSolved, profileComplete }) {
  const codingScore = codingActivityScore(totalSolved);
  const profileScore = profileComplete ? 100 : 0;

  // Missing signals (no resume/interview yet) contribute 0, not "excluded" —
  // an incomplete profile should genuinely show a lower readiness score,
  // not have its denominator silently shrink.
  const breakdown = {
    resume: { score: resumeScore ?? 0, weight: WEIGHTS.resume, hasData: resumeScore !== null },
    interview: { score: avgInterviewScore ?? 0, weight: WEIGHTS.interview, hasData: avgInterviewScore !== null },
    coding: { score: codingScore, weight: WEIGHTS.coding, hasData: totalSolved > 0 },
    profile: { score: profileScore, weight: WEIGHTS.profile, hasData: profileComplete },
  };

  const overallScore = Math.round(
    Object.values(breakdown).reduce((sum, b) => sum + b.score * b.weight, 0)
  );

  return { overallScore, breakdown };
}

module.exports = { computeReadinessScore, codingActivityScore };
