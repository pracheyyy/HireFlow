import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getCurrentUser, logoutUser as apiLogout } from "../api/auth.api";

const AuthContext = createContext(null);

// Dev-only: set VITE_SKIP_AUTH=true in .env to preview logged-in pages without a running backend.
// Never true in a real build unless you explicitly set the env var.
const SKIP_AUTH = import.meta.env?.VITE_SKIP_AUTH === "true";

const MOCK_USER = {
  id: "dev-user",
  name: "Prachi Dev",
  email: "dev@example.com",
  role: "student",
  skills: ["React", "Node.js"],
  education: [{ institution: "JSPM RSCOE", degree: "B.Tech IT", year: "2027" }],
  isVerified: true,
  provider: "local",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(SKIP_AUTH ? MOCK_USER : null);
  const [loading, setLoading] = useState(!SKIP_AUTH);

  useEffect(() => {
    if (SKIP_AUTH) return; // skip the /auth/me call entirely in dev-bypass mode

    getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback((userData) => setUser(userData), []);

  const logout = useCallback(async () => {
    if (!SKIP_AUTH) await apiLogout();
    setUser(null);
  }, []);

  const updateUser = useCallback((partial) => {
    setUser((prev) => (prev ? { ...prev, ...partial } : prev));
  }, []);

  // A profile counts as "complete" once they have at least one skill and one education entry
  const isProfileComplete = !!user && (user.skills?.length > 0 || user.education?.length > 0);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser, isProfileComplete }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
