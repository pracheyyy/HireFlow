import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  X, Plus, GraduationCap, Sparkles, ArrowRight, User, Code2,
  Briefcase, FolderGit2, School, Trash2,
} from "lucide-react";
import { updateProfile } from "../api/auth.api";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";

export default function CompleteProfilePage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState(user?.profile?.skills || user?.skills || []);
  const [education, setEducation] = useState(user?.education?.[0] || { institution: "", degree: "", year: "" });
  const [personal, setPersonal] = useState({
    fullName: user?.name || user?.profile?.personal?.fullName || "",
    phone: user?.profile?.personal?.phone || "",
    city: user?.profile?.personal?.city || "",
    linkedIn: user?.profile?.personal?.linkedIn || "",
    github: user?.profile?.personal?.github || "",
  });
  const [academic, setAcademic] = useState(user?.profile?.academic || { cgpa: "", tenth: "", twelfth: "", currentSemester: "", activeBacklogs: 0 });
  const [coding, setCoding] = useState(user?.profile?.codingProfiles || { leetCode: "", codeChef: "", codeforces: "", problemsSolved: 0 });
  const [projects, setProjects] = useState(user?.profile?.projects || []);
  const [projectDraft, setProjectDraft] = useState({ name: "", description: "", techStack: "", githubLink: "", liveLink: "" });
  const [experience, setExperience] = useState(user?.profile?.experience || []);
  const [experienceDraft, setExperienceDraft] = useState({ company: "", role: "", duration: "", description: "" });
  const [careerPrefs, setCareerPrefs] = useState(user?.profile?.careerPreferences || { dreamRole: "", domains: [], employmentType: "", preferredLocations: [] });
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

  // Live completion meter — purely visual encouragement, not a gate
  const completion = useMemo(() => {
    const checks = [
      skills.length > 0,
      !!personal.fullName,
      !!personal.phone && !!personal.city,
      !!academic.cgpa,
      !!coding.leetCode || !!coding.codeChef,
      projects.length > 0,
      experience.length > 0,
      !!education.institution && !!education.degree,
    ];
    const done = checks.filter(Boolean).length;
    return Math.round((done / checks.length) * 100);
  }, [skills, personal, academic, coding, projects, experience, education]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = {
        skills,
        education: education.institution || education.degree ? [education] : [],
        profile: {
          personal,
          academic,
          skills,
          codingProfiles: coding,
          projects: projects.map((p) => ({ ...p, techStack: Array.isArray(p.techStack) ? p.techStack : (p.techStack || "").split(",").map((s) => s.trim()).filter(Boolean) })),
          experience,
          careerPreferences: careerPrefs,
        },
      };

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
    <div style={{ minHeight: "100vh", background: "var(--bg)", padding: "40px 20px 80px", fontFamily: "var(--font-body)" }}>
      <style>{`
        .cp-input {
          width: 100%;
          background: #f2f4f7;
          border: 1px solid transparent;
          border-radius: 10px;
          padding: 12px 14px;
          font-size: 13.5px;
          color: var(--text-primary);
          outline: none;
          font-family: var(--font-body);
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .cp-input::placeholder { color: #9aa5b1; }
        .cp-input:focus { background: #fff; border-color: var(--brand-600); box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
        .cp-row { display: flex; gap: 10px; flex-wrap: wrap; }
        .cp-row > * { flex: 1; min-width: 140px; }
        .cp-add-btn {
          display: inline-flex; align-items: center; gap: 6px;
          background: #eaf1fd; color: var(--brand-700); border: 1px solid #dbe7fb;
          border-radius: 10px; padding: 9px 16px; font-size: 12.5px; font-weight: 600;
          cursor: pointer; white-space: nowrap; transition: background 0.15s ease;
        }
        .cp-add-btn:hover { background: #dbe7fb; }
        .cp-entry-card {
          display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;
          background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 12px 14px;
        }
        .cp-remove-btn {
          background: none; border: none; color: var(--text-muted); cursor: pointer;
          display: flex; align-items: center; justify-content: center; padding: 4px; border-radius: 6px; flex-shrink: 0;
        }
        .cp-remove-btn:hover { background: #fef2f2; color: #dc2626; }
      `}</style>

      <div style={{ width: "100%", maxWidth: 680, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
          <Logo size={30} />
        </div>

        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 20,
            boxShadow: "var(--shadow-card)",
            padding: "40px 40px 32px",
          }}
        >
          {/* Header + live progress */}
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--brand-700)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Step 2 of 2
              </span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>{completion}% complete</span>
            </div>
            <div style={{ width: "100%", height: 6, background: "#eef1f7", borderRadius: 999, overflow: "hidden", marginBottom: 20 }}>
              <div
                style={{
                  width: `${completion}%`,
                  height: "100%",
                  background: "var(--brand-gradient)",
                  borderRadius: 999,
                  transition: "width 0.4s cubic-bezier(0.16,1,0.3,1)",
                }}
              />
            </div>
            <h1 style={{ fontSize: 25, fontWeight: 700, marginBottom: 6 }}>Complete your profile</h1>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 28 }}>
              A fuller profile means sharper prep plans and a more accurate readiness score.
            </p>
          </div>

          {error && (
            <p style={{ color: "#dc2626", fontSize: 13, marginBottom: 20, background: "#fef2f2", padding: "10px 14px", borderRadius: 10 }}>
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            {/* Skills */}
            <Section icon={Sparkles} title="Skills">
              <div style={{ display: "flex", gap: 8, marginBottom: skills.length ? 12 : 0 }}>
                <input
                  className="cp-input"
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
                />
                <button type="button" onClick={addSkill} className="cp-add-btn">
                  <Plus size={15} /> Add
                </button>
              </div>
              {skills.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {skills.map((skill) => (
                    <span key={skill} style={chipStyle}>
                      {skill}
                      <X size={13} style={{ cursor: "pointer" }} onClick={() => removeSkill(skill)} />
                    </span>
                  ))}
                </div>
              )}
            </Section>

            {/* Personal */}
            <Section icon={User} title="Personal details">
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <input className="cp-input" placeholder="Full name" value={personal.fullName} onChange={(e) => setPersonal({ ...personal, fullName: e.target.value })} />
                <div className="cp-row">
                  <input className="cp-input" placeholder="Phone" value={personal.phone} onChange={(e) => setPersonal({ ...personal, phone: e.target.value })} />
                  <input className="cp-input" placeholder="City" value={personal.city} onChange={(e) => setPersonal({ ...personal, city: e.target.value })} />
                </div>
                <div className="cp-row">
                  <input className="cp-input" placeholder="LinkedIn URL" value={personal.linkedIn} onChange={(e) => setPersonal({ ...personal, linkedIn: e.target.value })} />
                  <input className="cp-input" placeholder="GitHub URL" value={personal.github} onChange={(e) => setPersonal({ ...personal, github: e.target.value })} />
                </div>
              </div>
            </Section>

            {/* Academic */}
            <Section icon={GraduationCap} title="Academic record">
              <div className="cp-row">
                <input className="cp-input" placeholder="CGPA" value={academic.cgpa} onChange={(e) => setAcademic({ ...academic, cgpa: e.target.value })} />
                <input className="cp-input" placeholder="10th %" value={academic.tenth} onChange={(e) => setAcademic({ ...academic, tenth: e.target.value })} />
                <input className="cp-input" placeholder="12th %" value={academic.twelfth} onChange={(e) => setAcademic({ ...academic, twelfth: e.target.value })} />
              </div>
            </Section>

            {/* Coding profiles */}
            <Section icon={Code2} title="Coding profiles">
              <div className="cp-row">
                <input className="cp-input" placeholder="LeetCode username" value={coding.leetCode} onChange={(e) => setCoding({ ...coding, leetCode: e.target.value })} />
                <input className="cp-input" placeholder="CodeChef username" value={coding.codeChef} onChange={(e) => setCoding({ ...coding, codeChef: e.target.value })} />
              </div>
            </Section>

            {/* Projects */}
            <Section icon={FolderGit2} title="Projects">
              {projects.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
                  {projects.map((p, idx) => (
                    <div key={idx} className="cp-entry-card">
                      <div>
                        <p style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 2 }}>{p.name}</p>
                        <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                          {Array.isArray(p.techStack) ? p.techStack.join(", ") : p.techStack}
                        </p>
                      </div>
                      <button type="button" className="cp-remove-btn" onClick={() => setProjects(projects.filter((_, i) => i !== idx))}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <input className="cp-input" placeholder="Project name" value={projectDraft.name} onChange={(e) => setProjectDraft({ ...projectDraft, name: e.target.value })} />
                <div className="cp-row">
                  <input className="cp-input" placeholder="Tech stack (comma separated)" value={projectDraft.techStack} onChange={(e) => setProjectDraft({ ...projectDraft, techStack: e.target.value })} />
                  <input className="cp-input" placeholder="GitHub link" value={projectDraft.githubLink} onChange={(e) => setProjectDraft({ ...projectDraft, githubLink: e.target.value })} />
                </div>
                <button
                  type="button"
                  className="cp-add-btn"
                  style={{ alignSelf: "flex-start" }}
                  onClick={() => {
                    if (!projectDraft.name) return;
                    setProjects([...projects, projectDraft]);
                    setProjectDraft({ name: "", description: "", techStack: "", githubLink: "", liveLink: "" });
                  }}
                >
                  <Plus size={15} /> Add project
                </button>
              </div>
            </Section>

            {/* Experience */}
            <Section icon={Briefcase} title="Experience">
              {experience.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
                  {experience.map((exp, idx) => (
                    <div key={idx} className="cp-entry-card">
                      <div>
                        <p style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 2 }}>{exp.role} · {exp.company}</p>
                        <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>{exp.duration}</p>
                      </div>
                      <button type="button" className="cp-remove-btn" onClick={() => setExperience(experience.filter((_, i) => i !== idx))}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <input className="cp-input" placeholder="Company" value={experienceDraft.company} onChange={(e) => setExperienceDraft({ ...experienceDraft, company: e.target.value })} />
                <div className="cp-row">
                  <input className="cp-input" placeholder="Role" value={experienceDraft.role} onChange={(e) => setExperienceDraft({ ...experienceDraft, role: e.target.value })} />
                  <input className="cp-input" placeholder="Duration (e.g. Jun–Aug 2025)" value={experienceDraft.duration} onChange={(e) => setExperienceDraft({ ...experienceDraft, duration: e.target.value })} />
                </div>
                <button
                  type="button"
                  className="cp-add-btn"
                  style={{ alignSelf: "flex-start" }}
                  onClick={() => {
                    if (!experienceDraft.company) return;
                    setExperience([...experience, experienceDraft]);
                    setExperienceDraft({ company: "", role: "", duration: "", description: "" });
                  }}
                >
                  <Plus size={15} /> Add experience
                </button>
              </div>
            </Section>

            {/* Education */}
            <Section icon={School} title="Education" last>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <input
                  className="cp-input"
                  placeholder="Institution (e.g. JSPM's RSCOE, Pune)"
                  value={education.institution}
                  onChange={(e) => setEducation({ ...education, institution: e.target.value })}
                />
                <div className="cp-row">
                  <input
                    className="cp-input"
                    placeholder="Degree (e.g. B.Tech IT)"
                    value={education.degree}
                    onChange={(e) => setEducation({ ...education, degree: e.target.value })}
                  />
                  <input
                    className="cp-input"
                    placeholder="Year (e.g. 2027)"
                    value={education.year}
                    onChange={(e) => setEducation({ ...education, year: e.target.value })}
                  />
                </div>
              </div>
            </Section>

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

function Section({ icon: Icon, title, children, last }) {
  return (
    <div style={{ marginBottom: 26, paddingBottom: last ? 30 : 26, borderBottom: last ? "none" : "1px solid var(--border)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <div style={{ width: 26, height: 26, borderRadius: 8, background: "#eaf1fd", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand-600)" }}>
          <Icon size={13.5} />
        </div>
        <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-primary)" }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

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
  padding: "14px 0",
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
  boxShadow: "0 10px 20px -8px rgba(37,99,235,0.5)",
  marginTop: 4,
};
