import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import Button from "../components/Button";
import Card from "../components/Card";
import Toast from "../components/Toast";
import { apiGet, apiPatch, apiPost } from "../api/client";
import type {
  MessageDTO,
  SmsOptInRequest,
  UserFeatures,
  UserProfileResponse,
  UserProfileUpdate,
} from "../api/types";
import { getErrorMessage } from "../utils/apiError";
import { logError, logInfo } from "../utils/logger";
import { useMessages } from "../components/MessageCenter";

const FALLBACK_TIMEZONE = "UTC";
const DEFAULT_WORDS_PER_WEEK = 20;
const DEFAULT_TEXTS_PER_WEEK = 3;
const MIN_WORDS_PER_WEEK = 7;
const MAX_WORDS_PER_WEEK = 210;
const MIN_TEXTS_PER_WEEK = 0;
const MAX_TEXTS_PER_WEEK = 50;

function getTimezones() {
  const intlWithSupport = Intl as typeof Intl & {
    supportedValuesOf?: (key: "timeZone") => string[];
  };
  if (intlWithSupport.supportedValuesOf) {
    try {
      return intlWithSupport.supportedValuesOf("timeZone");
    } catch {
      return [FALLBACK_TIMEZONE];
    }
  }
  return [FALLBACK_TIMEZONE];
}

function deriveDailyGoal(weekly: number) {
  if (!Number.isFinite(weekly) || weekly <= 0) {
    return 1;
  }
  return Math.max(1, Math.ceil(weekly / 7));
}

export default function Settings() {
  const navigate = useNavigate();
  const { addMessages } = useMessages();
  const [form, setForm] = useState<UserProfileUpdate>({
    timezone: FALLBACK_TIMEZONE,
    daily_new_words_goal: 10,
    words_per_week: DEFAULT_WORDS_PER_WEEK,
    texts_per_week: DEFAULT_TEXTS_PER_WEEK,
  });
  const [email, setEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState<boolean | null>(null);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [phone, setPhone] = useState("");
  const [smsOptIn, setSmsOptIn] = useState(false);
  const [saving, setSaving] = useState(false);
  const [smsLoading, setSmsLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const resolveSmsEnabled = (
    features?: UserFeatures | null,
    legacyFlag?: boolean | null,
  ) => {
    if (typeof legacyFlag === "boolean") {
      return legacyFlag;
    }
    if (!features) {
      return true;
    }
    if (typeof features.smsEnabled === "boolean") {
      return features.smsEnabled;
    }
    const legacy =
      (features as { sms_enabled?: boolean }).sms_enabled ??
      (features as { smsEnabled?: boolean }).smsEnabled;
    if (typeof legacy === "boolean") {
      return legacy;
    }
    return true;
  };

  const refreshProfile = useCallback(async () => {
    try {
      logInfo("WEB_SETTINGS_LOAD_START", "Settings load started", {
        method: "GET",
        url: "/users/me",
      });
      const data = await apiGet<UserProfileResponse>("/users/me");
      logInfo("WEB_SETTINGS_LOAD_OK", "Settings load succeeded", {
        method: "GET",
        url: "/users/me",
        status: 200,
      });
      const messagePayload = (data as { messages?: MessageDTO[] }).messages ?? [];
      if (messagePayload.length) {
        addMessages(messagePayload);
      }
      const weeklyWords =
        data.words_per_week ??
        (data.daily_new_words_goal
          ? data.daily_new_words_goal * 7
          : null) ??
        DEFAULT_WORDS_PER_WEEK;
      const dailyWords =
        data.daily_new_words_goal ?? deriveDailyGoal(weeklyWords);
      setForm((prev) => ({
        ...prev,
        timezone: data.timezone ?? prev.timezone ?? FALLBACK_TIMEZONE,
        daily_new_words_goal: dailyWords,
        words_per_week: weeklyWords,
        texts_per_week:
          data.texts_per_week ?? prev.texts_per_week ?? DEFAULT_TEXTS_PER_WEEK,
        feed_prefs: data.feed_prefs ?? prev.feed_prefs,
      }));
      setSmsOptIn(Boolean(data.sms_opt_in));
      setPhone(data.phone_e164 ?? "");
      setEmail(data.email ?? "");
      const verified =
        (data as { email_verified?: boolean | null }).email_verified ??
        (data as { emailVerified?: boolean | null }).emailVerified ??
        null;
      setEmailVerified(verified);
      const features =
        (data as { features?: UserFeatures | null }).features ?? null;
      const legacyFlag =
        (data as { sms_enabled?: boolean | null }).sms_enabled ?? null;
      setSmsEnabled(resolveSmsEnabled(features, legacyFlag));
    } catch (err) {
      logError("WEB_SETTINGS_LOAD_FAIL", "Settings load failed", {
        method: "GET",
        url: "/users/me",
        status: (err as { status?: number }).status ?? null,
        server_request_id: (err as { requestId?: string }).requestId ?? null,
        client_request_id:
          (err as { clientRequestId?: string }).clientRequestId ?? null,
      });
      setForm((prev) => ({
        ...prev,
        timezone:
          Intl.DateTimeFormat().resolvedOptions().timeZone ?? FALLBACK_TIMEZONE,
      }));
    }
  }, [addMessages]);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);
    try {
      logInfo("WEB_SETTINGS_SAVE_START", "Settings save started", {
        method: "PATCH",
        url: "/users/me",
      });
      const payload: UserProfileUpdate = {
        timezone: form.timezone ?? null,
        daily_new_words_goal: form.daily_new_words_goal ?? null,
        words_per_week: form.words_per_week ?? null,
        texts_per_week: form.texts_per_week ?? null,
      };
      if (typeof form.feed_prefs !== "undefined") {
        payload.feed_prefs = form.feed_prefs;
      }
      await apiPatch<UserProfileResponse>("/users/me", payload);
      logInfo("WEB_SETTINGS_SAVE_OK", "Settings save succeeded", {
        method: "PATCH",
        url: "/users/me",
        status: 200,
      });
      setSuccess("Settings saved.");
      refreshProfile();
    } catch (err) {
      logError("WEB_SETTINGS_SAVE_FAIL", "Settings save failed", {
        method: "PATCH",
        url: "/users/me",
        status: (err as { status?: number }).status ?? null,
        server_request_id: (err as { requestId?: string }).requestId ?? null,
        client_request_id:
          (err as { clientRequestId?: string }).clientRequestId ?? null,
      });
      setError(getErrorMessage(err, "Failed to save settings"));
    } finally {
      setSaving(false);
    }
  };

  const handleOptIn = async () => {
    if (!phone.trim()) {
      setError("Enter a phone number in E.164 format.");
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
      const payload: SmsOptInRequest = { phone_e164: phone.trim() };
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

  const handleResendVerification = async () => {
    setError(null);
    setSuccess(null);
    setEmailLoading(true);
    try {
      logInfo("WEB_EMAIL_RESEND_START", "Resend verification email started", {
        method: "POST",
        url: "/auth/resend-email-verification",
      });
      await apiPost("/auth/resend-email-verification");
      logInfo("WEB_EMAIL_RESEND_OK", "Resend verification email succeeded", {
        method: "POST",
        url: "/auth/resend-email-verification",
        status: 200,
      });
      setSuccess("Verification email sent.");
    } catch (err) {
      logError("WEB_EMAIL_RESEND_FAIL", "Resend verification email failed", {
        method: "POST",
        url: "/auth/resend-email-verification",
        status: (err as { status?: number }).status ?? null,
        server_request_id: (err as { requestId?: string }).requestId ?? null,
        client_request_id:
          (err as { clientRequestId?: string }).clientRequestId ?? null,
      });
      setError(getErrorMessage(err, "Failed to resend verification email"));
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <AppShell
      eyebrow="Preferences"
      title="Adjust your daily flow."
      action={
        <Button variant="ghost" onClick={() => navigate("/")}>
          Back home
        </Button>
      }
    >
      <Card className="form-card">
        <div className="form-stack">
          <div className="stack">
            <h2 className="ds-h2">Email verification</h2>
            <p className="ds-body muted">
              {email ? `Signed in as ${email}.` : "Signed-in email."}
            </p>
          </div>
          <div className="actions">
            <span
              className={`badge ${
                emailVerified === true
                  ? "badge-success"
                  : emailVerified === false
                    ? "badge-warning"
                    : "badge-neutral"
              }`}
            >
              {emailVerified === true
                ? "Verified"
                : emailVerified === false
                  ? "Not verified"
                  : "Unknown"}
            </span>
            {emailVerified === false ? (
              <Button
                onClick={handleResendVerification}
                disabled={emailLoading}
                loading={emailLoading}
              >
                {emailLoading ? "Sending..." : "Resend verification email"}
              </Button>
            ) : null}
          </div>
        </div>
      </Card>
      <Card className="form-card">
        <form onSubmit={onSubmit} className="form-stack">
          <label className="field">
            <span>Timezone</span>
            <select
              value={form.timezone ?? FALLBACK_TIMEZONE}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, timezone: event.target.value }))
              }
              className="ds-input"
            >
              {getTimezones().map((timezone) => (
                <option key={timezone} value={timezone}>
                  {timezone}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Words target (weekly + daily)</span>
            <input
              type="range"
              min={MIN_WORDS_PER_WEEK}
              max={MAX_WORDS_PER_WEEK}
              value={form.words_per_week ?? DEFAULT_WORDS_PER_WEEK}
              onChange={(event) => {
                const weekly = Number(event.target.value);
                setForm((prev) => ({
                  ...prev,
                  words_per_week: weekly,
                  daily_new_words_goal: deriveDailyGoal(weekly),
                }));
              }}
            />
            <div className="range-meta">
              <span>{form.words_per_week ?? DEFAULT_WORDS_PER_WEEK} / week</span>
              <span>
                {deriveDailyGoal(
                  form.words_per_week ?? DEFAULT_WORDS_PER_WEEK,
                )}{" "}
                / day
              </span>
            </div>
          </label>
          <label className="field">
            <span>Texts per week</span>
            <input
              type="number"
              min={MIN_TEXTS_PER_WEEK}
              max={MAX_TEXTS_PER_WEEK}
              value={form.texts_per_week ?? DEFAULT_TEXTS_PER_WEEK}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  texts_per_week: Number(event.target.value),
                }))
              }
              className="ds-input"
            />
          </label>
          <div className="actions">
            <Button type="submit" disabled={saving} loading={saving}>
              {saving ? "Saving..." : "Save settings"}
            </Button>
          </div>
        </form>
      </Card>
      {smsEnabled ? (
        <Card className="form-card">
          <div className="form-stack">
            <div className="stack">
              <h2 className="ds-h2">SMS reminders</h2>
              <p className="ds-body muted">
                {smsOptIn
                  ? "You are opted in for SMS reminders."
                  : "Opt in to receive SMS nudges."}
              </p>
            </div>
            <label className="field">
              <span>Phone (E.164)</span>
              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+14155552671"
                className="ds-input"
              />
            </label>
            <div className="actions">
              <Button
                onClick={handleOptIn}
                disabled={smsLoading}
                loading={smsLoading}
              >
                {smsLoading ? "Updating..." : "Opt in"}
              </Button>
              <Button
                variant="ghost"
                onClick={handleOptOut}
                disabled={smsLoading}
              >
                Opt out
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="form-card">
          <div className="stack">
            <h2 className="ds-h2">SMS reminders</h2>
            <p className="ds-body muted">
              SMS is beta or unavailable for your account.
            </p>
          </div>
        </Card>
      )}
      <Toast message={error ?? success} tone={error ? "error" : "info"} />
    </AppShell>
  );
}
