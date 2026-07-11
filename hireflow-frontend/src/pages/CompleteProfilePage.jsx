import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Plus, GraduationCap, Sparkles, ArrowRight } from "lucide-react";
import { updateProfile } from "../api/auth.api";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";

export default function CompleteProfilePage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState(user?.skills || []);
  const [education, setEducation] = useState({ institution: "", degree: "", year: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
    }
    setSkillInput("");
  };

  const removeSkill = (skill) => setSkills(skills.filter((s) => s !== skill));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = { skills };
      if (education.institution || education.degree) {
        payload.education = [education];
      }
      const updated = await updateProfile(payload);
      updateUser(updated);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't save your profile. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        padding: 24,
        fontFamily: "var(--font-body)",
      }}
    >
      <div style={{ width: "100%", maxWidth: 560 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
          <Logo size={30} />
        </div>

        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 20,
            boxShadow: "var(--shadow-card)",
            padding: "40px 36px",
          }}
        >
          <div style={{ marginBottom: 28 }}>
            <div
              style={{
                width: 8, height: 8, borderRadius: 999, background: "var(--brand-600)",
                display: "inline-block", marginRight: 8,
              }}
            />
            <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--brand-700)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
              Step 2 of 2
            </span>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginTop: 10 }}>Complete your profile</h1>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 6 }}>
              This helps us tailor your prep plan and readiness score.
            </p>
          </div>

          {error && (
            <p style={{ color: "#dc2626", fontSize: 13, marginBottom: 16, background: "#fef2f2", padding: "10px 14px", borderRadius: 10 }}>
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
              <Sparkles size={14} color="var(--brand-600)" /> Skills
            </label>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <input
                type="text"
                placeholder="e.g. React, Python, DSA"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                style={inputStyle}
              />
              <button type="button" onClick={addSkill} style={addBtnStyle}>
                <Plus size={16} />
              </button>
            </div>

            {skills.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
                {skills.map((skill) => (
                  <span key={skill} style={chipStyle}>
                    {skill}
                    <X size={13} style={{ cursor: "pointer" }} onClick={() => removeSkill(skill)} />
                  </span>
                ))}
              </div>
            )}

            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 6, marginBottom: 10, marginTop: skills.length ? 0 : 8 }}>
              <GraduationCap size={14} color="var(--brand-600)" /> Education
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
              <input
                type="text"
                placeholder="Institution (e.g. JSPM's RSCOE, Pune)"
                value={education.institution}
                onChange={(e) => setEducation({ ...education, institution: e.target.value })}
                style={inputStyle}
              />
              <div style={{ display: "flex", gap: 10 }}>
                <input
                  type="text"
                  placeholder="Degree (e.g. B.Tech IT)"
                  value={education.degree}
                  onChange={(e) => setEducation({ ...education, degree: e.target.value })}
                  style={inputStyle}
                />
                <input
                  type="text"
                  placeholder="Year (e.g. 2027)"
                  value={education.year}
                  onChange={(e) => setEducation({ ...education, year: e.target.value })}
                  style={{ ...inputStyle, maxWidth: 120 }}
                />
              </div>
            </div>

            <button type="submit" disabled={saving} style={submitBtnStyle}>
              {saving ? "Saving..." : "Go to dashboard"}
              {!saving && <ArrowRight size={16} />}
            </button>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              style={{ display: "block", margin: "16px auto 0", background: "none", border: "none", color: "var(--text-muted)", fontSize: 13, cursor: "pointer" }}
            >
              Skip for now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  flex: 1,
  background: "#f2f4f7",
  border: "1px solid transparent",
  borderRadius: 10,
  padding: "12px 14px",
  fontSize: 14,
  color: "var(--text-primary)",
  outline: "none",
  fontFamily: "var(--font-body)",
};

const addBtnStyle = {
  width: 44,
  background: "var(--brand-gradient)",
  border: "none",
  borderRadius: 10,
  color: "#fff",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const chipStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  background: "#eaf1fd",
  color: "var(--brand-700)",
  fontSize: 12.5,
  fontWeight: 600,
  padding: "6px 10px",
  borderRadius: 999,
};

const submitBtnStyle = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  background: "var(--brand-gradient)",
  color: "#fff",
  border: "none",
  borderRadius: 999,
  padding: "13px 0",
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
  boxShadow: "0 10px 20px -8px rgba(37,99,235,0.5)",
};
