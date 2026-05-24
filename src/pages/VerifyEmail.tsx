import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AppShell from "../components/AppShell";
import Button from "../components/Button";
import Card from "../components/Card";
import { apiGet } from "../api/client";
import type { VerifyEmailResponse } from "../api/types";
import { useAuth } from "../auth/AuthContext";
import { getErrorMessage } from "../utils/apiError";

type VerifyState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; alreadyVerified: boolean };

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { markEmailVerified } = useAuth();
  const [state, setState] = useState<VerifyState>({ status: "loading" });

  useEffect(() => {
    const tokenParam = searchParams.get("token")?.trim() ?? "";
    if (!tokenParam) {
      setState({ status: "error", message: "This verification link is missing a token." });
      return;
    }

    let cancelled = false;

    async function verify() {
      try {
        const response = await apiGet<VerifyEmailResponse>(
          `/auth/verify-email?token=${encodeURIComponent(tokenParam)}`,
          { omitAuth: true, skipAuthRefresh: true },
        );
        await markEmailVerified();
        if (!cancelled) {
          setState({
            status: "success",
            alreadyVerified: Boolean(response.already_verified),
          });
          window.setTimeout(() => {
            navigate("/email-verified", { replace: true });
          }, 800);
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            status: "error",
            message: getErrorMessage(error, "Unable to verify your email"),
          });
        }
      }
    }

    void verify();

    return () => {
      cancelled = true;
    };
  }, [markEmailVerified, navigate, searchParams]);

  return (
    <AppShell centered maxWidth="narrow">
      <Card className="auth-card">
        {state.status === "loading" ? (
          <div className="stack">
            <span className="ds-label">Email verification</span>
            <h1 className="ds-h2">Verifying your email.</h1>
            <p className="helper">Please wait while we confirm your link.</p>
          </div>
        ) : null}
        {state.status === "success" ? (
          <div className="stack">
            <span className="ds-label">Email verified</span>
            <h1 className="ds-h2">{state.alreadyVerified ? "You were already verified." : "Your email is verified."}</h1>
            <p className="helper">Redirecting you now.</p>
          </div>
        ) : null}
        {state.status === "error" ? (
          <div className="stack">
            <span className="ds-label">Verification failed</span>
            <h1 className="ds-h2">We could not verify this link.</h1>
            <p className="helper">{state.message}</p>
            <div className="actions">
              <Button type="button" variant="secondary" onClick={() => navigate("/check-email")}>
                Go to verification page
              </Button>
              <Link to="/login">Back to login</Link>
            </div>
          </div>
        ) : null}
      </Card>
    </AppShell>
  );
}
