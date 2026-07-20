// Curated knowledge base for the assistant. Matching is keyword-overlap
// based (see assistantMatch.service.js) — there's no LLM here, so answers
// are fixed text, not generated. Kept broad but not overly specific about
// individual real companies, since that's the kind of claim that goes stale
// or wrong fastest.

const KNOWLEDGE_BASE = [
  // --- Resume ---
  {
    id: "resume-ats",
    category: "Resume",
    keywords: ["ats", "resume score", "resume scan", "resume format", "applicant tracking"],
    question: "How do I make my resume ATS-friendly?",
    response:
      "Stick to a single-column layout with standard section headers (Education, Experience, Skills, Projects) — ATS parsers often fail on tables, columns, and graphics. Use a standard font, save as PDF (not an image-based scan), and avoid putting critical info in headers/footers, which some parsers skip entirely.",
  },
  {
    id: "resume-keywords",
    category: "Resume",
    keywords: ["keywords", "job description", "tailor resume", "match job"],
    question: "Should I tailor my resume for each job application?",
    response:
      "Yes — pull key skills and terms directly from the job description and make sure they appear in your resume (only if you genuinely have that skill). ATS systems and recruiters both scan for exact-phrase matches, so 'React.js' vs 'ReactJS' can matter more than it should.",
  },
  {
    id: "resume-bullets",
    category: "Resume",
    keywords: ["bullet points", "action verbs", "describe experience", "write experience"],
    question: "How should I write my experience bullet points?",
    response:
      "Start each bullet with a strong action verb (Built, Led, Optimized, Reduced) and, where possible, quantify the impact — 'Reduced page load time by 40%' is far stronger than 'Worked on performance'. Aim for one clear achievement per bullet, not a task list.",
  },
  {
    id: "resume-length",
    category: "Resume",
    keywords: ["resume length", "how long", "one page", "two pages"],
    question: "How long should my resume be?",
    response:
      "For students and early-career roles, one page is standard. Only go to two pages if you have substantial relevant experience — recruiters typically spend under 10 seconds on a first pass, so density and clarity matter more than length.",
  },
  {
    id: "resume-projects",
    category: "Resume",
    keywords: ["projects section", "which projects", "personal projects"],
    question: "Which projects should I include on my resume?",
    response:
      "Pick 2-3 projects that show range — ideally one that demonstrates a full-stack build, one that shows problem-solving depth, and skip anything that's a direct tutorial clone unless you added meaningful features on top of it. Always include a GitHub link.",
  },

  // --- Interview ---
  {
    id: "interview-star",
    category: "Interview",
    keywords: ["star method", "behavioral question", "tell me about a time"],
    question: "What is the STAR method for interview answers?",
    response:
      "STAR stands for Situation, Task, Action, Result. Briefly set the context (Situation/Task), explain specifically what YOU did (Action), and close with the outcome, ideally with a number or concrete result. Most 'tell me about a time...' questions expect this structure.",
  },
  {
    id: "interview-weakness",
    category: "Interview",
    keywords: ["biggest weakness", "weakness question"],
    question: "How do I answer 'what's your biggest weakness'?",
    response:
      "Pick something real, not a disguised strength ('I work too hard'). State the weakness plainly, then describe a concrete step you're taking to improve it — interviewers are gauging self-awareness, not looking for a flawless answer.",
  },
  {
    id: "interview-technical-prep",
    category: "Interview",
    keywords: ["technical interview", "prepare for technical", "coding interview"],
    question: "How do I prepare for a technical interview?",
    response:
      "Practice explaining your thought process out loud, not just solving the problem silently. Cover core DSA topics (arrays, strings, trees, graphs, DP), and for each project on your resume, be ready to explain the architecture and any tradeoffs you made — that's a very common follow-up.",
  },
  {
    id: "interview-questions-to-ask",
    category: "Interview",
    keywords: ["questions to ask interviewer", "ask at the end", "any questions for us"],
    question: "What questions should I ask the interviewer?",
    response:
      "Ask about the team's current challenges, what a typical first 90 days looks like, or how success is measured in the role. Avoid asking things easily found on the company website — it signals you didn't research beforehand.",
  },
  {
    id: "interview-nervous",
    category: "Interview",
    keywords: ["nervous", "anxiety", "calm down interview", "interview stress"],
    question: "How do I stay calm during interviews?",
    response:
      "Practice out loud beforehand, not just in your head — saying answers aloud a few times reduces the freeze-up effect. It's also fine to pause for a few seconds before answering; a short silence reads as thoughtful, not weak.",
  },

  // --- Role roadmaps (kept to well-established, stable industry knowledge) ---
  {
    id: "roadmap-frontend",
    category: "Roadmap",
    keywords: ["frontend roadmap", "frontend developer", "become frontend"],
    question: "What's a roadmap to become a frontend developer?",
    response:
      "1) HTML/CSS/JS fundamentals, 2) a framework like React (components, state, hooks), 3) styling approach (Tailwind or CSS-in-JS), 4) API integration with fetch/axios, 5) build tooling basics (Vite/Webpack), 6) a few real projects deployed live. Git and basic accessibility awareness matter throughout.",
  },
  {
    id: "roadmap-backend",
    category: "Roadmap",
    keywords: ["backend roadmap", "backend developer", "become backend"],
    question: "What's a roadmap to become a backend developer?",
    response:
      "1) A language + framework (Node/Express, Python/Django, or Java/Spring), 2) REST API design, 3) a database (SQL like PostgreSQL, or NoSQL like MongoDB), 4) authentication (JWT/OAuth), 5) basic system design (caching, load balancing concepts), 6) deployment basics (Docker, a cloud provider).",
  },
  {
    id: "roadmap-fullstack",
    category: "Roadmap",
    keywords: ["full stack roadmap", "fullstack developer", "become full stack"],
    question: "What's a roadmap to become a full-stack developer?",
    response:
      "Combine the frontend and backend paths — a common stack for students is the MERN stack (MongoDB, Express, React, Node). Build 2-3 complete projects end-to-end (auth, database, deployed frontend + backend) rather than many half-finished ones; that's what recruiters actually want to see.",
  },
  {
    id: "roadmap-data",
    category: "Roadmap",
    keywords: ["data analyst roadmap", "become data analyst", "data science roadmap"],
    question: "What's a roadmap to become a data analyst?",
    response:
      "1) SQL (genuinely non-negotiable), 2) Python with pandas/numpy, 3) data visualization (matplotlib/seaborn or a BI tool like Power BI/Tableau), 4) statistics fundamentals, 5) a couple of end-to-end projects using real public datasets, written up clearly with your findings.",
  },
  {
    id: "roadmap-devops",
    category: "Roadmap",
    keywords: ["devops roadmap", "become devops"],
    question: "What's a roadmap to get into DevOps?",
    response:
      "1) Linux fundamentals and shell scripting, 2) Git, 3) CI/CD concepts (GitHub Actions is a good accessible starting point), 4) containers (Docker), 5) basic cloud (AWS/GCP free tier), 6) infrastructure-as-code basics (Terraform) once comfortable with the fundamentals.",
  },

  // --- General placement prep ---
  {
    id: "general-aptitude",
    category: "General",
    keywords: ["aptitude test", "aptitude prep", "quantitative aptitude"],
    question: "How do I prepare for aptitude tests?",
    response:
      "Most campus aptitude rounds cover quantitative (percentages, profit/loss, time-speed-distance), logical reasoning, and verbal ability. Timed practice matters more than raw knowledge here — do timed mock sets so you build speed under pressure, not just accuracy.",
  },
  {
    id: "general-gd",
    category: "General",
    keywords: ["group discussion", "gd round", "gd tips"],
    question: "How do I do well in a group discussion round?",
    response:
      "Speak early (within the first couple of minutes) so you're not stuck trying to interject later, back up points with a reason or example, and actively listen — referencing someone else's point before adding yours shows collaboration, which is often weighted as much as the content itself.",
  },
  {
    id: "general-readiness",
    category: "General",
    keywords: ["placement readiness", "am i ready", "how ready"],
    question: "How do I know if I'm placement-ready?",
    response:
      "Check your readiness across four areas on this platform: resume ATS score, mock interview performance, coding consistency (streak + topic coverage), and whether your profile is complete. The Progress Analytics page pulls these together into one view.",
  },
];

const CATEGORIES = [...new Set(KNOWLEDGE_BASE.map((k) => k.category))];

module.exports = { KNOWLEDGE_BASE, CATEGORIES };
