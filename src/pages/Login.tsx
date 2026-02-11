import React, { useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../components/AppShell";
import Button from "../components/Button";
import Card from "../components/Card";
import Toast from "../components/Toast";
import { useAuth } from "../auth/AuthContext";
import { getErrorMessage } from "../utils/apiError";
import { getLastAuthDiagnostic } from "../utils/diagnostics";

export default function Login() {
  const { login } = useAuth();
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
      await login(email, password);
    } catch (err) {
      setError(getErrorMessage(err, "Login failed"));
      setLoading(false);
    }
  };

  return (
    <AppShell centered maxWidth="narrow">
      <Card className="auth-card">
        <div className="stack">
          <span className="ds-label">Welcome back</span>
          <h1 className="ds-h2">Log in to keep learning.</h1>
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
              placeholder="********"
              className="ds-input"
            />
          </label>
          <Button type="submit" fullWidth loading={loading} size="lg">
            {loading ? "Signing in..." : "Log in"}
          </Button>
        </form>
        <p className="helper ds-caption">
          New here? <Link to="/register">Create an account</Link>
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
