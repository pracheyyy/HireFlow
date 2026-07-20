// Pure functions operating on plain date/entry arrays — no Mongoose here —
// so the streak math can be unit-tested directly without a database.

const DAY_MS = 24 * 60 * 60 * 1000;

const toDateKey = (date) => {
  const d = new Date(date);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
};

/**
 * @param {Date[]} solvedDates - one Date per entry (duplicates on the same day are fine)
 * @returns {{ currentStreak: number, longestStreak: number }}
 */
function computeStreaks(solvedDates) {
  if (!solvedDates || solvedDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const uniqueDayKeys = [...new Set(solvedDates.map(toDateKey))].sort(); // ascending "YYYY-MM-DD"
  const dayTimestamps = uniqueDayKeys.map((k) => new Date(k + "T00:00:00Z").getTime());

  // Longest streak: scan for consecutive-day runs
  let longestStreak = 1;
  let run = 1;
  for (let i = 1; i < dayTimestamps.length; i++) {
    const diffDays = Math.round((dayTimestamps[i] - dayTimestamps[i - 1]) / DAY_MS);
    if (diffDays === 1) {
      run += 1;
    } else {
      run = 1;
    }
    longestStreak = Math.max(longestStreak, run);
  }

  // Current streak: walk backward from today, allow "yesterday" as the most
  // recent day if nothing's logged yet today, otherwise streak is broken.
  const todayKey = toDateKey(new Date());
  const todayTime = new Date(todayKey + "T00:00:00Z").getTime();
  const daySet = new Set(dayTimestamps);

  let currentStreak = 0;
  let cursor = daySet.has(todayTime) ? todayTime : todayTime - DAY_MS;
  while (daySet.has(cursor)) {
    currentStreak += 1;
    cursor -= DAY_MS;
  }

  return { currentStreak, longestStreak };
}

/**
 * @param {{solvedAt: Date}[]} entries
 * @param {number} days - how many days back to include (default 90)
 * @returns {{date: string, count: number}[]} oldest first
 */
function buildHeatmap(entries, days = 90) {
  const counts = {};
  for (const e of entries) {
    const key = toDateKey(e.solvedAt);
    counts[key] = (counts[key] || 0) + 1;
  }

  const result = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today.getTime() - i * DAY_MS);
    const key = toDateKey(d);
    result.push({ date: key, count: counts[key] || 0 });
  }
  return result;
}

function groupByField(entries, field) {
  const counts = {};
  for (const e of entries) {
    const key = e[field] || "Other";
    counts[key] = (counts[key] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([key, count]) => ({ [field]: key, count }))
    .sort((a, b) => b.count - a.count);
}

function todayCount(entries) {
  const todayKey = toDateKey(new Date());
  return entries.filter((e) => toDateKey(e.solvedAt) === todayKey).length;
}

module.exports = { computeStreaks, buildHeatmap, groupByField, todayCount, toDateKey };
