import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText, Mic, Code2, Bot, BarChart3, ArrowRight, CheckCircle2,
  UserPlus, ClipboardList, Sparkles, TrendingUp,
} from "lucide-react";
import Logo from "../components/Logo";

const FEATURES = [
  {
    icon: FileText,
    title: "AI resume analyzer",
    desc: "Get an ATS compatibility score and targeted suggestions in seconds, not days.",
    area: "resume",
    big: true,
  },
  { icon: Mic, title: "Mock interviews", desc: "Practice HR and technical rounds with real AI feedback.", area: "mock" },
  { icon: Bot, title: "AI career assistant", desc: "Company-specific prep plans, on demand.", area: "assistant" },
  { icon: Code2, title: "Coding tracker", desc: "Daily goals, streaks, topic-wise progress.", area: "coding" },
  { icon: BarChart3, title: "Progress analytics", desc: "One score for how ready you really are.", area: "analytics" },
];

const STEPS = [
  { icon: UserPlus, title: "Create your account", desc: "Sign up with email or Google in under a minute." },
  { icon: ClipboardList, title: "Complete your profile", desc: "Add your skills and education so prep plans fit you." },
  { icon: Sparkles, title: "Get AI-powered prep", desc: "Resume scans, mock interviews, and a live readiness score." },
];

const STRIP_ITEMS = ["Resumes", "Mock interviews", "DSA practice", "Career coaching", "Progress analytics"];

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return [ref, visible];
}

function Reveal({ children, delay = 0 }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ fontFamily: "var(--font-body)", color: "var(--text-primary)", background: "var(--bg)", overflowX: "hidden" }}>
      <style>{`
        @keyframes hf-float { 0%, 100% { transform: translateY(0px) } 50% { transform: translateY(-14px) } }
        @keyframes hf-marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        .hf-blob-1 { animation: hf-float 7s ease-in-out infinite; }
        .hf-blob-2 { animation: hf-float 9s ease-in-out infinite 1s; }
        .hf-marquee-track { animation: hf-marquee 22s linear infinite; }
        .hf-bento { display: grid; grid-template-columns: repeat(4, 1fr); grid-template-areas: "resume resume mock assistant" "resume resume coding analytics"; gap: 16px; }
        .hf-hero-grid { display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 48px; align-items: center; }
        @media (max-width: 900px) {
          .hf-bento { grid-template-columns: 1fr 1fr; grid-template-areas: "resume resume" "mock assistant" "coding analytics"; }
          .hf-hero-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .hf-bento { grid-template-columns: 1fr; grid-template-areas: "resume" "mock" "assistant" "coding" "analytics"; }
        }
      `}</style>

      {/* Nav */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(247,249,252,0.85)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid var(--border)",
          boxShadow: scrolled ? "0 4px 20px -8px rgba(15,23,42,0.08)" : "none",
          transition: "box-shadow 0.2s ease",
        }}
      >
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Logo size={30} />
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <a href="#features" style={{ fontSize: 14, color: "var(--text-secondary)", textDecoration: "none" }}>Features</a>
            <a href="#how-it-works" style={{ fontSize: 14, color: "var(--text-secondary)", textDecoration: "none" }}>How it works</a>
            <button onClick={() => navigate("/auth")} style={{ fontSize: 14, fontWeight: 600, color: "var(--brand-600)", background: "none", border: "none", cursor: "pointer" }}>
              Sign in
            </button>
            <button
              onClick={() => navigate("/auth")}
              style={{ fontSize: 14, fontWeight: 600, color: "#fff", background: "var(--brand-gradient)", border: "none", borderRadius: 999, padding: "10px 22px", cursor: "pointer", boxShadow: "0 8px 18px -8px rgba(37,99,235,0.55)" }}
            >
              Get started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position: "relative", maxWidth: 1160, margin: "0 auto", padding: "80px 24px 40px" }}>
        <div
          className="hf-blob-1"
          style={{ position: "absolute", top: -60, left: -120, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.16), transparent 70%)", filter: "blur(10px)", zIndex: 0 }}
        />
        <div
          className="hf-blob-2"
          style={{ position: "absolute", top: 120, right: -100, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.14), transparent 70%)", filter: "blur(10px)", zIndex: 0 }}
        />

        <div className="hf-hero-grid" style={{ position: "relative", zIndex: 1 }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: "var(--brand-700)", background: "#eaf1fd", border: "1px solid #dbe7fb", borderRadius: 999, padding: "6px 14px", marginBottom: 22 }}>
              <CheckCircle2 size={14} /> Built for campus placements
            </div>
            <h1 style={{ fontSize: 46, lineHeight: 1.12, fontWeight: 700, marginBottom: 18 }}>
              One platform to get placement-ready
            </h1>
            <p style={{ fontSize: 16.5, color: "var(--text-secondary)", maxWidth: 460, marginBottom: 30, lineHeight: 1.65 }}>
              Resume analysis, mock interviews, coding progress, and career guidance —
              all in one AI-powered workspace instead of five different tabs.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                onClick={() => navigate("/auth")}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 600, color: "#fff", background: "var(--brand-gradient)", border: "none", borderRadius: 999, padding: "14px 26px", cursor: "pointer", boxShadow: "0 12px 24px -10px rgba(37,99,235,0.5)" }}
              >
                Start preparing free <ArrowRight size={16} />
              </button>
              <a
                href="#how-it-works"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 600, color: "var(--text-primary)", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 999, padding: "14px 26px", textDecoration: "none" }}
              >
                See how it works
              </a>
            </div>
          </div>

          {/* Dashboard mockup instead of a lone number */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                borderRadius: 20,
                background: "#0f1b3d",
                boxShadow: "var(--shadow-elevated)",
                overflow: "hidden",
                transform: "rotate(1.2deg)",
              }}
            >
              <div style={{ display: "flex", gap: 6, padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444" }} />
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#eab308" }} />
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#22c55e" }} />
              </div>
              <div style={{ display: "flex" }}>
                <div style={{ width: 46, borderRight: "1px solid rgba(255,255,255,0.08)", padding: "16px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                  {[FileText, Mic, Code2, Bot, BarChart3].map((Icon, i) => (
                    <div key={i} style={{ width: 26, height: 26, borderRadius: 8, background: i === 0 ? "var(--brand-gradient)" : "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", color: i === 0 ? "#fff" : "#8ea3d1" }}>
                      <Icon size={13} />
                    </div>
                  ))}
                </div>
                <div style={{ flex: 1, padding: "20px 22px" }}>
                  <p style={{ color: "#8ea3d1", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>
                    Placement readiness
                  </p>
                  <p style={{ color: "#fff", fontSize: 34, fontWeight: 700, fontFamily: "var(--font-heading)", marginBottom: 14 }}>
                    78<span style={{ fontSize: 16, color: "#8ea3d1" }}>/100</span>
                  </p>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 60, marginBottom: 16 }}>
                    {[38, 52, 44, 66, 58, 78, 70].map((h, i) => (
                      <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: 4, background: i === 5 ? "var(--brand-400)" : "rgba(255,255,255,0.12)" }} />
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <div style={{ flex: 1, background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: "10px 12px" }}>
                      <p style={{ color: "#8ea3d1", fontSize: 10.5 }}>ATS score</p>
                      <p style={{ color: "#fff", fontSize: 15, fontWeight: 600 }}>92%</p>
                    </div>
                    <div style={{ flex: 1, background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: "10px 12px" }}>
                      <p style={{ color: "#8ea3d1", fontSize: 10.5 }}>Streak</p>
                      <p style={{ color: "#fff", fontSize: 15, fontWeight: 600 }}>12 days</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Icon strip - honest, no fabricated stats */}
      <div style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "var(--surface)", padding: "18px 0", overflow: "hidden" }}>
        <div className="hf-marquee-track" style={{ display: "flex", gap: 56, width: "max-content" }}>
          {[...STRIP_ITEMS, ...STRIP_ITEMS, ...STRIP_ITEMS].map((item, i) => (
            <span key={i} style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-muted)", whiteSpace: "nowrap" }}>{item}</span>
          ))}
        </div>
      </div>

      {/* How it works */}
      <section id="how-it-works" style={{ maxWidth: 1160, margin: "0 auto", padding: "88px 24px 88px" }}>
        <Reveal>
          <h2 style={{ fontSize: 28, fontWeight: 700, textAlign: "center", marginBottom: 10 }}>How HireFlow works</h2>
          <p style={{ textAlign: "center", color: "var(--text-secondary)", marginBottom: 52 }}>Three steps between you and a placement-ready profile.</p>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24, position: "relative" }}>
          {STEPS.map(({ icon: Icon, title, desc }, i) => (
            <Reveal key={title} delay={i * 100}>
              <div style={{ textAlign: "center", padding: "0 12px" }}>
                <div style={{ width: 56, height: 56, margin: "0 auto 18px", borderRadius: 16, background: "var(--brand-gradient)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", boxShadow: "0 10px 20px -8px rgba(37,99,235,0.5)" }}>
                  <Icon size={24} />
                </div>
                <p style={{ fontSize: 12, fontWeight: 700, color: "var(--brand-600)", marginBottom: 6 }}>STEP 0{i + 1}</p>
                <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.6 }}>{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Features - bento grid */}
      <section id="features" style={{ maxWidth: 1160, margin: "0 auto", padding: "0 24px 100px" }}>
        <Reveal>
          <h2 style={{ fontSize: 28, fontWeight: 700, textAlign: "center", marginBottom: 10 }}>Everything you need, in one place</h2>
          <p style={{ textAlign: "center", color: "var(--text-secondary)", marginBottom: 44 }}>Stop juggling five different apps for one goal.</p>
        </Reveal>

        <Reveal>
          <div className="hf-bento">
            {FEATURES.map(({ icon: Icon, title, desc, area, big }) => (
              <div
                key={title}
                style={{
                  gridArea: area,
                  background: big ? "var(--brand-gradient)" : "var(--surface)",
                  border: big ? "none" : "1px solid var(--border)",
                  borderRadius: 18,
                  padding: big ? 30 : 22,
                  boxShadow: "var(--shadow-card)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: big ? "space-between" : "flex-start",
                  minHeight: big ? 220 : undefined,
                }}
              >
                <div>
                  <div
                    style={{
                      width: big ? 46 : 40,
                      height: big ? 46 : 40,
                      borderRadius: 12,
                      background: big ? "rgba(255,255,255,0.15)" : "linear-gradient(135deg, #eaf1fd, #dbe7fb)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 16,
                      color: big ? "#fff" : "var(--brand-600)",
                    }}
                  >
                    <Icon size={big ? 22 : 18} />
                  </div>
                  <h3 style={{ fontSize: big ? 19 : 15, fontWeight: 600, marginBottom: 8, color: big ? "#fff" : "var(--text-primary)" }}>{title}</h3>
                  <p style={{ fontSize: big ? 14 : 12.5, color: big ? "#dbe7fb" : "var(--text-secondary)", lineHeight: 1.6, maxWidth: big ? 320 : undefined }}>{desc}</p>
                </div>
                {big && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 20, fontSize: 13, fontWeight: 600, color: "#fff" }}>
                    <TrendingUp size={15} /> 92% average ATS improvement
                  </div>
                )}
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Footer CTA */}
      <section style={{ position: "relative", background: "#0f1b3d", padding: "72px 24px", textAlign: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)", backgroundSize: "24px 24px" }} />
        <div style={{ position: "relative" }}>
          <h2 style={{ color: "#fff", fontSize: 28, fontWeight: 700, marginBottom: 14 }}>Ready to get placement-ready?</h2>
          <p style={{ color: "#c7d6f7", marginBottom: 28 }}>Create your free account in under a minute.</p>
          <button
            onClick={() => navigate("/auth")}
            style={{ fontSize: 15, fontWeight: 600, color: "var(--brand-900)", background: "#fff", border: "none", borderRadius: 999, padding: "14px 30px", cursor: "pointer" }}
          >
            Get started
          </button>
        </div>
      </section>

      <footer style={{ background: "#0c1730", padding: "48px 24px 28px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 32, marginBottom: 32 }}>
          <div style={{ maxWidth: 260 }}>
            <Logo size={26} dark />
            <p style={{ fontSize: 13, color: "#8ea3d1", marginTop: 12, lineHeight: 1.6 }}>
              One AI-powered workspace for resume prep, mock interviews, and coding practice.
            </p>
          </div>
          <FooterCol title="Product" items={["Resume analyzer", "Mock interviews", "Coding tracker", "AI assistant"]} />
          <FooterCol title="Company" items={["About", "Careers", "Contact"]} />
          <FooterCol title="Legal" items={["Privacy", "Terms"]} />
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20, textAlign: "center", fontSize: 12.5, color: "#5f7bb0" }}>
          © {new Date().getFullYear()} HireFlow. Built for students, by students.
        </div>
      </footer>
    </div>
  );
}

function FooterCol({ title, items }) {
  return (
    <div>
      <p style={{ fontSize: 12.5, fontWeight: 600, color: "#fff", marginBottom: 14, letterSpacing: "0.03em" }}>{title}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((item) => (
          <span key={item} style={{ fontSize: 13, color: "#8ea3d1", cursor: "pointer" }}>{item}</span>
        ))}
      </div>
    </div>
  );
}
