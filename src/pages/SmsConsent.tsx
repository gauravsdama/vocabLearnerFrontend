import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import Button from "../components/Button";
import Card from "../components/Card";
import Toast from "../components/Toast";
import { apiGet, apiPost } from "../api/client";
import type { SmsOptInRequest, UserProfileResponse } from "../api/types";
import { getErrorMessage } from "../utils/apiError";
import { logError, logInfo } from "../utils/logger";

const TWILIO_CONSENT_VERSION = "2026-04-29";

export default function SmsConsent() {
  const navigate = useNavigate();
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [twilioActive, setTwilioActive] = useState(false);
  const [phone, setPhone] = useState("");
  const [smsOptIn, setSmsOptIn] = useState(false);
  const [smsConsentAccepted, setSmsConsentAccepted] = useState(false);
  const [smsLoading, setSmsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const refreshProfile = useCallback(async () => {
    try {
      logInfo("WEB_SMS_SETTINGS_LOAD_START", "SMS settings load started", {
        method: "GET",
        url: "/users/me",
      });
      const data = await apiGet<UserProfileResponse>("/users/me");
      logInfo("WEB_SMS_SETTINGS_LOAD_OK", "SMS settings load succeeded", {
        method: "GET",
        url: "/users/me",
        status: 200,
      });
      setSmsOptIn(Boolean(data.sms_opt_in));
      setSmsConsentAccepted(Boolean(data.sms_opt_in));
      setPhone(data.phone_e164 ?? "");
      setSmsEnabled(data.sms_enabled ?? true);
      setTwilioActive(Boolean(data.twilio_active));
    } catch (err) {
      logError("WEB_SMS_SETTINGS_LOAD_FAIL", "SMS settings load failed", {
        method: "GET",
        url: "/users/me",
        status: (err as { status?: number }).status ?? null,
        server_request_id: (err as { requestId?: string }).requestId ?? null,
        client_request_id:
          (err as { clientRequestId?: string }).clientRequestId ?? null,
      });
      setError(getErrorMessage(err, "Failed to load SMS settings"));
    }
  }, []);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const handleOptIn = async () => {
    if (!phone.trim()) {
      setError("Enter a phone number in E.164 format.");
      return;
    }
    if (!smsConsentAccepted) {
      setError("You must agree to the Twilio SMS consent terms before opting in.");
      return;
    }
    setError(null);
    setSuccess(null);
    setSmsLoading(true);
    try {
      logInfo("WEB_SMS_OPTIN_START", "SMS opt-in started", {
        method: "POST",
        url: "/users/me/sms/opt-in",
      });
      const payload: SmsOptInRequest = {
        phone_e164: phone.trim(),
        consent_accepted: true,
        consent_version: TWILIO_CONSENT_VERSION,
      };
      await apiPost<UserProfileResponse>("/users/me/sms/opt-in", payload);
      logInfo("WEB_SMS_OPTIN_OK", "SMS opt-in succeeded", {
        method: "POST",
        url: "/users/me/sms/opt-in",
        status: 200,
      });
      setSuccess("SMS opt-in complete.");
      refreshProfile();
    } catch (err) {
      logError("WEB_SMS_OPTIN_FAIL", "SMS opt-in failed", {
        method: "POST",
        url: "/users/me/sms/opt-in",
        status: (err as { status?: number }).status ?? null,
        server_request_id: (err as { requestId?: string }).requestId ?? null,
        client_request_id:
          (err as { clientRequestId?: string }).clientRequestId ?? null,
      });
      setError(getErrorMessage(err, "Failed to opt in"));
    } finally {
      setSmsLoading(false);
    }
  };

  const handleOptOut = async () => {
    setError(null);
    setSuccess(null);
    setSmsLoading(true);
    try {
      logInfo("WEB_SMS_OPTOUT_START", "SMS opt-out started", {
        method: "POST",
        url: "/users/me/sms/opt-out",
      });
      await apiPost<UserProfileResponse>("/users/me/sms/opt-out");
      logInfo("WEB_SMS_OPTOUT_OK", "SMS opt-out succeeded", {
        method: "POST",
        url: "/users/me/sms/opt-out",
        status: 200,
      });
      setSuccess("SMS opt-out complete.");
      refreshProfile();
    } catch (err) {
      logError("WEB_SMS_OPTOUT_FAIL", "SMS opt-out failed", {
        method: "POST",
        url: "/users/me/sms/opt-out",
        status: (err as { status?: number }).status ?? null,
        server_request_id: (err as { requestId?: string }).requestId ?? null,
        client_request_id:
          (err as { clientRequestId?: string }).clientRequestId ?? null,
      });
      setError(getErrorMessage(err, "Failed to opt out"));
    } finally {
      setSmsLoading(false);
    }
  };

  const smsAvailable = smsEnabled && twilioActive;
  const smsStatusLabel = smsAvailable
    ? smsOptIn
      ? "Active"
      : "Available"
    : smsEnabled
      ? "Not active"
      : "Disabled";
  const smsStatusClassName = smsAvailable
    ? smsOptIn
      ? "badge-success"
      : "badge-info"
    : "badge-neutral";
  const smsDescription = smsAvailable
    ? smsOptIn
      ? "SMS reminders are enabled for this phone."
      : "Complete the consent form below to enable Twilio-powered study reminders."
    : smsEnabled
      ? "SMS delivery is not active for this account yet, so opt-in is unavailable."
      : "SMS is disabled for this account.";

  return (
    <AppShell
      eyebrow="Preferences"
      title="Twilio SMS consent."
      subtitle="Manage study reminder texts and confirm consent for your phone number."
      maxWidth="narrow"
      action={
        <Button variant="ghost" onClick={() => navigate("/settings")}>
          Back to settings
        </Button>
      }
    >
      <Card className="form-card">
        <div className="form-stack">
          <div className="stack">
            <h2 className="ds-h2">SMS reminders</h2>
            <p className="ds-body muted">{smsDescription}</p>
          </div>
          <div className="actions">
            <span className={`badge ${smsStatusClassName}`}>{smsStatusLabel}</span>
          </div>
          <label className="field">
            <span>Phone (E.164)</span>
            <input
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="+14155552671"
              className="ds-input"
              disabled={!smsAvailable || smsLoading}
            />
          </label>
          <div className="sms-consent-card">
            <div className="stack">
              <div className="stack">
                <strong className="sms-consent-title">Twilio SMS consent</strong>
                <p className="sms-consent-note">
                  By checking the box below, you agree to receive automated study
                  reminder text messages from VocabCat at the phone number above
                  using Twilio. Message frequency varies based on your settings.
                  Message and data rates may apply. Consent is not a condition of
                  purchase. Reply STOP to opt out and HELP for help.
                </p>
              </div>
              <label className="field field-consent">
                <input
                  type="checkbox"
                  checked={smsConsentAccepted}
                  onChange={(event) => setSmsConsentAccepted(event.target.checked)}
                  disabled={!smsAvailable || smsLoading}
                />
                <span>
                  I confirm that I am the subscriber for this phone number, or I
                  have permission to receive Twilio-powered VocabCat reminders at
                  this number.
                </span>
              </label>
            </div>
          </div>
          <div className="actions">
            <Button
              onClick={handleOptIn}
              disabled={!smsAvailable || smsLoading || !smsConsentAccepted}
              loading={smsLoading}
            >
              {smsLoading ? "Updating..." : smsOptIn ? "Update phone" : "Opt in"}
            </Button>
            <Button
              variant="ghost"
              onClick={handleOptOut}
              disabled={!smsOptIn || smsLoading}
            >
              Opt out
            </Button>
          </div>
        </div>
      </Card>
      <Toast message={error ?? success} tone={error ? "error" : "info"} />
    </AppShell>
  );
}
