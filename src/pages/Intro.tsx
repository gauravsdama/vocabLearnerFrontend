import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import AuthPanel from "../components/AuthPanel";
import Modal from "../components/Modal";
import RouteLoading from "../components/RouteLoading";
import CTASection from "../components/marketing/CTASection";
import AudienceValueSection from "../components/marketing/AudienceValueSection";
import HabitSection from "../components/marketing/HabitSection";
import HeroSection from "../components/marketing/HeroSection";
import ProblemSection from "../components/marketing/ProblemSection";
import ReminderSummarySection from "../components/marketing/ReminderSummarySection";
import ScrollDemoSection from "../components/marketing/ScrollDemoSection";
import SolutionSection from "../components/marketing/SolutionSection";
import MarketingFooter from "../components/marketing/MarketingFooter";
import { copy } from "../components/marketing/content";
import "../marketing.css";

type AuthMode = "login" | "register";

export default function Intro() {
  const navigate = useNavigate();
  const { token, user, loading } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("register");

  if (loading) {
    return <RouteLoading />;
  }

  if (token && user?.email_verified === false) {
    return <Navigate to="/check-email" replace />;
  }

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  const openAuth = (mode: AuthMode) => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  return (
    <>
      <div className="marketing-page">
        <a className="skip-link" href="#main-content">
          {copy("nav.skipToContent")}
        </a>
        <HeroSection
          onStartLearning={() => openAuth("register")}
          onLogin={() => openAuth("login")}
        />
        <main id="main-content">
          <ScrollDemoSection />
          <ProblemSection />
          <SolutionSection />
          <HabitSection />
          <ReminderSummarySection />
          <AudienceValueSection />
          <CTASection
            onGetStarted={() => openAuth("register")}
            onViewDemo={() => navigate("/demo")}
          />
        </main>
        <MarketingFooter />
      </div>

      <Modal
        open={authOpen}
        title={
          authMode === "register"
            ? copy("auth.modal.registerTitle")
            : copy("auth.modal.loginTitle")
        }
        closeLabel={copy("auth.modal.close")}
        onClose={() => setAuthOpen(false)}
      >
        <AuthPanel initialMode={authMode} />
      </Modal>
    </>
  );
}
