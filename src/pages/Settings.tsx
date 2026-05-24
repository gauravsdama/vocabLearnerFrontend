import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import Button from "../components/Button";
import Card from "../components/Card";
import Toast from "../components/Toast";
import { apiGet, apiPatch, apiPost } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import type {
  ResendEmailVerificationResponse,
  UserProfileResponse,
  UserProfileUpdate,
} from "../api/types";
import { getErrorMessage } from "../utils/apiError";
import {
  clampInteger,
  DEFAULT_TEXTS_PER_WEEK,
  DEFAULT_WORDS_PER_WEEK,
  deriveDailyGoal,
  FALLBACK_TIMEZONE,
  MAX_TEXTS_PER_WEEK,
  MAX_WORDS_PER_WEEK,
  MIN_TEXTS_PER_WEEK,
  MIN_WORDS_PER_WEEK,
} from "../utils/learningTargets";
import { logError, logInfo } from "../utils/logger";

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

export default function Settings() {
  const navigate = useNavigate();
  const { deleteAccount } = useAuth();
  const [form, setForm] = useState<UserProfileUpdate>({
    timezone: FALLBACK_TIMEZONE,
    daily_new_words_goal: 10,
    words_per_week: DEFAULT_WORDS_PER_WEEK,
    texts_per_week: DEFAULT_TEXTS_PER_WEEK,
  });
  const [email, setEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState<boolean | null>(null);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [twilioActive, setTwilioActive] = useState(false);
  const [phone, setPhone] = useState("");
  const [smsOptIn, setSmsOptIn] = useState(false);
  const [saving, setSaving] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
      const weeklyWords = clampInteger(
        data.words_per_week ??
          (data.daily_new_words_goal
            ? data.daily_new_words_goal * 7
            : DEFAULT_WORDS_PER_WEEK),
        MIN_WORDS_PER_WEEK,
        MAX_WORDS_PER_WEEK,
      );
      const dailyWords =
        data.daily_new_words_goal ?? deriveDailyGoal(weeklyWords);
      const textsPerWeek = clampInteger(
        data.texts_per_week ?? DEFAULT_TEXTS_PER_WEEK,
        MIN_TEXTS_PER_WEEK,
        MAX_TEXTS_PER_WEEK,
      );
      setForm((prev) => ({
        ...prev,
        timezone: data.timezone ?? prev.timezone ?? FALLBACK_TIMEZONE,
        daily_new_words_goal: dailyWords,
        words_per_week: weeklyWords,
        texts_per_week: textsPerWeek,
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
      setSmsEnabled(data.sms_enabled ?? true);
      setTwilioActive(Boolean(data.twilio_active));
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
  }, []);

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
      const safeWordsPerWeek = clampInteger(
        form.words_per_week ?? DEFAULT_WORDS_PER_WEEK,
        MIN_WORDS_PER_WEEK,
        MAX_WORDS_PER_WEEK,
      );
      const safeTextsPerWeek = clampInteger(
        form.texts_per_week ?? DEFAULT_TEXTS_PER_WEEK,
        MIN_TEXTS_PER_WEEK,
        MAX_TEXTS_PER_WEEK,
      );
      const payload: UserProfileUpdate = {
        timezone: form.timezone ?? null,
        daily_new_words_goal: form.daily_new_words_goal ?? null,
        words_per_week: safeWordsPerWeek,
        texts_per_week: safeTextsPerWeek,
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

  const handleResendVerification = async () => {
    setError(null);
    setSuccess(null);
    setEmailLoading(true);
    try {
      logInfo("WEB_EMAIL_RESEND_START", "Resend verification email started", {
        method: "POST",
        url: "/auth/resend-verification",
      });
      const response = await apiPost<ResendEmailVerificationResponse>(
        "/auth/resend-verification",
      );
      logInfo("WEB_EMAIL_RESEND_OK", "Resend verification email succeeded", {
        method: "POST",
        url: "/auth/resend-verification",
        status: 200,
      });
      if (!response.sent && response.reason === "already_verified") {
        setEmailVerified(true);
        setSuccess("Your email is already verified.");
      } else {
        setSuccess("Verification email sent.");
      }
    } catch (err) {
      logError("WEB_EMAIL_RESEND_FAIL", "Resend verification email failed", {
        method: "POST",
        url: "/auth/resend-verification",
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

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "DELETE") {
      setError('Type "DELETE" to confirm account deletion.');
      return;
    }
    setError(null);
    setSuccess(null);
    setDeleteLoading(true);
    try {
      logInfo("WEB_ACCOUNT_DELETE_START", "Account deletion started", {
        method: "DELETE",
        url: "/users/me",
      });
      await deleteAccount();
      logInfo("WEB_ACCOUNT_DELETE_OK", "Account deletion succeeded", {
        method: "DELETE",
        url: "/users/me",
        status: 200,
      });
    } catch (err) {
      logError("WEB_ACCOUNT_DELETE_FAIL", "Account deletion failed", {
        method: "DELETE",
        url: "/users/me",
        status: (err as { status?: number }).status ?? null,
        server_request_id: (err as { requestId?: string }).requestId ?? null,
        client_request_id:
          (err as { clientRequestId?: string }).clientRequestId ?? null,
      });
      setError(getErrorMessage(err, "Failed to delete account"));
      setDeleteLoading(false);
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
      : "SMS is available. Open the Twilio consent page to opt in."
    : smsEnabled
      ? "SMS delivery is not active for this account yet, so opt-in is unavailable."
      : "SMS is disabled for this account.";

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
              {emailVerified === false
                ? `Signed in as ${email || "this account"}. Check your inbox to verify this address.`
                : email
                  ? `Signed in as ${email}.`
                  : "Signed-in email."}
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
              <p className="ds-body muted">{smsDescription}</p>
            </div>
            <div className="actions">
              <span className={`badge ${smsStatusClassName}`}>
                {smsStatusLabel}
              </span>
              <Button onClick={() => navigate("/settings/sms")}>
                {smsOptIn ? "Manage SMS reminders" : "Open Twilio consent"}
              </Button>
            </div>
            {phone ? (
              <div className="stack">
                <span className="ds-label">Current phone</span>
                <p className="ds-body">{phone}</p>
              </div>
            ) : null}
          </div>
        </Card>
      ) : (
        <Card className="form-card">
          <div className="stack">
            <h2 className="ds-h2">SMS reminders</h2>
            <p className="ds-body muted">
              SMS is disabled for this account.
            </p>
          </div>
        </Card>
      )}
      <Card className="form-card">
        <div className="form-stack">
          <div className="stack">
            <h2 className="ds-h2">Delete account</h2>
            <p className="ds-body muted">
              This permanently deletes your account, progress, messages, saved sessions, and settings.
            </p>
          </div>
          <label className="field">
            <span>Type DELETE to confirm</span>
            <input
              value={deleteConfirm}
              onChange={(event) => setDeleteConfirm(event.target.value)}
              className="ds-input"
              autoComplete="off"
              disabled={deleteLoading}
            />
          </label>
          <div className="actions">
            <Button
              variant="ghost"
              className="button-danger"
              onClick={handleDeleteAccount}
              disabled={deleteConfirm !== "DELETE" || deleteLoading}
              loading={deleteLoading}
            >
              {deleteLoading ? "Deleting..." : "Delete account"}
            </Button>
          </div>
        </div>
      </Card>
      <Toast message={error ?? success} tone={error ? "error" : "info"} />
    </AppShell>
  );
}
