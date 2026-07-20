// Simple keyword-overlap scoring, same family of approach as the resume
// and interview analyzers. Not semantic search — literal keyword/phrase
// matching against each KB entry's curated keyword list.

const STOPWORDS = new Set([
  "a", "an", "the", "is", "are", "do", "does", "how", "what", "when", "where",
  "why", "should", "i", "my", "me", "to", "for", "of", "in", "on", "and",
  "or", "can", "could", "would", "get", "with", "about", "you",
]);

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));
}

/**
 * @param {string} query - the user's typed message
 * @param {object[]} kb - knowledge base entries
 * @returns {{ match: object|null, confidence: number, alternatives: object[] }}
 */
function matchQuery(query, kb) {
  const queryLower = query.toLowerCase();
  const queryTokens = tokenize(query);

  const scored = kb.map((entry) => {
    let score = 0;

    for (const keyword of entry.keywords) {
      if (queryLower.includes(keyword.toLowerCase())) {
        // Multi-word phrase match is a much stronger signal than a single token
        score += keyword.includes(" ") ? 3 : 1.5;
      }
    }

    const questionTokens = tokenize(entry.question);
    const overlap = queryTokens.filter((t) => questionTokens.includes(t)).length;
    score += overlap * 0.5;

    return { entry, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const top = scored[0];
  const CONFIDENCE_THRESHOLD = 1.5;

  if (!top || top.score < CONFIDENCE_THRESHOLD) {
    return {
      match: null,
      confidence: 0,
      alternatives: scored.slice(0, 3).map((s) => s.entry),
    };
  }

  return {
    match: top.entry,
    confidence: Math.min(1, top.score / 6), // rough normalization, not a precise probability
    alternatives: scored.slice(1, 3).map((s) => s.entry),
  };
}

module.exports = { matchQuery, tokenize };
