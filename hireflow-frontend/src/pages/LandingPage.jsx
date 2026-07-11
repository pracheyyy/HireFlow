import { useNavigate } from "react-router-dom";
import { FileText, Mic, Code2, Bot, BarChart3, ArrowRight, CheckCircle2 } from "lucide-react";
import Logo from "../components/Logo";

const FEATURES = [
  {
    icon: FileText,
    title: "AI resume analyzer",
    desc: "Get an ATS compatibility score and targeted suggestions in seconds, not days.",
  },
  {
    icon: Mic,
    title: "Mock interviews",
    desc: "Practice HR and technical rounds with an AI interviewer that gives real feedback.",
  },
  {
    icon: Code2,
    title: "Coding tracker",
    desc: "Track daily goals, streaks, and topic-wise progress in one dashboard.",
  },
  {
    icon: Bot,
    title: "AI career assistant",
    desc: "Get company-specific prep plans and instant answers to interview questions.",
  },
  {
    icon: BarChart3,
    title: "Placement readiness score",
    desc: "One number that tells you exactly how ready you are — and what to fix next.",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "var(--font-body)", color: "var(--text-primary)", background: "var(--bg)" }}>
      {/* Nav */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(247,249,252,0.85)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Logo size={30} />
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <a href="#features" style={{ fontSize: 14, color: "var(--text-secondary)", textDecoration: "none" }}>Features</a>
            <button
              onClick={() => navigate("/auth")}
              style={{ fontSize: 14, fontWeight: 600, color: "var(--brand-600)", background: "none", border: "none", cursor: "pointer" }}
            >
              Sign in
            </button>
            <button
              onClick={() => navigate("/auth")}
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#fff",
                background: "var(--brand-gradient)",
                border: "none",
                borderRadius: 999,
                padding: "10px 22px",
                cursor: "pointer",
                boxShadow: "0 8px 18px -8px rgba(37,99,235,0.55)",
              }}
            >
              Get started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 1120, margin: "0 auto", padding: "88px 24px 64px", textAlign: "center" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            fontWeight: 600,
            color: "var(--brand-700)",
            background: "#eaf1fd",
            border: "1px solid #dbe7fb",
            borderRadius: 999,
            padding: "6px 14px",
            marginBottom: 24,
          }}
        >
          <CheckCircle2 size={14} /> Built for campus placements
        </div>
        <h1 style={{ fontSize: 52, lineHeight: 1.1, fontWeight: 700, maxWidth: 780, margin: "0 auto 20px" }}>
          One platform to get placement-ready
        </h1>
        <p style={{ fontSize: 17, color: "var(--text-secondary)", maxWidth: 560, margin: "0 auto 36px", lineHeight: 1.6 }}>
          Resume analysis, mock interviews, coding progress, and career guidance —
          all in one AI-powered workspace instead of five different tabs.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button
            onClick={() => navigate("/auth")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 15,
              fontWeight: 600,
              color: "#fff",
              background: "var(--brand-gradient)",
              border: "none",
              borderRadius: 999,
              padding: "14px 28px",
              cursor: "pointer",
              boxShadow: "0 12px 24px -10px rgba(37,99,235,0.5)",
            }}
          >
            Start preparing free <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Preview panel */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 96px" }}>
        <div
          style={{
            borderRadius: 22,
            background: "var(--brand-gradient)",
            padding: 3,
            boxShadow: "var(--shadow-elevated)",
          }}
        >
          <div style={{ background: "#0f1b3d", borderRadius: 20, padding: "56px 40px", textAlign: "center" }}>
            <p style={{ color: "#a9c0f5", fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
              Placement Readiness Score
            </p>
            <p style={{ color: "#fff", fontSize: 56, fontWeight: 700, fontFamily: "var(--font-heading)" }}>78<span style={{ fontSize: 24, color: "#a9c0f5" }}>/100</span></p>
            <p style={{ color: "#c7d6f7", fontSize: 14 }}>Updated after every mock interview and resume scan</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px 100px" }}>
        <h2 style={{ fontSize: 30, fontWeight: 700, textAlign: "center", marginBottom: 12 }}>Everything you need, in one place</h2>
        <p style={{ textAlign: "center", color: "var(--text-secondary)", marginBottom: 48 }}>
          Stop juggling five different apps for one goal.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                padding: 26,
                boxShadow: "var(--shadow-card)",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "linear-gradient(135deg, #eaf1fd, #dbe7fb)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                  color: "var(--brand-600)",
                }}
              >
                <Icon size={20} />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{title}</h3>
              <p style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section style={{ background: "#0f1b3d", padding: "64px 24px", textAlign: "center" }}>
        <h2 style={{ color: "#fff", fontSize: 28, fontWeight: 700, marginBottom: 14 }}>Ready to get placement-ready?</h2>
        <p style={{ color: "#c7d6f7", marginBottom: 28 }}>Create your free account in under a minute.</p>
        <button
          onClick={() => navigate("/auth")}
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: "var(--brand-900)",
            background: "#fff",
            border: "none",
            borderRadius: 999,
            padding: "14px 30px",
            cursor: "pointer",
          }}
        >
          Get started
        </button>
      </section>

      <footer style={{ padding: "24px", textAlign: "center", fontSize: 12.5, color: "var(--text-muted)" }}>
        © {new Date().getFullYear()} HireFlow. Built for students, by students.
      </footer>
    </div>
  );
}
