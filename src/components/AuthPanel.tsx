import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import GoogleLoginButton from "./GoogleLoginButton";
import Mascot from "./Mascot";
import Toast from "./Toast";
import { useAuth } from "../auth/AuthContext";
import { getErrorMessage } from "../utils/apiError";
import { getLastAuthDiagnostic } from "../utils/diagnostics";
import { copy } from "./marketing/content";
import { currentPolicyAcceptance } from "../auth/policy";

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
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [legalAccepted, setLegalAccepted] = useState(false);
  const showTraceUI =
    import.meta.env.DEV && import.meta.env.VITE_TRACE_UI === "true";
  const isLogin = mode === "login";
  const registrationBlocked = !isLogin && (!ageConfirmed || !legalAccepted);

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
    if (registrationBlocked) {
      setError(copy("auth.eligibilityError"));
      return;
    }
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
          ...currentPolicyAcceptance(),
        });
      }
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          isLogin ? copy("auth.loginError") : copy("auth.registrationError"),
        ),
      );
      setLoading(false);
    }
  };

  const onGoogleCredential = async (credential: string) => {
    if (registrationBlocked) {
      setError(copy("auth.eligibilityError"));
      return;
    }
    setError(null);
    setGoogleLoading(true);
    try {
      await authenticateWithGoogle(
        credential,
        isLogin ? undefined : currentPolicyAcceptance(),
      );
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          isLogin ? copy("auth.googleLoginError") : copy("auth.googleSignupError"),
        ),
      );
      setGoogleLoading(false);
    }
  };

  return (
    <div className="auth-panel">
      <div className="auth-tabs" role="tablist" aria-label={copy("auth.tabsAriaLabel")}>
        <button
          type="button"
          className={isLogin ? "auth-tab auth-tab-active" : "auth-tab"}
          onClick={() => setMode("login")}
          role="tab"
          aria-selected={isLogin}
        >
          {copy("auth.loginTab")}
        </button>
        <button
          type="button"
          className={!isLogin ? "auth-tab auth-tab-active" : "auth-tab"}
          onClick={() => setMode("register")}
          role="tab"
          aria-selected={!isLogin}
        >
          {copy("auth.signupTab")}
        </button>
      </div>

      <div className="stack">
        <div className="form-mascot-row">
          <Mascot pose="peek_left" decorative size="md" className="form-mascot" />
          <div className="stack">
            <span className="ds-label">
              {isLogin ? copy("auth.loginEyebrow") : copy("auth.signupEyebrow")}
            </span>
            <h1 className="ds-h2">
              {isLogin ? copy("auth.loginHeadline") : copy("auth.signupHeadline")}
            </h1>
            {isLogin ? (
              <p className="helper">
                {copy("auth.loginBody")}
              </p>
            ) : (
              <p className="helper">
                {copy("auth.signupBody")}
              </p>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="form-stack">
        {!isLogin ? (
          <label className="field">
            <span>{copy("auth.displayNameLabel")}</span>
            <input
              type="text"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              autoComplete="name"
              placeholder={copy("auth.displayNamePlaceholder")}
              className="ds-input"
            />
          </label>
        ) : null}
        <label className="field">
          <span>{copy("auth.emailLabel")}</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
            placeholder={copy("auth.emailPlaceholder")}
            className="ds-input"
          />
        </label>
        <label className="field">
          <span>{copy("auth.passwordLabel")}</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={isLogin ? undefined : 8}
            autoComplete={isLogin ? "current-password" : "new-password"}
            placeholder={
              isLogin
                ? copy("auth.loginPasswordPlaceholder")
                : copy("auth.signupPasswordPlaceholder")
            }
            className="ds-input"
          />
        </label>
        {!isLogin ? (
          <fieldset className="auth-consent-group">
            <legend>{copy("auth.eligibilityLegend")}</legend>
            <label className="field-consent auth-consent-row">
              <input
                type="checkbox"
                checked={ageConfirmed}
                onChange={(event) => setAgeConfirmed(event.target.checked)}
                required
              />
              <span>{copy("auth.ageConfirmation")}</span>
            </label>
            <label className="field-consent auth-consent-row">
              <input
                type="checkbox"
                checked={legalAccepted}
                onChange={(event) => setLegalAccepted(event.target.checked)}
                required
              />
              <span>
                {copy("auth.termsPrefix")} <Link to="/terms">{copy("auth.termsLabel")}</Link>{" "}
                {copy("auth.termsJoiner")} <Link to="/privacy">{copy("auth.privacyLabel")}</Link>.
              </span>
            </label>
          </fieldset>
        ) : null}
        <Button
          type="submit"
          fullWidth
          loading={loading}
          size="lg"
          disabled={registrationBlocked}
        >
          {loading
            ? isLogin
              ? copy("auth.signingIn")
              : copy("auth.creating")
            : isLogin
              ? copy("auth.loginSubmit")
              : copy("auth.signupSubmit")}
        </Button>
      </form>

      <div className="auth-link-row">
        {isLogin ? <Link to="/forgot-password">{copy("auth.forgotPassword")}</Link> : null}
        <button
          type="button"
          className="auth-inline-switch"
          onClick={() => setMode(isLogin ? "register" : "login")}
        >
          {isLogin ? copy("auth.switchToSignup") : copy("auth.switchToLogin")}
        </button>
      </div>

      <div className="auth-divider" aria-hidden>
        <span>{copy("auth.divider")}</span>
      </div>
      <GoogleLoginButton
        onCredential={onGoogleCredential}
        disabled={googleLoading || loading || registrationBlocked}
      />
      {showTraceUI && error && getLastAuthDiagnostic() ? (
        <Button variant="ghost" type="button" onClick={handleCopyDiagnostics}>
          Copy diagnostics
        </Button>
      ) : null}
      <Toast message={error} tone="error" />
    </div>
  );
}
