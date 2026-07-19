// Rule-based resume analyzer. No external AI/LLM calls — every score and
// suggestion here is derived deterministically from the extracted text,
// so results are explainable and don't depend on any API key.

const SECTION_PATTERNS = {
  Education: /\b(education|academic background|qualification)\b/i,
  Experience: /\b(experience|employment|work history|internship)\b/i,
  Skills: /\b(skills|technical skills|competencies)\b/i,
  Projects: /\b(projects?|personal projects?)\b/i,
  Summary: /\b(summary|objective|profile)\b/i,
  Certifications: /\b(certifications?|certificates?)\b/i,
};

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const PHONE_REGEX = /(\+?\d{1,3}[\s-]?)?\(?\d{3,5}\)?[\s-]?\d{3,4}[\s-]?\d{3,4}/;
const BULLET_LINE_REGEX = /^[\s]*[•\-*▪◦‣]\s+/m;
const QUANTIFIED_REGEX = /\b\d+(\.\d+)?\s?(%|percent|x|k|K|million|thousand|users?|hours?|days?|projects?|members?)\b|\b\d+(\.\d+)?%/g;

const ACTION_VERBS = [
  "built", "developed", "designed", "implemented", "led", "managed", "created",
  "optimized", "improved", "launched", "achieved", "architected", "automated",
  "reduced", "increased", "deployed", "engineered", "streamlined", "delivered",
  "collaborated", "mentored", "researched", "analyzed", "integrated", "refactored",
  "resolved", "spearheaded", "coordinated", "presented", "trained",
];

// A broad set of common ATS-relevant keywords across tech roles.
// This is intentionally general — not tailored to one job description,
// since the person isn't pasting a target JD in this version.
const MASTER_KEYWORDS = [
  "javascript", "python", "java", "c++", "react", "node.js", "express",
  "mongodb", "sql", "git", "github", "rest api", "docker", "aws", "agile",
  "html", "css", "typescript", "data structures", "algorithms", "testing",
  "ci/cd", "linux", "problem solving", "communication", "teamwork",
  "leadership", "machine learning", "api", "database", "cloud",
];

function extractSections(text) {
  const found = [];
  const missing = [];
  for (const [name, pattern] of Object.entries(SECTION_PATTERNS)) {
    if (pattern.test(text)) found.push(name);
    else if (name !== "Summary" && name !== "Certifications") missing.push(name); // treat these two as optional
  }
  return { found, missing };
}

function countActionVerbs(lowerText) {
  const found = new Set();
  for (const verb of ACTION_VERBS) {
    // word boundary match so "led" doesn't match inside "scaled"
    const re = new RegExp(`\\b${verb}\\b`, "i");
    if (re.test(lowerText)) found.add(verb);
  }
  return found.size;
}

function countQuantified(text) {
  const matches = text.match(QUANTIFIED_REGEX);
  return matches ? matches.length : 0;
}

function keywordCoverage(lowerText) {
  const matched = MASTER_KEYWORDS.filter((kw) => lowerText.includes(kw));
  const missing = MASTER_KEYWORDS.filter((kw) => !lowerText.includes(kw));
  return { matched, missing };
}

function skillsNotInResume(lowerText, profileSkills = []) {
  return profileSkills.filter((skill) => !lowerText.includes(skill.toLowerCase()));
}

/**
 * @param {string} text - extracted resume text
 * @param {string[]} profileSkills - skills the user listed on their profile
 * @returns full analysis object ready to persist
 */
function analyzeResume(text, profileSkills = []) {
  const cleanText = text.replace(/\s+/g, " ").trim();
  const lowerText = cleanText.toLowerCase();
  const wordCount = cleanText.split(/\s+/).filter(Boolean).length;

  const hasEmail = EMAIL_REGEX.test(text);
  const hasPhone = PHONE_REGEX.test(text);
  const { found: sectionsFound, missing: sectionsMissing } = extractSections(text);
  const hasBullets = BULLET_LINE_REGEX.test(text);
  const actionVerbCount = countActionVerbs(lowerText);
  const quantifiedCount = countQuantified(text);
  const { matched: matchedKeywords, missing: missingKeywords } = keywordCoverage(lowerText);
  const profileSkillsNotInResume = skillsNotInResume(lowerText, profileSkills);

  // --- Scoring rubric (100 points total) ---
  const scoreBreakdown = {
    contactInfo: (hasEmail ? 5 : 0) + (hasPhone ? 5 : 0), // /10
    sectionsCoverage: Math.min(20, sectionsFound.filter((s) => ["Education", "Experience", "Skills", "Projects"].includes(s)).length * 5), // /20
    lengthScore: wordCount >= 250 && wordCount <= 900 ? 10 : wordCount > 0 ? 5 : 0, // /10
    bulletUsage: hasBullets ? 10 : 0, // /10
    actionVerbs: Math.min(15, actionVerbCount * 2), // /15 (needs ~8 distinct verbs for full marks)
    quantifiedAchievements: Math.min(15, quantifiedCount * 3), // /15 (needs 5 for full marks)
    keywordCoverage: Math.round((matchedKeywords.length / MASTER_KEYWORDS.length) * 20), // /20
  };

  const atsScore = Object.values(scoreBreakdown).reduce((sum, v) => sum + v, 0);

  // --- Suggestions, generated from whichever rubric areas scored low ---
  const suggestions = [];
  if (!hasEmail) suggestions.push("Add a clearly visible email address near the top of your resume.");
  if (!hasPhone) suggestions.push("Add a phone number so recruiters can reach you directly.");
  if (sectionsMissing.length > 0) {
    suggestions.push(`Add a dedicated "${sectionsMissing[0]}" section — ATS systems specifically look for standard section headers.`);
  }
  if (!hasBullets) suggestions.push("Use bullet points for your experience and projects instead of paragraphs — they're easier for both ATS and recruiters to scan.");
  if (actionVerbCount < 5) suggestions.push("Start more bullet points with strong action verbs (e.g. 'Built', 'Optimized', 'Led') instead of passive phrases.");
  if (quantifiedCount < 3) suggestions.push("Quantify your impact with numbers where possible — e.g. 'reduced load time by 40%' instead of 'improved performance'.");
  if (wordCount < 250) suggestions.push("Your resume looks quite short — consider expanding on your projects and experience with more detail.");
  if (wordCount > 900) suggestions.push("Your resume is on the longer side — aim to keep it to 1-2 pages by trimming less relevant details.");
  if (missingKeywords.length > 0) {
    suggestions.push(`Consider adding relevant keywords if applicable: ${missingKeywords.slice(0, 6).join(", ")}.`);
  }
  if (profileSkillsNotInResume.length > 0) {
    suggestions.push(`You listed these skills on your profile but they don't appear in your resume: ${profileSkillsNotInResume.slice(0, 5).join(", ")}.`);
  }
  if (suggestions.length === 0) {
    suggestions.push("Solid resume — the fundamentals are all in place. Focus on tailoring keywords to each specific job description.");
  }

  return {
    wordCount,
    atsScore,
    scoreBreakdown,
    sectionsFound,
    sectionsMissing,
    matchedKeywords,
    missingKeywords,
    profileSkillsNotInResume,
    suggestions,
    hasEmail,
    hasPhone,
    actionVerbCount,
    quantifiedCount,
  };
}

module.exports = { analyzeResume };
