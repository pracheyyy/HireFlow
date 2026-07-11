import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getCurrentUser, logoutUser as apiLogout } from "../api/auth.api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback((userData) => setUser(userData), []);

  const logout = useCallback(async () => {
    await apiLogout();
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

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
