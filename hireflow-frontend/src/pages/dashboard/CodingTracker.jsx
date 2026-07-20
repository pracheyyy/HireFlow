import { useState, useEffect } from "react";
import { Code2, Flame, Trophy, Target, Plus, Trash2, Loader2 } from "lucide-react";
import { createEntry, listEntries, deleteEntry, getStats } from "../../api/coding.api";

const PLATFORMS = ["LeetCode", "CodeChef", "Codeforces", "HackerRank", "GeeksforGeeks", "Other"];
const TOPICS = [
  "Arrays", "Strings", "Linked List", "Stacks & Queues", "Trees", "Graphs",
  "Dynamic Programming", "Recursion & Backtracking", "Sorting & Searching",
  "Greedy", "Hashing", "Bit Manipulation", "Math", "Other",
];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];

const heatColor = (count) => {
  if (count === 0) return "#eef1f7";
  if (count === 1) return "#c3d7fb";
  if (count === 2) return "#8fb4f7";
  if (count <= 4) return "#5b8def";
  return "var(--brand-600)";
};

export default function CodingTracker() {
  const [entries, setEntries] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ title: "", platform: "LeetCode", topic: "Arrays", difficulty: "Easy" });

  const refresh = () => {
    Promise.all([listEntries(), getStats()])
      .then(([e, s]) => { setEntries(e); setStats(s); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(refresh, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setError("");
    setSaving(true);
    try {
      await createEntry(form);
      setForm({ ...form, title: "" });
      refresh();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't log that problem.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteEntry(id);
      refresh();
    } catch {
      // silently ignore — entry list will just not update
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ width: 48, height: 48, borderRadius: 13, background: "linear-gradient(135deg, #eaf1fd, #dbe7fb)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand-600)", marginBottom: 16 }}>
          <Code2 size={22} />
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Coding Progress Tracker</h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", maxWidth: 560, lineHeight: 1.6 }}>
          Log problems as you solve them to track your streak, topic coverage, and daily consistency.
        </p>
      </div>

      {loading ? (
        <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Loading...</p>
      ) : (
        <>
          {/* Stat cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 20 }}>
            <StatCard icon={Flame} label="Current streak" value={`${stats.currentStreak} day${stats.currentStreak === 1 ? "" : "s"}`} accent />
            <StatCard icon={Trophy} label="Longest streak" value={`${stats.longestStreak} day${stats.longestStreak === 1 ? "" : "s"}`} />
            <StatCard icon={Target} label="Solved today" value={stats.solvedToday} />
            <StatCard icon={Code2} label="Total solved" value={stats.totalSolved} />
          </div>

          {/* Heatmap */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 20, marginBottom: 20, overflowX: "auto" }}>
            <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Last 90 days</p>
            <div style={{ display: "grid", gridTemplateRows: "repeat(7, 12px)", gridAutoFlow: "column", gap: 3, width: "max-content" }}>
              {stats.heatmap.map((d) => (
                <div
                  key={d.date}
                  title={`${d.date}: ${d.count} solved`}
                  style={{ width: 12, height: 12, borderRadius: 3, background: heatColor(d.count) }}
                />
              ))}
            </div>
          </div>

          {/* Log form + breakdowns */}
          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 16, marginBottom: 20 }}>
            <form onSubmit={handleAdd} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Log a solved problem</p>
              {error && <p style={{ color: "#dc2626", fontSize: 12.5, marginBottom: 10 }}>{error}</p>}
              <input
                className="ct-input"
                placeholder="Problem title (e.g. Two Sum)"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                style={{ marginBottom: 10 }}
              />
              <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                <select className="ct-input" style={{ flex: 1 }} value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}>
                  {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
                <select className="ct-input" style={{ flex: 1 }} value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
                  {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <select className="ct-input" style={{ marginBottom: 14, width: "100%" }} value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}>
                {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <button type="submit" disabled={saving} style={submitBtnStyle}>
                {saving ? <Loader2 size={15} className="hf-spin" /> : <><Plus size={15} /> Log problem</>}
              </button>
              <style>{`.hf-spin { animation: hf-spin-anim 0.8s linear infinite; } @keyframes hf-spin-anim { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } .ct-input { background: #f2f4f7; border: 1px solid transparent; border-radius: 10px; padding: 10px 12px; font-size: 13px; color: var(--text-primary); outline: none; font-family: var(--font-body); width: 100%; }`}</style>
            </form>

            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Topic breakdown</p>
              {stats.topicBreakdown.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {stats.topicBreakdown.slice(0, 6).map(({ topic, count }) => (
                    <div key={topic}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                        <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{topic}</span>
                        <span style={{ fontSize: 12, fontWeight: 600 }}>{count}</span>
                      </div>
                      <div style={{ height: 5, background: "#eef1f7", borderRadius: 999, overflow: "hidden" }}>
                        <div style={{ width: `${(count / stats.totalSolved) * 100}%`, height: "100%", background: "var(--brand-gradient)", borderRadius: 999 }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: 12.5, color: "var(--text-muted)" }}>Log a few problems to see your topic breakdown.</p>
              )}
            </div>
          </div>

          {/* Recent entries */}
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Recent activity</h2>
            {entries.length === 0 ? (
              <p style={{ fontSize: 13, color: "var(--text-muted)" }}>No problems logged yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {entries.slice(0, 15).map((e) => (
                  <div key={e._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "10px 14px" }}>
                    <div>
                      <p style={{ fontSize: 12.5, fontWeight: 600 }}>{e.title}</p>
                      <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
                        {e.platform} · {e.topic} · {e.difficulty} · {new Date(e.solvedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button onClick={() => handleDelete(e._id)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: 4 }}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div style={{ background: accent ? "var(--brand-gradient)" : "var(--surface)", border: accent ? "none" : "1px solid var(--border)", borderRadius: 14, padding: 16 }}>
      <Icon size={17} color={accent ? "#fff" : "var(--brand-600)"} style={{ marginBottom: 8 }} />
      <p style={{ fontSize: 18, fontWeight: 700, fontFamily: "var(--font-heading)", color: accent ? "#fff" : "var(--text-primary)" }}>{value}</p>
      <p style={{ fontSize: 11.5, color: accent ? "#dbe7fb" : "var(--text-muted)" }}>{label}</p>
    </div>
  );
}

const submitBtnStyle = {
  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
  width: "100%", background: "var(--brand-gradient)", color: "#fff", border: "none",
  borderRadius: 999, padding: "11px 0", fontSize: 13.5, fontWeight: 600, cursor: "pointer",
  boxShadow: "0 10px 20px -8px rgba(37,99,235,0.5)",
};
