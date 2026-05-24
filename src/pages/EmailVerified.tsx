import { Link } from "react-router-dom";
import AppShell from "../components/AppShell";
import Card from "../components/Card";
import Mascot from "../components/Mascot";
import { useAuth } from "../auth/AuthContext";

export default function EmailVerified() {
  const { token } = useAuth();

  return (
    <AppShell centered maxWidth="narrow">
      <Card className="auth-card">
        <div className="success-mascot-stack">
          <Mascot
            pose="celebrate"
            alt="A celebratory cat marking that your account is verified."
            size="lg"
            className="success-mascot"
          />
          <div className="stack">
            <span className="ds-label">Email verified</span>
            <h1 className="ds-h2">You can continue learning.</h1>
            <p className="helper">
              Your account is now verified and core study features are unlocked.
            </p>
          </div>
        </div>
        {token ? (
          <Link to="/" className="button button-primary button-lg button-block">
            <span className="button-label">Continue to the app</span>
          </Link>
        ) : (
          <Link to="/login" className="button button-primary button-lg button-block">
            <span className="button-label">Log in</span>
          </Link>
        )}
      </Card>
    </AppShell>
  );
}
