import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutGrid, FileText, Mic, Code2, Bot, BarChart3, LogOut } from "lucide-react";
import Logo from "../Logo";
import { useAuth } from "../../context/AuthContext";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Overview", icon: LayoutGrid, end: true },
  { to: "/dashboard/resume", label: "Upload Resume", icon: FileText },
  { to: "/dashboard/interview", label: "Start Interview", icon: Mic },
  { to: "/dashboard/coding", label: "Coding Tracker", icon: Code2 },
  { to: "/dashboard/assistant", label: "AI Assistant", icon: Bot },
  { to: "/dashboard/analytics", label: "Progress Analytics", icon: BarChart3 },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const initials = (user?.name || "U")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)", fontFamily: "var(--font-body)" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 240,
          flexShrink: 0,
          background: "var(--surface)",
          borderRight: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          padding: "24px 16px",
        }}
      >
        <div style={{ padding: "0 8px", marginBottom: 32 }}>
          <Logo size={26} />
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 14px",
                borderRadius: 10,
                fontSize: 13.5,
                fontWeight: 500,
                textDecoration: "none",
                color: isActive ? "#fff" : "var(--text-secondary)",
                background: isActive ? "var(--brand-gradient)" : "transparent",
                boxShadow: isActive ? "0 8px 16px -8px rgba(37,99,235,0.5)" : "none",
                transition: "all 0.15s ease",
              })}
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 14px",
            borderRadius: 10,
            fontSize: 13.5,
            fontWeight: 500,
            color: "var(--text-secondary)",
            background: "none",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          <LogOut size={17} /> Sign out
        </button>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <header
          style={{
            height: 64,
            borderBottom: "1px solid var(--border)",
            background: "var(--surface)",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "0 28px",
            gap: 12,
          }}
        >
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 13, fontWeight: 600 }}>{user?.name}</p>
            <p style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{user?.role === "admin" ? "Admin" : "Student"}</p>
          </div>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "var(--brand-gradient)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {initials}
          </div>
        </header>

        <main style={{ flex: 1, padding: 32 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
