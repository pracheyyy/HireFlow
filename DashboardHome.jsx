import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText, Mic, Code2, Bot, BarChart3, ArrowUpRight,
  Flame, Target, Sparkles,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const FEATURES = [
  {
    to: "/dashboard/resume",
    icon: FileText,
    title: "AI Resume Analyzer",
    desc: "Upload your resume for an ATS score and AI-powered suggestions.",
  },
  {
    to: "/dashboard/interview",
    icon: Mic,
    title: "AI Mock Interviews",
    desc: "Practice HR and technical rounds with real-time AI feedback.",
  },
  {
    to: "/dashboard/coding",
    icon: Code2,
    title: "Coding Progress Tracker",
    desc: "Log daily goals and keep your DSA streak alive.",
  },
  {
    to: "/dashboard/assistant",
    icon: Bot,
    title: "AI Career Assistant",
    desc: "Ask for prep plans, resume tips, or interview strategy.",
  },
  {
    to: "/dashboard/analytics",
    icon: BarChart3,
    title: "Progress Analytics",
    desc: "See your readiness trend across every activity.",
  },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function CircularProgress({ value, size = 84, stroke = 8, label, sublabel }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.15)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#fff"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)" }}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          transform={`rotate(90 ${size / 2} ${size / 2})`}
          style={{ fill: "#fff", fontSize: 20, fontWeight: 700, fontFamily: "var(--font-heading)" }}
        >
          {value}
        </text>
      </svg>
      <div>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 2 }}>{label}</p>
        <p style={{ fontSize: 12, color: "#c7d6f7" }}>{sublabel}</p>
      </div>
    </div>
  );
}

export default function DashboardHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.name?.split(" ")[0] || "there";
  const greeting = useMemo(getGreeting, []);

  // Placeholder data — will be driven by real activity once each feature is built out
  const stats = {
    readiness: 0,
    atsScore: null,
    streak: 0,
    interviews: 0,
  };

  const hasResume = false; // will come from user/profile state once resume upload exists

  return (
    <div>
      {/* Greeting */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 23, fontWeight: 700, marginBottom: 4 }}>
          {greeting}, {firstName} 👋
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
          Here's your placement prep snapshot for today.
        </p>
      </div>

      {/* Readiness banner */}
      <div
        style={{
          background: "var(--brand-gradient)",
          borderRadius: 20,
          padding: "26px 28px",
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 20,
          boxShadow: "0 20px 40px -20px rgba(30,58,138,0.5)",
        }}
      >
        <CircularProgress
          value={stats.readiness}
          label="Placement Readiness Score"
          sublabel={stats.readiness === 0 ? "Complete an activity to unlock this" : "Updated after every session"}
        />
        <div style={{ display: "flex", gap: 28 }}>
          <MiniStat icon={Target} label="ATS score" value={stats.atsScore ?? "—"} />
          <MiniStat icon={Flame} label="Coding streak" value={`${stats.streak} days`} />
          <MiniStat icon={Sparkles} label="Interviews done" value={stats.interviews} />
        </div>
      </div>

      {/* Dynamic next-step nudge */}
      {!hasResume && (
        <button
          onClick={() => navigate("/dashboard/resume")}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            padding: "16px 20px",
            marginBottom: 32,
            cursor: "pointer",
            textAlign: "left",
            fontFamily: "var(--font-body)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "#eaf1fd", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand-600)" }}>
              <FileText size={18} />
            </div>
            <div>
              <p style={{ fontSize: 13.5, fontWeight: 600 }}>Start with your resume</p>
              <p style={{ fontSize: 12.5, color: "var(--text-secondary)" }}>Upload it to unlock your ATS score and readiness tracking.</p>
            </div>
          </div>
          <ArrowUpRight size={18} color="var(--text-muted)" />
        </button>
      )}

      {/* Feature blocks - equal weight */}
      <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Your toolkit</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 16 }}>
        {FEATURES.map(({ to, icon: Icon, title, desc }) => (
          <button
            key={to}
            onClick={() => navigate(to)}
            className="hf-feature-block"
            style={{
              textAlign: "left",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 16,
              padding: 22,
              cursor: "pointer",
              boxShadow: "var(--shadow-card)",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              fontFamily: "var(--font-body)",
              transition: "transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: "linear-gradient(135deg, #eaf1fd, #dbe7fb)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--brand-600)",
                }}
              >
                <Icon size={19} />
              </div>
              <ArrowUpRight size={16} color="var(--text-muted)" />
            </div>
            <div>
              <p style={{ fontSize: 14.5, fontWeight: 600, marginBottom: 4 }}>{title}</p>
              <p style={{ fontSize: 12.5, color: "var(--text-secondary)", lineHeight: 1.5 }}>{desc}</p>
            </div>
          </button>
        ))}
      </div>

      <style>{`
        .hf-feature-block:hover {
          transform: translateY(-3px);
          border-color: var(--brand-400);
          box-shadow: 0 16px 32px -18px rgba(37,99,235,0.35);
        }
      `}</style>
    </div>
  );
}

function MiniStat({ icon: Icon, label, value }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
        <Icon size={16} />
      </div>
      <div>
        <p style={{ fontSize: 15, fontWeight: 700, color: "#fff", fontFamily: "var(--font-heading)" }}>{value}</p>
        <p style={{ fontSize: 11, color: "#c7d6f7" }}>{label}</p>
      </div>
    </div>
  );
}
