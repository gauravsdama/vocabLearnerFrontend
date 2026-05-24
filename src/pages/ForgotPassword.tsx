import React, { useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../components/AppShell";
import Button from "../components/Button";
import Card from "../components/Card";
import Toast from "../components/Toast";
import { useAuth } from "../auth/AuthContext";
import { getErrorMessage } from "../utils/apiError";

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      const responseMessage = await forgotPassword(email.trim());
      setMessage(responseMessage);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to start password reset"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell centered maxWidth="narrow">
      <Card className="auth-card">
        <div className="stack">
          <span className="ds-label">Password reset</span>
          <h1 className="ds-h2">Request a reset link.</h1>
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
          <Button type="submit" fullWidth loading={loading} size="lg">
            {loading ? "Sending..." : "Send reset link"}
          </Button>
        </form>
        <p className="helper ds-caption">
          Remembered it? <Link to="/login">Back to login</Link>
        </p>
      </Card>
      <Toast message={message ?? error} tone={message ? "info" : "error"} />
    </AppShell>
  );
}
