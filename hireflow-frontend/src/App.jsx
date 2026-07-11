import { useEffect, useState } from "react";
import AuthPage from "./pages/AuthPage";
import { getCurrentUser } from "./api/auth.api";

export default function App() {
  const [user, setUser] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // On app load, try to restore session via the refresh cookie
    getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setChecked(true));
  }, []);

  if (!checked) return null; // or a loading spinner

  if (!user) {
    return <AuthPage onAuthSuccess={setUser} />;
  }

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>Welcome, {user.name} 👋</h1>
      <p>You're logged in as {user.email} ({user.role})</p>
    </div>
  );
}
