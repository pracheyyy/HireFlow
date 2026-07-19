// Rule-based interview answer evaluator. No LLM involved — HR answers are
// scored on structure/specificity signals (STAR method markers, length,
// filler words), technical answers on keyword coverage against the
// question's expected terms, same approach as the resume analyzer.

const FILLER_WORDS = ["um", "uh", "like", "you know", "basically", "actually", "sort of", "kind of", "i guess"];

// Loose signals that an HR/behavioral answer follows STAR structure
// (Situation, Task, Action, Result) without requiring exact wording.
const STAR_SIGNALS = {
  situation: ["when i", "at my", "during", "while working", "in my previous", "at college", "in college", "at university"],
  action: ["i decided", "i took", "i worked", "i implemented", "i organized", "i created", "i built", "i led", "i reached out", "i asked"],
  result: ["as a result", "because of this", "this led to", "in the end", "eventually", "the outcome", "we were able to", "i learned", "i managed to"],
};

function countFillerWords(lowerText) {
  let count = 0;
  for (const filler of FILLER_WORDS) {
    const re = new RegExp(`\\b${filler}\\b`, "gi");
    const matches = lowerText.match(re);
    if (matches) count += matches.length;
  }
  return count;
}

function detectStarSignals(lowerText) {
  const found = {};
  for (const [stage, phrases] of Object.entries(STAR_SIGNALS)) {
    found[stage] = phrases.some((p) => lowerText.includes(p));
  }
  return found;
}

/**
 * Evaluates a single HR/behavioral answer.
 * Score out of 10, based on: length adequacy, STAR structure signals, filler word density.
 */
function evaluateHrAnswer(answerText) {
  const text = (answerText || "").trim();
  const lowerText = text.toLowerCase();
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  if (wordCount === 0) {
    return { score: 0, wordCount: 0, feedback: ["No answer provided."] };
  }

  const starSignals = detectStarSignals(lowerText);
  const starStagesHit = Object.values(starSignals).filter(Boolean).length;
  const fillerCount = countFillerWords(lowerText);

  let score = 0;
  const feedback = [];

  // Length: 0-4 points
  if (wordCount >= 40 && wordCount <= 200) {
    score += 4;
  } else if (wordCount >= 20) {
    score += 2;
    feedback.push("Try elaborating a bit more — aim for 40-150 words with a specific example.");
  } else {
    feedback.push("This answer is quite short. Interviewers want a specific example, not just a one-liner.");
  }

  // STAR structure: 0-4 points (roughly 1.3 per stage hit)
  score += Math.round((starStagesHit / 3) * 4);
  if (starStagesHit < 2) {
    feedback.push("Structure your answer with a clear situation, the action you took, and the result — the STAR method.");
  }

  // Filler words: 0-2 points
  if (fillerCount === 0) {
    score += 2;
  } else if (fillerCount <= 2) {
    score += 1;
    feedback.push("Minor filler words detected — try to reduce phrases like 'um' or 'basically'.");
  } else {
    feedback.push("Several filler words detected — practice pausing instead of using filler phrases.");
  }

  if (feedback.length === 0) feedback.push("Well-structured answer with a clear example and outcome.");

  return { score: Math.min(10, score), wordCount, starStagesHit, fillerCount, feedback };
}

/**
 * Evaluates a single technical answer against the question's expected keywords.
 * Score out of 10, based on: keyword coverage, length adequacy.
 */
function evaluateTechnicalAnswer(answerText, expectedKeywords = []) {
  const text = (answerText || "").trim();
  const lowerText = text.toLowerCase();
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  if (wordCount === 0) {
    return { score: 0, wordCount: 0, matchedKeywords: [], missedKeywords: expectedKeywords, feedback: ["No answer provided."] };
  }

  const matchedKeywords = expectedKeywords.filter((kw) => lowerText.includes(kw.toLowerCase()));
  const missedKeywords = expectedKeywords.filter((kw) => !lowerText.includes(kw.toLowerCase()));
  const coverage = expectedKeywords.length > 0 ? matchedKeywords.length / expectedKeywords.length : 0.5;

  let score = 0;
  const feedback = [];

  // Keyword coverage: 0-7 points
  score += Math.round(coverage * 7);
  if (coverage < 0.4) {
    feedback.push(`Your answer is missing some key concepts. Consider mentioning: ${missedKeywords.slice(0, 3).join(", ")}.`);
  }

  // Length: 0-3 points
  if (wordCount >= 30 && wordCount <= 220) {
    score += 3;
  } else if (wordCount >= 15) {
    score += 1;
    feedback.push("Consider explaining with a bit more depth — a brief example helps.");
  } else {
    feedback.push("This answer is too brief for a technical question — explain the 'why', not just the 'what'.");
  }

  if (feedback.length === 0) feedback.push("Strong technical answer covering the key concepts.");

  return { score: Math.min(10, score), wordCount, matchedKeywords, missedKeywords, feedback };
}

/**
 * Evaluates a full interview session (array of {question, answerText}).
 * Returns per-question results plus an overall 0-100 score.
 */
function evaluateInterview(answeredQuestions) {
  const results = answeredQuestions.map((q) => {
    const evaluation = q.type === "hr"
      ? evaluateHrAnswer(q.answerText)
      : evaluateTechnicalAnswer(q.answerText, q.expectedKeywords || []);

    return {
      questionId: q.id,
      question: q.question,
      type: q.type,
      topic: q.topic,
      answerText: q.answerText,
      ...evaluation,
    };
  });

  const totalScore = results.reduce((sum, r) => sum + r.score, 0);
  const maxScore = results.length * 10;
  const overallScore = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  return { results, overallScore };
}

module.exports = { evaluateHrAnswer, evaluateTechnicalAnswer, evaluateInterview };
