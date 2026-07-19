// Curated question bank for the rule-based mock interview module.
// Each technical question carries `expectedKeywords` — terms a solid answer
// would plausibly mention — used for keyword-coverage scoring, the same
// approach as the resume analyzer. HR questions are scored on structure
// (STAR-method signals) and specificity instead of fixed keywords.

const HR_QUESTIONS = [
  {
    id: "hr-1",
    type: "hr",
    topic: "behavioral",
    question: "Tell me about a time you faced a conflict while working in a team. How did you handle it?",
  },
  {
    id: "hr-2",
    type: "hr",
    topic: "behavioral",
    question: "Describe a project you're proud of. What was your specific contribution?",
  },
  {
    id: "hr-3",
    type: "hr",
    topic: "behavioral",
    question: "Tell me about a time you failed at something. What did you learn from it?",
  },
  {
    id: "hr-4",
    type: "hr",
    topic: "motivation",
    question: "Why do you want to work at this company, and why this role specifically?",
  },
  {
    id: "hr-5",
    type: "hr",
    topic: "behavioral",
    question: "Describe a situation where you had to learn something new quickly to complete a task.",
  },
  {
    id: "hr-6",
    type: "hr",
    topic: "self-assessment",
    question: "What do you consider your biggest weakness, and how are you working on it?",
  },
  {
    id: "hr-7",
    type: "hr",
    topic: "behavioral",
    question: "Tell me about a time you had to manage multiple deadlines at once. How did you prioritize?",
  },
  {
    id: "hr-8",
    type: "hr",
    topic: "motivation",
    question: "Where do you see yourself in the next few years?",
  },
];

const TECHNICAL_QUESTIONS = [
  // JavaScript
  {
    id: "tech-js-1",
    type: "technical",
    topic: "javascript",
    question: "Explain the difference between let, const, and var in JavaScript.",
    expectedKeywords: ["scope", "block", "hoisting", "reassign", "function scope", "temporal dead zone", "redeclare"],
  },
  {
    id: "tech-js-2",
    type: "technical",
    topic: "javascript",
    question: "What is a closure in JavaScript? Give an example of where it's useful.",
    expectedKeywords: ["scope", "function", "lexical", "variable", "outer function", "memory", "private"],
  },
  {
    id: "tech-js-3",
    type: "technical",
    topic: "javascript",
    question: "Explain the event loop and how asynchronous code executes in JavaScript.",
    expectedKeywords: ["call stack", "queue", "callback", "promise", "microtask", "macrotask", "async", "event loop"],
  },
  // React
  {
    id: "tech-react-1",
    type: "technical",
    topic: "react",
    question: "What is the virtual DOM and why does React use it?",
    expectedKeywords: ["virtual dom", "diffing", "reconciliation", "performance", "re-render", "real dom"],
  },
  {
    id: "tech-react-2",
    type: "technical",
    topic: "react",
    question: "Explain the difference between props and state in React.",
    expectedKeywords: ["immutable", "parent", "component", "mutable", "re-render", "data flow", "internal"],
  },
  {
    id: "tech-react-3",
    type: "technical",
    topic: "react",
    question: "What are React hooks, and why were they introduced?",
    expectedKeywords: ["usestate", "useeffect", "functional component", "class component", "lifecycle", "reuse", "logic"],
  },
  // Node.js / backend
  {
    id: "tech-node-1",
    type: "technical",
    topic: "node.js",
    question: "How does Node.js handle concurrency despite being single-threaded?",
    expectedKeywords: ["event loop", "non-blocking", "asynchronous", "callback", "libuv", "thread pool", "i/o"],
  },
  {
    id: "tech-node-2",
    type: "technical",
    topic: "node.js",
    question: "What is middleware in Express.js, and how does it work?",
    expectedKeywords: ["request", "response", "next", "function", "pipeline", "chain", "route"],
  },
  // DSA
  {
    id: "tech-dsa-1",
    type: "technical",
    topic: "dsa",
    question: "Explain the difference between an array and a linked list, including time complexity tradeoffs.",
    expectedKeywords: ["contiguous", "pointer", "o(1)", "o(n)", "insertion", "memory", "index", "traversal"],
  },
  {
    id: "tech-dsa-2",
    type: "technical",
    topic: "dsa",
    question: "What is a hash map, and how does it achieve average O(1) lookup time?",
    expectedKeywords: ["hash function", "bucket", "collision", "key", "value", "index", "o(1)"],
  },
  {
    id: "tech-dsa-3",
    type: "technical",
    topic: "dsa",
    question: "Explain the difference between BFS and DFS, and when you'd use each.",
    expectedKeywords: ["queue", "stack", "recursion", "level", "shortest path", "graph", "tree", "traversal"],
  },
  // System design (kept simple for undergrad level)
  {
    id: "tech-sysdesign-1",
    type: "technical",
    topic: "system-design",
    question: "How would you design a simple URL shortening service like bit.ly?",
    expectedKeywords: ["hash", "database", "unique", "redirect", "collision", "encode", "key"],
  },
  {
    id: "tech-sysdesign-2",
    type: "technical",
    topic: "system-design",
    question: "What's the difference between SQL and NoSQL databases, and when would you choose one over the other?",
    expectedKeywords: ["schema", "relational", "scalability", "structured", "flexible", "joins", "document"],
  },
];

const ALL_QUESTIONS = [...HR_QUESTIONS, ...TECHNICAL_QUESTIONS];

const TOPICS = [...new Set(TECHNICAL_QUESTIONS.map((q) => q.topic))];

module.exports = { HR_QUESTIONS, TECHNICAL_QUESTIONS, ALL_QUESTIONS, TOPICS };
