import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AppShell from "../components/AppShell";
import Button from "../components/Button";
import Card from "../components/Card";
import Toast from "../components/Toast";
import { useAuth } from "../auth/AuthContext";
import { getErrorMessage } from "../utils/apiError";

export default function ResetPassword() {
  const { resetPassword } = useAuth();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const token = searchParams.get("token")?.trim() || "";

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    if (!token) {
      setError("This reset link is missing a token.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const responseMessage = await resetPassword(token, password);
      setMessage(responseMessage);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to reset password"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell centered maxWidth="narrow">
      <Card className="auth-card">
        <div className="stack">
          <span className="ds-label">Password reset</span>
          <h1 className="ds-h2">Choose a new password.</h1>
        </div>
        <form onSubmit={onSubmit} className="form-stack">
          <label className="field">
            <span>New password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
              className="ds-input"
            />
          </label>
          <label className="field">
            <span>Confirm password</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              minLength={8}
              className="ds-input"
            />
          </label>
          <Button type="submit" fullWidth loading={loading} size="lg">
            {loading ? "Updating..." : "Update password"}
          </Button>
        </form>
        <p className="helper ds-caption">
          Back to <Link to="/login">login</Link>
        </p>
      </Card>
      <Toast message={message ?? error} tone={message ? "info" : "error"} />
    </AppShell>
  );
}
