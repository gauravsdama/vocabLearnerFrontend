import React, { useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../components/AppShell";
import Button from "../components/Button";
import Card from "../components/Card";
import Toast from "../components/Toast";
import { useAuth } from "../auth/AuthContext";
import { getErrorMessage } from "../utils/apiError";
import { getLastAuthDiagnostic } from "../utils/diagnostics";

export default function Register() {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const showTraceUI =
    import.meta.env.DEV && import.meta.env.VITE_TRACE_UI === "true";

  const handleCopyDiagnostics = async () => {
    const diagnostic = getLastAuthDiagnostic();
    if (!diagnostic) {
      return;
    }
    try {
      await navigator.clipboard.writeText(JSON.stringify(diagnostic, null, 2));
    } catch {
      // ignore clipboard failures
    }
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(email, password);
    } catch (err) {
      setError(getErrorMessage(err, "Registration failed"));
      setLoading(false);
    }
  };

  return (
    <AppShell centered maxWidth="narrow">
      <Card className="auth-card">
        <div className="stack">
          <span className="ds-label">Get started</span>
          <h1 className="ds-h2">Build a daily word habit.</h1>
        </div>
        <form onSubmit={onSubmit} className="form-stack">
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder="you@example.com"
              className="ds-input"
            />
          </label>
          <label className="field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              placeholder="Create a strong password"
              className="ds-input"
            />
          </label>
          <Button type="submit" fullWidth loading={loading} size="lg">
            {loading ? "Creating..." : "Create account"}
          </Button>
        </form>
        <p className="helper ds-caption">
          Have an account? <Link to="/login">Log in</Link>
        </p>
        {showTraceUI && error && getLastAuthDiagnostic() ? (
          <Button variant="ghost" type="button" onClick={handleCopyDiagnostics}>
            Copy diagnostics
          </Button>
        ) : null}
      </Card>
      <Toast message={error} tone="error" />
    </AppShell>
  );
}
