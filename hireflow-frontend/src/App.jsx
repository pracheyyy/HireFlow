import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";

import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import CompleteProfilePage from "./pages/CompleteProfilePage";
import DashboardHome from "./pages/DashboardHome";
import ResumeAnalyzer from "./pages/dashboard/ResumeAnalyzer";
import MockInterview from "./pages/dashboard/MockInterview";
import CodingTracker from "./pages/dashboard/CodingTracker";
import AIAssistant from "./pages/dashboard/AIAssistant";
import ProgressAnalytics from "./pages/dashboard/ProgressAnalytics";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />

          <Route
            path="/complete-profile"
            element={
              <ProtectedRoute>
                <CompleteProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requireProfile={false}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="resume" element={<ResumeAnalyzer />} />
            <Route path="interview" element={<MockInterview />} />
            <Route path="coding" element={<CodingTracker />} />
            <Route path="assistant" element={<AIAssistant />} />
            <Route path="analytics" element={<ProgressAnalytics />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
