import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import Button from "../components/Button";
import Card from "../components/Card";
import Mascot from "../components/Mascot";
import Toast from "../components/Toast";
import { useAuth } from "../auth/AuthContext";
import { apiPost } from "../api/client";
import type { TutorialCompleteRequest } from "../api/types";
import { getErrorMessage } from "../utils/apiError";
import {
  clampInteger,
  DEFAULT_TEXTS_PER_WEEK,
  DEFAULT_WORDS_PER_WEEK,
  MAX_TEXTS_PER_WEEK,
  MAX_WORDS_PER_WEEK,
  MIN_TEXTS_PER_WEEK,
  MIN_WORDS_PER_WEEK,
} from "../utils/learningTargets";
import { logError, logInfo } from "../utils/logger";

export default function Tutorial() {
  const navigate = useNavigate();
  const { markTutorialComplete } = useAuth();
  const [wordsPerWeek, setWordsPerWeek] = useState(DEFAULT_WORDS_PER_WEEK);
  const [textsPerWeek, setTextsPerWeek] = useState(DEFAULT_TEXTS_PER_WEEK);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      const timezone =
        Intl.DateTimeFormat().resolvedOptions().timeZone ?? undefined;
      const safeWordsPerWeek = clampInteger(
        wordsPerWeek,
        MIN_WORDS_PER_WEEK,
        MAX_WORDS_PER_WEEK,
      );
      const safeTextsPerWeek = clampInteger(
        textsPerWeek,
        MIN_TEXTS_PER_WEEK,
        MAX_TEXTS_PER_WEEK,
      );
      const payload: TutorialCompleteRequest = {
        words_per_week: safeWordsPerWeek,
        texts_per_week: safeTextsPerWeek,
        ...(timezone ? { timezone } : {}),
      };
      logInfo("WEB_TUTORIAL_COMPLETE_START", "Tutorial complete started", {
        method: "POST",
        url: "/tutorial/complete",
      });
      await apiPost("/tutorial/complete", payload);
      logInfo("WEB_TUTORIAL_COMPLETE_OK", "Tutorial complete succeeded", {
        method: "POST",
        url: "/tutorial/complete",
        status: 200,
      });
      markTutorialComplete();
      navigate("/", { replace: true });
    } catch (err) {
      logError("WEB_TUTORIAL_COMPLETE_FAIL", "Tutorial complete failed", {
        method: "POST",
        url: "/tutorial/complete",
        status: (err as { status?: number }).status ?? null,
        server_request_id: (err as { requestId?: string }).requestId ?? null,
        client_request_id:
          (err as { clientRequestId?: string }).clientRequestId ?? null,
      });
      setError(getErrorMessage(err, "Failed to save tutorial settings"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell centered maxWidth="narrow">
      <Card className="form-card">
        <div className="form-mascot-row">
          <Mascot
            pose="happy_soft"
            alt="A calm cat encouraging you to set a sustainable weekly pace."
            size="md"
            className="form-mascot"
          />
          <div className="stack">
            <span className="ds-label">Tutorial</span>
            <h1 className="ds-h2">Set your weekly targets.</h1>
            <p className="ds-body muted">
              Choose a sustainable pace. You can change this later in settings.
            </p>
          </div>
        </div>
        <div className="form-stack">
          <label className="field">
            <span>Words per week</span>
            <input
              type="range"
              min={MIN_WORDS_PER_WEEK}
              max={MAX_WORDS_PER_WEEK}
              value={wordsPerWeek}
              onChange={(event) =>
                setWordsPerWeek(Number(event.target.value))
              }
            />
            <span className="ds-caption">{wordsPerWeek} words</span>
          </label>
          <label className="field">
            <span>Texts per week</span>
            <input
              type="range"
              min={MIN_TEXTS_PER_WEEK}
              max={MAX_TEXTS_PER_WEEK}
              value={textsPerWeek}
              onChange={(event) =>
                setTextsPerWeek(Number(event.target.value))
              }
            />
            <span className="ds-caption">{textsPerWeek} texts</span>
          </label>
          <div className="actions">
            <Button onClick={handleSubmit} disabled={loading} loading={loading} size="lg">
              {loading ? "Saving..." : "Save and continue"}
            </Button>
          </div>
        </div>
      </Card>
      <Toast message={error} tone="error" />
    </AppShell>
  );
}
