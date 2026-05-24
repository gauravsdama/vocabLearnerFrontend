import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import Button from "../components/Button";
import Card from "../components/Card";
import Mascot from "../components/Mascot";
import Toast from "../components/Toast";
import { useAuth } from "../auth/AuthContext";
import { getErrorMessage } from "../utils/apiError";

export default function CheckEmail() {
  const navigate = useNavigate();
  const { user, resendVerification, verifyEmailCode, logout, refreshCurrentUser } = useAuth();
  const [code, setCode] = useState("");
  const [codeEntryVisible, setCodeEntryVisible] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const email = useMemo(() => user?.email ?? "your inbox", [user]);

  const onResend = async () => {
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      const response = await resendVerification();
      const nextUser = await refreshCurrentUser();
      setMessage(
        response.sent
          ? `Email verification code sent to ${email}.`
          : "Your email is already verified.",
      );
      if (response.sent) {
        setCodeEntryVisible(true);
      }
      if (nextUser?.email_verified !== false && !response.sent) {
        navigate("/", { replace: true });
      }
    } catch (err) {
      setError(getErrorMessage(err, "Unable to resend verification email"));
    } finally {
      setLoading(false);
    }
  };

  const onVerified = async () => {
    const nextUser = await refreshCurrentUser();
    if (nextUser?.email_verified !== false) {
      navigate("/", { replace: true });
      return;
    }
    setMessage("Your account is still waiting for email verification.");
  };

  const onVerifyCode = async () => {
    setError(null);
    setMessage(null);
    setVerifying(true);
    try {
      await verifyEmailCode(code);
      navigate("/", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "Unable to verify that code"));
    } finally {
      setVerifying(false);
    }
  };

  return (
    <AppShell centered maxWidth="narrow">
      <Card className="auth-card">
        <div className="form-mascot-row">
          <Mascot
            pose="happy_soft"
            alt="A gentle cat reassuring you during email verification."
            size="md"
            className="form-mascot"
          />
          <div className="stack">
            <span className="ds-label">Email verification</span>
            <h1 className="ds-h2">Check your inbox.</h1>
            <p className="helper">
              Your account stays locked to the verification flow until this email is verified.
            </p>
            <p className="helper">
              Send an email verification code to <strong>{email}</strong>, then enter it here.
            </p>
          </div>
        </div>
        <div className="form-stack">
          <Button type="button" fullWidth onClick={() => void onResend()} loading={loading}>
            {loading ? "Sending..." : codeEntryVisible ? "Resend email verification code" : "Send email verification code"}
          </Button>
          {codeEntryVisible ? (
            <>
              <label className="field">
                <span>Email verification code</span>
                <input
                  type="text"
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  placeholder="123456"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  className="ds-input"
                />
              </label>
              <Button
                type="button"
                fullWidth
                onClick={() => void onVerifyCode()}
                loading={verifying}
                disabled={!code.trim()}
              >
                {verifying ? "Verifying..." : "Verify code"}
              </Button>
            </>
          ) : null}
          <Button type="button" variant="secondary" fullWidth onClick={() => void onVerified()}>
            I already verified
          </Button>
          <Button type="button" variant="ghost" fullWidth onClick={() => void logout()}>
            Log out
          </Button>
        </div>
        <p className="helper ds-caption">
          Need to reset your password instead? <Link to="/forgot-password">Request a reset link</Link>
        </p>
      </Card>
      <Toast message={message ?? error} tone={message ? "info" : "error"} />
    </AppShell>
  );
}
