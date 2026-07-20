import { useState, useEffect } from "react";
import { BarChart3, FileText, Mic, Code2, CheckCircle2, XCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { getOverview } from "../../api/analytics.api";

function CircularScore({ value, size = 120, stroke = 10 }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = value >= 70 ? "#059669" : value >= 45 ? "var(--brand-600)" : "#dc2626";

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={radius} stroke="#eef1f7" strokeWidth={stroke} fill="none" />
      <circle
        cx={size / 2} cy={size / 2} r={radius} stroke={color} strokeWidth={stroke} fill="none"
        strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)" }}
      />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" transform={`rotate(90 ${size / 2} ${size / 2})`}
        style={{ fill: "var(--text-primary)", fontSize: size * 0.24, fontWeight: 700, fontFamily: "var(--font-heading)" }}>
        {value}
      </text>
    </svg>
  );
}

const formatDate = (iso) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });

export default function ProgressAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOverview()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Loading...</p>;
  if (!data) return <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Couldn't load your analytics. Try refreshing.</p>;

  const resumeChartData = data.resume.history.map((h) => ({ date: formatDate(h.date), score: h.score }));
  const interviewChartData = data.interview.history.map((h) => ({ date: formatDate(h.date), score: h.score }));

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ width: 48, height: 48, borderRadius: 13, background: "linear-gradient(135deg, #eaf1fd, #dbe7fb)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand-600)", marginBottom: 16 }}>
          <BarChart3 size={22} />
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Progress Analytics</h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", maxWidth: 560, lineHeight: 1.6 }}>
          Your readiness score is a weighted average of your resume, interview, and coding activity, plus profile
          completeness — each 25%. It's a straightforward calculation from your existing scores, not a separate AI judgment.
        </p>
      </div>

      {/* Readiness score banner */}
      <div style={{ background: "var(--brand-gradient)", borderRadius: 20, padding: "28px 28px", marginBottom: 24, display: "flex", alignItems: "center", gap: 28, flexWrap: "wrap", boxShadow: "0 20px 40px -20px rgba(30,58,138,0.5)" }}>
        <CircularScore value={data.readinessScore} />
        <div style={{ flex: 1, minWidth: 240 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#dbe7fb", marginBottom: 12 }}>Placement Readiness Score</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
            <BreakdownItem label="Resume" score={data.readinessBreakdown.resume.score} hasData={data.readinessBreakdown.resume.hasData} />
            <BreakdownItem label="Interview" score={data.readinessBreakdown.interview.score} hasData={data.readinessBreakdown.interview.hasData} />
            <BreakdownItem label="Coding" score={data.readinessBreakdown.coding.score} hasData={data.readinessBreakdown.coding.hasData} />
            <BreakdownItem label="Profile" score={data.readinessBreakdown.profile.score} hasData={data.readinessBreakdown.profile.hasData} />
          </div>
        </div>
      </div>

      {/* Trend charts */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16, marginBottom: 20 }}>
        <ChartCard icon={FileText} title="Resume ATS score trend" data={resumeChartData} empty="Upload a resume to see your trend." />
        <ChartCard icon={Mic} title="Interview score trend" data={interviewChartData} empty="Complete a mock interview to see your trend." />
      </div>

      {/* Coding + profile summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 20 }}>
          <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
            <Code2 size={15} color="var(--brand-600)" /> Coding activity
          </p>
          <div style={{ display: "flex", gap: 24, marginBottom: 14 }}>
            <div>
              <p style={{ fontSize: 20, fontWeight: 700, fontFamily: "var(--font-heading)" }}>{data.coding.totalSolved}</p>
              <p style={{ fontSize: 11.5, color: "var(--text-muted)" }}>Total solved</p>
            </div>
            <div>
              <p style={{ fontSize: 20, fontWeight: 700, fontFamily: "var(--font-heading)" }}>{data.coding.currentStreak}</p>
              <p style={{ fontSize: 11.5, color: "var(--text-muted)" }}>Current streak</p>
            </div>
            <div>
              <p style={{ fontSize: 20, fontWeight: 700, fontFamily: "var(--font-heading)" }}>{data.coding.longestStreak}</p>
              <p style={{ fontSize: 11.5, color: "var(--text-muted)" }}>Longest streak</p>
            </div>
          </div>
          {data.coding.topicBreakdown.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {data.coding.topicBreakdown.slice(0, 4).map(({ topic, count }) => (
                <div key={topic} style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                  <span style={{ color: "var(--text-secondary)" }}>{topic}</span>
                  <span style={{ fontWeight: 600 }}>{count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: 12.5, color: "var(--text-muted)" }}>No problems logged yet.</p>
          )}
        </div>

        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 20 }}>
          <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>What's holding your score back</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <ChecklistItem done={data.readinessBreakdown.profile.hasData} label="Profile completed" />
            <ChecklistItem done={data.readinessBreakdown.resume.hasData} label="Resume uploaded" />
            <ChecklistItem done={data.readinessBreakdown.interview.hasData} label="Mock interview attempted" />
            <ChecklistItem done={data.coding.totalSolved >= 25} label="25+ problems solved" />
          </div>
        </div>
      </div>
    </div>
  );
}

function BreakdownItem({ label, score, hasData }) {
  return (
    <div>
      <p style={{ fontSize: 16, fontWeight: 700, color: "#fff", fontFamily: "var(--font-heading)" }}>
        {hasData ? score : "—"}
      </p>
      <p style={{ fontSize: 11, color: "#c7d6f7" }}>{label}</p>
    </div>
  );
}

function ChecklistItem({ done, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {done ? <CheckCircle2 size={15} color="#059669" /> : <XCircle size={15} color="var(--text-muted)" />}
      <span style={{ fontSize: 13, color: done ? "var(--text-primary)" : "var(--text-muted)" }}>{label}</span>
    </div>
  );
}

function ChartCard({ icon: Icon, title, data, empty }) {
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 20 }}>
      <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
        <Icon size={15} color="var(--brand-600)" /> {title}
      </p>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eef1f7" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--border)" }} />
            <Line type="monotone" dataKey="score" stroke="var(--brand-600)" strokeWidth={2.5} dot={{ r: 3, fill: "var(--brand-600)" }} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p style={{ fontSize: 12.5, color: "var(--text-muted)" }}>{empty}</p>
      )}
    </div>
  );
}
