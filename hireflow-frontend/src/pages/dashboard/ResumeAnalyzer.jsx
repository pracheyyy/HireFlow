import { useState, useEffect, useRef, useCallback } from "react";
import {
  UploadCloud, FileText, CheckCircle2, XCircle, Loader2, Sparkles,
  Clock, ChevronRight,
} from "lucide-react";
import { uploadResume, getLatestResume, getResumeHistory } from "../../api/resume.api";

const SCORE_LABELS = {
  contactInfo: { label: "Contact info", max: 10 },
  sectionsCoverage: { label: "Section coverage", max: 20 },
  lengthScore: { label: "Length", max: 10 },
  bulletUsage: { label: "Bullet formatting", max: 10 },
  actionVerbs: { label: "Action verbs", max: 15 },
  quantifiedAchievements: { label: "Quantified impact", max: 15 },
  keywordCoverage: { label: "Keyword coverage", max: 20 },
};

function CircularScore({ value, size = 100, stroke = 9 }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = value >= 70 ? "#059669" : value >= 45 ? "var(--brand-600)" : "#dc2626";

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={radius} stroke="#eef1f7" strokeWidth={stroke} fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
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
        style={{ fill: "var(--text-primary)", fontSize: size * 0.26, fontWeight: 700, fontFamily: "var(--font-heading)" }}
      >
        {value}
      </text>
    </svg>
  );
}

export default function ResumeAnalyzer() {
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    Promise.all([getLatestResume(), getResumeHistory()])
      .then(([latest, hist]) => {
        setResult(latest);
        setHistory(hist);
      })
      .catch(() => {})
      .finally(() => setLoadingInitial(false));
  }, []);

  const handleFile = useCallback(async (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Only PDF files are accepted.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File is too large — max size is 5MB.");
      return;
    }
    setError("");
    setUploading(true);
    try {
      const analyzed = await uploadResume(file);
      setResult(analyzed);
      const hist = await getResumeHistory();
      setHistory(hist);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't analyze that resume. Try again.");
    } finally {
      setUploading(false);
    }
  }, []);

  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div
          style={{
            width: 48, height: 48, borderRadius: 13,
            background: "linear-gradient(135deg, #eaf1fd, #dbe7fb)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--brand-600)", marginBottom: 16,
          }}
        >
          <FileText size={22} />
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>AI Resume Analyzer</h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", maxWidth: 560, lineHeight: 1.6 }}>
          Upload your resume as a PDF to get an ATS compatibility score, missing keyword detection, and
          concrete suggestions. Scoring runs entirely on rule-based checks (sections, keywords, formatting) —
          no external AI API involved, so results are consistent and explainable.
        </p>
      </div>

      {/* Upload zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `1.5px dashed ${dragActive ? "var(--brand-600)" : "var(--border-strong)"}`,
          borderRadius: 18,
          padding: "36px 24px",
          textAlign: "center",
          background: dragActive ? "#eaf1fd" : "var(--surface)",
          cursor: "pointer",
          marginBottom: 20,
          transition: "background 0.15s ease, border-color 0.15s ease",
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          style={{ display: "none" }}
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        {uploading ? (
          <>
            <Loader2 size={26} className="hf-spin" color="var(--brand-600)" style={{ marginBottom: 10 }} />
            <p style={{ fontSize: 13.5, fontWeight: 600 }}>Analyzing your resume...</p>
          </>
        ) : (
          <>
            <UploadCloud size={26} color="var(--brand-600)" style={{ marginBottom: 10 }} />
            <p style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 4 }}>
              Drag & drop your resume here, or click to browse
            </p>
            <p style={{ fontSize: 12, color: "var(--text-muted)" }}>PDF only, up to 5MB</p>
          </>
        )}
      </div>

      <style>{`
        .hf-spin { animation: hf-spin-anim 0.8s linear infinite; }
        @keyframes hf-spin-anim { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      {error && (
        <p style={{ color: "#dc2626", fontSize: 13, marginBottom: 20, background: "#fef2f2", padding: "10px 14px", borderRadius: 10 }}>
          {error}
        </p>
      )}

      {loadingInitial ? (
        <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Loading...</p>
      ) : result ? (
        <ResultView result={result} />
      ) : (
        !uploading && (
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
            No resume analyzed yet — upload one above to see your ATS score.
          </p>
        )
      )}

      {/* History */}
      {history.length > 1 && (
        <div style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
            <Clock size={15} color="var(--text-secondary)" /> Previous uploads
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {history.map((h) => (
              <div
                key={h._id}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12,
                  padding: "10px 14px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <FileText size={15} color="var(--text-muted)" />
                  <div>
                    <p style={{ fontSize: 12.5, fontWeight: 600 }}>{h.fileName}</p>
                    <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{new Date(h.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: h.atsScore >= 70 ? "#059669" : h.atsScore >= 45 ? "var(--brand-600)" : "#dc2626" }}>
                  {h.atsScore}/100
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ResultView({ result }) {
  return (
    <div>
      {/* Score summary */}
      <div
        style={{
          display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap",
          background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 18,
          padding: 24, marginBottom: 20, boxShadow: "var(--shadow-card)",
        }}
      >
        <CircularScore value={result.atsScore} />
        <div style={{ flex: 1, minWidth: 200 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 4 }}>ATS Compatibility Score</p>
          <p style={{ fontSize: 12.5, color: "var(--text-muted)" }}>
            Based on {result.fileName} · {result.wordCount} words
          </p>
        </div>
      </div>

      {/* Score breakdown */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Score breakdown</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {Object.entries(SCORE_LABELS).map(([key, { label, max }]) => {
            const value = result.scoreBreakdown?.[key] ?? 0;
            const pct = (value / max) * 100;
            return (
              <div key={key}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12.5, color: "var(--text-secondary)" }}>{label}</span>
                  <span style={{ fontSize: 12.5, fontWeight: 600 }}>{value}/{max}</span>
                </div>
                <div style={{ height: 6, background: "#eef1f7", borderRadius: 999, overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: "var(--brand-gradient)", borderRadius: 999 }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sections */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 20 }}>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 18 }}>
          <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Sections detected</p>
          {result.sectionsFound?.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {result.sectionsFound.map((s) => (
                <span key={s} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "var(--text-secondary)" }}>
                  <CheckCircle2 size={13} color="#059669" /> {s}
                </span>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: 12.5, color: "var(--text-muted)" }}>None detected</p>
          )}
          {result.sectionsMissing?.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
              {result.sectionsMissing.map((s) => (
                <span key={s} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "var(--text-muted)" }}>
                  <XCircle size={13} color="#dc2626" /> {s} (missing)
                </span>
              ))}
            </div>
          )}
        </div>

        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 18 }}>
          <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Missing keywords</p>
          {result.missingKeywords?.length > 0 ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {result.missingKeywords.slice(0, 10).map((k) => (
                <span key={k} style={{ fontSize: 11.5, fontWeight: 600, color: "var(--text-secondary)", background: "#f2f4f7", padding: "4px 9px", borderRadius: 999 }}>
                  {k}
                </span>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: 12.5, color: "var(--text-muted)" }}>Great keyword coverage.</p>
          )}
        </div>
      </div>

      {/* Suggestions */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 18 }}>
        <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
          <Sparkles size={14} color="var(--brand-600)" /> Suggestions
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {result.suggestions?.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <ChevronRight size={14} color="var(--brand-600)" style={{ marginTop: 2, flexShrink: 0 }} />
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.55 }}>{s}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
