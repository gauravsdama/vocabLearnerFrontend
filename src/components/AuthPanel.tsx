import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import GoogleLoginButton from "./GoogleLoginButton";
import Mascot from "./Mascot";
import Toast from "./Toast";
import { useAuth } from "../auth/AuthContext";
import { getErrorMessage } from "../utils/apiError";
import { getLastAuthDiagnostic } from "../utils/diagnostics";

type AuthMode = "login" | "register";

type AuthPanelProps = {
  initialMode?: AuthMode;
};

export default function AuthPanel({ initialMode = "login" }: AuthPanelProps) {
  const { login, register, authenticateWithGoogle } = useAuth();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const showTraceUI =
    import.meta.env.DEV && import.meta.env.VITE_TRACE_UI === "true";
  const isLogin = mode === "login";

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
      if (isLogin) {
        await login(email.trim(), password);
      } else {
        await register({
          email: email.trim(),
          password,
          displayName: displayName.trim() || undefined,
        });
      }
    } catch (err) {
      setError(getErrorMessage(err, isLogin ? "Login failed" : "Registration failed"));
      setLoading(false);
    }
  };

  const onGoogleCredential = async (credential: string) => {
    setError(null);
    setGoogleLoading(true);
    try {
      await authenticateWithGoogle(credential);
    } catch (err) {
      setError(getErrorMessage(err, isLogin ? "Google login failed" : "Google signup failed"));
      setGoogleLoading(false);
    }
  };

  return (
    <div className="auth-panel">
      <div className="auth-tabs" role="tablist" aria-label="Authentication options">
        <button
          type="button"
          className={isLogin ? "auth-tab auth-tab-active" : "auth-tab"}
          onClick={() => setMode("login")}
          role="tab"
          aria-selected={isLogin}
        >
          Log in
        </button>
        <button
          type="button"
          className={!isLogin ? "auth-tab auth-tab-active" : "auth-tab"}
          onClick={() => setMode("register")}
          role="tab"
          aria-selected={!isLogin}
        >
          Sign up
        </button>
      </div>

      <div className="stack">
        <div className="form-mascot-row">
          <Mascot pose="peek_left" decorative size="md" className="form-mascot" />
          <div className="stack">
            <span className="ds-label">{isLogin ? "Welcome back" : "Get started"}</span>
            <h1 className="ds-h2">
              {isLogin ? "Log in to keep learning." : "Build a daily word habit."}
            </h1>
            {isLogin ? (
              <p className="helper">
                Sign in quickly with your Google account or use email and password.
              </p>
            ) : (
              <p className="helper">
                Start with a short setup, then let the feed and quizzes build the habit.
              </p>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="form-stack">
        {!isLogin ? (
          <label className="field">
            <span>Display name</span>
            <input
              type="text"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              autoComplete="name"
              placeholder="What should we call you?"
              className="ds-input"
            />
          </label>
        ) : null}
        <label className="field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
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
            minLength={isLogin ? undefined : 8}
            autoComplete={isLogin ? "current-password" : "new-password"}
            placeholder={isLogin ? "********" : "Create a strong password"}
            className="ds-input"
          />
        </label>
        <Button type="submit" fullWidth loading={loading} size="lg">
          {loading
            ? isLogin
              ? "Signing in..."
              : "Creating..."
            : isLogin
              ? "Log in"
              : "Create account"}
        </Button>
      </form>

      <div className="auth-link-row">
        {isLogin ? <Link to="/forgot-password">Forgot your password?</Link> : null}
        <button
          type="button"
          className="auth-inline-switch"
          onClick={() => setMode(isLogin ? "register" : "login")}
        >
          {isLogin ? "New here? Create an account" : "Have an account? Log in"}
        </button>
      </div>

      <div className="auth-divider" aria-hidden>
        <span>or</span>
      </div>
      <GoogleLoginButton onCredential={onGoogleCredential} disabled={googleLoading || loading} />
      {showTraceUI && error && getLastAuthDiagnostic() ? (
        <Button variant="ghost" type="button" onClick={handleCopyDiagnostics}>
          Copy diagnostics
        </Button>
      ) : null}
      <Toast message={error} tone="error" />
    </div>
  );
}
