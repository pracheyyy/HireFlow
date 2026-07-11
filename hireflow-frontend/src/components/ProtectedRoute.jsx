import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// requireProfile: if true, also redirects to /complete-profile when profile isn't done yet
export default function ProtectedRoute({ children, requireProfile = false }) {
  const { user, loading, isProfileComplete } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}>
        Loading...
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  if (requireProfile && !isProfileComplete) {
    return <Navigate to="/complete-profile" replace />;
  }

  return children;
}
