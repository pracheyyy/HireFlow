import { useNavigate } from "react-router-dom";
import { FileText, Mic, Code2, Bot, BarChart3, ArrowUpRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const QUICK_LINKS = [
  { to: "/dashboard/resume", label: "Upload Resume", desc: "Get your ATS score", icon: FileText },
  { to: "/dashboard/interview", label: "Start Interview", desc: "Practice with AI", icon: Mic },
  { to: "/dashboard/coding", label: "Coding Tracker", desc: "Log today's progress", icon: Code2 },
  { to: "/dashboard/assistant", label: "AI Assistant", desc: "Ask a prep question", icon: Bot },
  { to: "/dashboard/analytics", label: "Progress Analytics", desc: "See your trends", icon: BarChart3 },
];

export default function DashboardHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Welcome back, {firstName}</h1>
      <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 28 }}>
        Here's where your placement prep stands today.
      </p>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
        <StatCard label="Placement readiness" value="—" hint="Complete an interview to unlock" accent />
        <StatCard label="Resume ATS score" value="—" hint="Upload a resume to scan" />
        <StatCard label="Coding streak" value="0 days" hint="Log a problem to start" />
        <StatCard label="Mock interviews" value="0" hint="No sessions yet" />
      </div>

      {/* Quick actions */}
      <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 14 }}>Jump back in</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        {QUICK_LINKS.map(({ to, label, desc, icon: Icon }) => (
          <button
            key={to}
            onClick={() => navigate(to)}
            style={{
              textAlign: "left",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 16,
              padding: 20,
              cursor: "pointer",
              boxShadow: "var(--shadow-card)",
              display: "flex",
              flexDirection: "column",
              gap: 14,
              fontFamily: "var(--font-body)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 11,
                  background: "linear-gradient(135deg, #eaf1fd, #dbe7fb)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--brand-600)",
                }}
              >
                <Icon size={18} />
              </div>
              <ArrowUpRight size={16} color="var(--text-muted)" />
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{label}</p>
              <p style={{ fontSize: 12.5, color: "var(--text-secondary)" }}>{desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value, hint, accent }) {
  return (
    <div
      style={{
        background: accent ? "var(--brand-gradient)" : "var(--surface)",
        border: accent ? "none" : "1px solid var(--border)",
        borderRadius: 16,
        padding: 20,
        boxShadow: "var(--shadow-card)",
      }}
    >
      <p style={{ fontSize: 12.5, fontWeight: 500, color: accent ? "#dbe7fb" : "var(--text-secondary)", marginBottom: 6 }}>{label}</p>
      <p style={{ fontSize: 26, fontWeight: 700, fontFamily: "var(--font-heading)", color: accent ? "#fff" : "var(--text-primary)" }}>{value}</p>
      <p style={{ fontSize: 11.5, color: accent ? "#c7d6f7" : "var(--text-muted)", marginTop: 4 }}>{hint}</p>
    </div>
  );
}
