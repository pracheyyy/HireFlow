import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Facebook, Chrome, Linkedin, Eye, EyeOff, Loader2 } from "lucide-react";
import { registerUser, loginUser, googleLoginUrl } from "../api/auth.api";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({ name: "", email: "", password: "" });

  const switchMode = (mode) => {
    setError("");
    setInfo("");
    setIsSignUp(mode);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await loginUser(loginForm);
      login(user);
      const hasProfile = user.skills?.length > 0 || user.education?.length > 0;
      navigate(hasProfile ? "/dashboard" : "/complete-profile");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registerUser(signupForm);
      setInfo("Account created! Check your email to verify before signing in.");
      setIsSignUp(false);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <style>{`
        .auth-screen {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #eef1f7 0%, #e4e9f2 100%);
          font-family: 'Poppins', 'Segoe UI', sans-serif;
          padding: 20px;
        }

        .auth-card {
          position: relative;
          width: 780px;
          max-width: 100%;
          min-height: 480px;
          background: #fff;
          border-radius: 22px;
          box-shadow: 0 25px 60px -15px rgba(30, 58, 138, 0.25), 0 10px 25px -10px rgba(0,0,0,0.08);
          overflow: hidden;
        }

        .form-panel {
          position: absolute;
          top: 0;
          height: 100%;
          width: 50%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 48px 44px;
          transition: transform 0.7s cubic-bezier(0.65, 0, 0.35, 1), opacity 0.6s ease;
        }

        .sign-in-panel {
          left: 0;
          z-index: 2;
          transform: translateX(${isSignUp ? "100%" : "0"});
          opacity: ${isSignUp ? 0 : 1};
          pointer-events: ${isSignUp ? "none" : "auto"};
        }

        .sign-up-panel {
          left: 0;
          z-index: 1;
          transform: translateX(${isSignUp ? "100%" : "0%"});
          opacity: ${isSignUp ? 1 : 0};
          pointer-events: ${isSignUp ? "auto" : "none"};
        }

        .overlay-container {
          position: absolute;
          top: 0;
          left: 50%;
          width: 50%;
          height: 100%;
          overflow: hidden;
          transition: transform 0.7s cubic-bezier(0.65, 0, 0.35, 1);
          transform: translateX(${isSignUp ? "-100%" : "0"});
          z-index: 10;
        }

        .overlay {
          position: relative;
          height: 100%;
          width: 200%;
          left: -100%;
          background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 55%, #3b82f6 100%);
          transform: translateX(${isSignUp ? "50%" : "0"});
          transition: transform 0.7s cubic-bezier(0.65, 0, 0.35, 1);
          display: flex;
        }

        .overlay-panel {
          position: relative;
          width: 50%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 0 40px;
          color: #fff;
        }

        .social-icon {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: 1px solid #d8dee9;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #4a5568;
          cursor: pointer;
          transition: all 0.2s ease;
          background: #fff;
        }
        .social-icon:hover {
          background: #f1f5f9;
          transform: translateY(-2px);
        }

        .auth-input {
          width: 100%;
          background: #f2f4f7;
          border: 1px solid transparent;
          border-radius: 10px;
          padding: 13px 16px;
          font-size: 14px;
          color: #1f2937;
          outline: none;
          transition: border-color 0.2s ease, background 0.2s ease;
        }
        .auth-input::placeholder { color: #94a3b8; }
        .auth-input:focus {
          background: #fff;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
        }

        .auth-btn {
          background: linear-gradient(135deg, #1e3a8a, #2563eb);
          color: #fff;
          border: none;
          border-radius: 999px;
          padding: 13px 46px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          cursor: pointer;
          box-shadow: 0 10px 20px -8px rgba(37, 99, 235, 0.55);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .auth-btn:hover:not(:disabled) { transform: translateY(-2px); }
        .auth-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .ghost-btn {
          background: transparent;
          border: 1.5px solid #fff;
          color: #fff;
          border-radius: 999px;
          padding: 11px 40px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .ghost-btn:hover { background: rgba(255,255,255,0.15); }

        @media (max-width: 760px) {
          .auth-card { min-height: 620px; }
          .form-panel { width: 100%; padding: 40px 28px; }
          .sign-up-panel { transform: translateY(${isSignUp ? "0" : "100%"}); opacity: ${isSignUp ? 1 : 0}; }
          .sign-in-panel { transform: translateY(${isSignUp ? "-100%" : "0"}); opacity: ${isSignUp ? 0 : 1}; }
          .overlay-container { display: none; }
          .mobile-toggle { display: flex !important; }
        }
      `}</style>

      <div className="auth-card">
        {/* Mobile toggle (hidden on desktop) */}
        <div className="mobile-toggle" style={{ display: "none", position: "absolute", top: 16, right: 16, zIndex: 20, gap: 8 }}>
          <button onClick={() => switchMode(false)} style={{ fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 999, border: "none", cursor: "pointer", background: !isSignUp ? "#2563eb" : "#e5e7eb", color: !isSignUp ? "#fff" : "#475569" }}>Sign In</button>
          <button onClick={() => switchMode(true)} style={{ fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 999, border: "none", cursor: "pointer", background: isSignUp ? "#2563eb" : "#e5e7eb", color: isSignUp ? "#fff" : "#475569" }}>Sign Up</button>
        </div>

        {/* SIGN IN FORM */}
        <form className="form-panel sign-in-panel" onSubmit={handleLogin}>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: "#111827", marginBottom: 18 }}>Sign In</h2>

          <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
            <span className="social-icon"><Facebook size={18} /></span>
            <span className="social-icon"><Chrome size={18} /></span>
            <span className="social-icon" onClick={() => (window.location.href = googleLoginUrl())}><Linkedin size={18} /></span>
          </div>

          <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 16 }}>or use your account</p>

          {!isSignUp && error && (
            <p style={{ color: "#dc2626", fontSize: 12, marginBottom: 10 }}>{error}</p>
          )}
          {!isSignUp && info && (
            <p style={{ color: "#059669", fontSize: 12, marginBottom: 10 }}>{info}</p>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 10 }}>
            <input
              className="auth-input"
              type="email"
              placeholder="Email Address"
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              required
            />
            <div style={{ position: "relative" }}>
              <input
                className="auth-input"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                required
                style={{ paddingRight: 42 }}
              />
              <span
                onClick={() => setShowPassword((s) => !s)}
                style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#94a3b8" }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </span>
            </div>
          </div>

          <a href="#forgot" style={{ fontSize: 12, color: "#2563eb", textDecoration: "none", marginBottom: 18, alignSelf: "flex-start" }}>
            Forgot your password?
          </a>

          <button type="submit" className="auth-btn" disabled={loading} style={{ marginTop: 18, alignSelf: "flex-start" }}>
            {loading && !isSignUp ? <Loader2 size={14} className="spin" /> : null}
            Sign In
          </button>
        </form>

        {/* SIGN UP FORM */}
        <form className="form-panel sign-up-panel" onSubmit={handleSignup}>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: "#111827", marginBottom: 18 }}>Create Account</h2>

          <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
            <span className="social-icon"><Facebook size={18} /></span>
            <span className="social-icon" onClick={() => (window.location.href = googleLoginUrl())}><Chrome size={18} /></span>
            <span className="social-icon"><Linkedin size={18} /></span>
          </div>

          <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 16 }}>or use your email for registration</p>

          {isSignUp && error && (
            <p style={{ color: "#dc2626", fontSize: 12, marginBottom: 10 }}>{error}</p>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              className="auth-input"
              type="text"
              placeholder="Full Name"
              value={signupForm.name}
              onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
              required
            />
            <input
              className="auth-input"
              type="email"
              placeholder="Email Address"
              value={signupForm.email}
              onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
              required
            />
            <input
              className="auth-input"
              type="password"
              placeholder="Password"
              value={signupForm.password}
              onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading} style={{ marginTop: 20, alignSelf: "flex-start" }}>
            {loading && isSignUp ? <Loader2 size={14} className="spin" /> : null}
            Sign Up
          </button>
        </form>

        {/* SLIDING OVERLAY */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel">
              <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 14 }}>Welcome Back!</h2>
              <p style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.9, marginBottom: 26 }}>
                Stay connected by logging in with your credentials and continue your experience
              </p>
              <button className="ghost-btn" onClick={() => switchMode(false)} type="button">
                Sign In
              </button>
            </div>
            <div className="overlay-panel">
              <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 14 }}>Hey There!</h2>
              <p style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.9, marginBottom: 26 }}>
                Begin your amazing journey by creating an account with us today
              </p>
              <button className="ghost-btn" onClick={() => switchMode(true)} type="button">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
