import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import Button from "../components/Button";
import Card from "../components/Card";
import Mascot from "../components/Mascot";
import Modal from "../components/Modal";
import Toast from "../components/Toast";
import { apiGet, apiPatch, apiPost } from "../api/client";
import type {
  StatsSummary,
  StatsWord,
  StudyProgressQuizAttempt,
  StudyProgressQuizAttemptsResponse,
  StudyProgressListResponse,
  StudyProgressUpdateRequest,
  StudyProgressUpdateResponse,
} from "../api/types";
import { getErrorMessage } from "../utils/apiError";
import { logError, logInfo } from "../utils/logger";

const ALL_WORDS_PAGE_SIZE = 50;

function formatAccuracy(value?: number) {
  if (typeof value !== "number") {
    return "-";
  }
  if (value <= 1) {
    return `${(value * 100).toFixed(1)}%`;
  }
  return `${value.toFixed(1)}%`;
}

function formatNumber(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "-";
  }
  return String(value);
}

function formatStreakDays(value?: number | null) {
  const base = formatNumber(value);
  return base === "-" ? base : `${base} days`;
}

function formatDate(value?: string | null) {
  if (!value) {
    return "-";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString();
}

function formatDateTime(value?: string | null) {
  if (!value) {
    return "-";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

type SortOption =
  | "recent"
  | "highest_mastery"
  | "lowest_mastery"
  | "highest_learned"
  | "lowest_learned"
  | "most_seen"
  | "least_seen"
  | "highest_accuracy"
  | "lowest_accuracy";

type AssignedFilter = "any" | "only" | "exclude";
type StatusFilter = "all" | "new" | "learning" | "reviewing" | "mastered";

function normalizeIntegerFilter(value: string) {
  if (!value.trim()) {
    return null;
  }
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return null;
  }
  return Math.trunc(parsed);
}

function normalizeNumberFilter(value: string) {
  if (!value.trim()) {
    return null;
  }
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return null;
  }
  return parsed;
}

function resolveStatus(status?: string | null) {
  if (!status) {
    return "UNKNOWN";
  }
  return status.toUpperCase();
}

function badgeForStatus(status: string) {
  if (status === "MASTERED") {
    return { label: "Mastered", className: "badge-success", showIcon: true };
  }
  if (status === "LEARNED" || status === "LEARNING") {
    return { label: "Learning", className: "badge-info", showIcon: false };
  }
  if (status === "REVIEWING") {
    return { label: "Reviewing", className: "badge-warning", showIcon: false };
  }
  if (status === "NEW") {
    return { label: "New", className: "badge-neutral", showIcon: false };
  }
  if (status === "DUE") {
    return { label: "Due", className: "badge-warning", showIcon: false };
  }
  return { label: "In progress", className: "badge-neutral", showIcon: false };
}

function masteryPercent(word: StatsWord) {
  const raw =
    word.mastery_score ??
    word.mastery_rating ??
    (word as { mastery?: number | null }).mastery ??
    (word as { progress?: number | null }).progress ??
    null;
  if (typeof raw !== "number" || Number.isNaN(raw)) {
    return null;
  }
  const scaled =
    raw <= 1
      ? raw * 100
      : raw <= 5
        ? (raw / 5) * 100
        : raw;
  return Math.max(0, Math.min(100, scaled));
}

function resolveTiming(word: StatsWord) {
  if (word.next_due_at) {
    return { label: "Next due", value: formatDate(word.next_due_at) };
  }
  const lastSeen = word.last_seen_at ?? word.last_viewed_at ?? null;
  return { label: "Last seen", value: formatDate(lastSeen) };
}

function resolveCorrectCount(word: StatsWord) {
  if (typeof word.correct_count === "number") {
    return word.correct_count;
  }
  if (typeof word.quiz_correct_count === "number") {
    return word.quiz_correct_count;
  }
  return null;
}

function resolveIncorrectCount(word: StatsWord) {
  if (typeof word.incorrect_count === "number") {
    return word.incorrect_count;
  }
  if (
    typeof word.quiz_attempt_count === "number" &&
    typeof word.quiz_correct_count === "number"
  ) {
    return Math.max(0, word.quiz_attempt_count - word.quiz_correct_count);
  }
  return null;
}

function resolveStreak(word: StatsWord) {
  if (typeof word.streak === "number") {
    return word.streak;
  }
  if (typeof word.correct_streak_spaced === "number") {
    return word.correct_streak_spaced;
  }
  return null;
}

export default function Stats() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<StatsSummary | null>(null);
  const [words, setWords] = useState<StatsWord[]>([]);
  const [listPage, setListPage] = useState(1);
  const [listTotal, setListTotal] = useState<number | null>(null);
  const [tab, setTab] = useState<"week" | "all">("week");
  const [selectedWord, setSelectedWord] = useState<StatsWord | null>(null);
  const [selectedTab, setSelectedTab] = useState<"details" | "questions">(
    "details",
  );
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [adjusting, setAdjusting] = useState(false);
  const [downgrading, setDowngrading] = useState(false);
  const [loadingAttempts, setLoadingAttempts] = useState(false);
  const [loadingMoreAttempts, setLoadingMoreAttempts] = useState(false);
  const [attempts, setAttempts] = useState<StudyProgressQuizAttempt[]>([]);
  const [attemptsPage, setAttemptsPage] = useState(1);
  const [attemptsTotal, setAttemptsTotal] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [assignedFilter, setAssignedFilter] = useState<AssignedFilter>("any");
  const [assignedFirst, setAssignedFirst] = useState(true);
  const [sort, setSort] = useState<SortOption>("recent");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [minSeen, setMinSeen] = useState("");
  const [maxSeen, setMaxSeen] = useState("");
  const [minLearned, setMinLearned] = useState("");
  const [maxLearned, setMaxLearned] = useState("");
  const [minMastery, setMinMastery] = useState("");
  const [maxMastery, setMaxMastery] = useState("");
  const [minAccuracy, setMinAccuracy] = useState("");
  const [maxAccuracy, setMaxAccuracy] = useState("");

  useEffect(() => {
    let mounted = true;
    logInfo("WEB_STATS_LOAD_START", "Stats load started", {
      method: "GET",
      url: "/stats/summary",
    });
    apiGet<StatsSummary>("/stats/summary")
      .then((data) => {
        if (mounted) {
          setStats(data);
          logInfo("WEB_STATS_LOAD_OK", "Stats load succeeded", {
            method: "GET",
            url: "/stats/summary",
            status: 200,
          });
        }
      })
      .catch((err) => {
        if (mounted) {
          logError("WEB_STATS_LOAD_FAIL", "Stats load failed", {
            method: "GET",
            url: "/stats/summary",
            status: (err as { status?: number }).status ?? null,
            server_request_id: (err as { requestId?: string }).requestId ?? null,
            client_request_id:
              (err as { clientRequestId?: string }).clientRequestId ?? null,
          });
          setError(getErrorMessage(err, "Failed to load stats"));
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const nextQuery = searchInput.trim();
    const timer = window.setTimeout(() => {
      setSearchQuery(nextQuery);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const fetchQuizAttempts = useCallback(async (wordId: number, page: number) => {
    const response = await apiGet<StudyProgressQuizAttemptsResponse>(
      `/study/progress/${wordId}/quiz-attempts?page=${page}&page_size=20`,
    );
    return response;
  }, []);

  useEffect(() => {
    setSelectedTab("details");
    setAttempts([]);
    setAttemptsPage(1);
    setAttemptsTotal(null);
    setLoadingAttempts(false);
    setLoadingMoreAttempts(false);
  }, [selectedWord?.word_id]);

  const listQueryKey = useMemo(
    () =>
      JSON.stringify({
        tab,
        statusFilter,
        assignedFilter,
        assignedFirst,
        sort,
        searchQuery,
        minSeen,
        maxSeen,
        minLearned,
        maxLearned,
        minMastery,
        maxMastery,
        minAccuracy,
        maxAccuracy,
      }),
    [
      assignedFilter,
      assignedFirst,
      maxAccuracy,
      maxLearned,
      maxMastery,
      maxSeen,
      minAccuracy,
      minLearned,
      minMastery,
      minSeen,
      searchQuery,
      sort,
      statusFilter,
      tab,
    ],
  );

  const buildStudyProgressListPath = useCallback(
    (page: number) => {
      const params = new URLSearchParams();
      params.set("status", statusFilter);
      params.set("page", String(page));
      params.set("page_size", String(ALL_WORDS_PAGE_SIZE));
      params.set("assigned_first", assignedFirst ? "true" : "false");
      params.set("sort", sort);

      const assigned = tab === "week" ? "only" : assignedFilter;
      params.set("assigned", assigned);

      if (searchQuery) {
        params.set("q", searchQuery);
      }

      const minSeenValue = normalizeIntegerFilter(minSeen);
      const maxSeenValue = normalizeIntegerFilter(maxSeen);
      if (minSeenValue !== null) params.set("min_seen", String(minSeenValue));
      if (maxSeenValue !== null) params.set("max_seen", String(maxSeenValue));

      const minLearnedValue = normalizeIntegerFilter(minLearned);
      const maxLearnedValue = normalizeIntegerFilter(maxLearned);
      if (minLearnedValue !== null)
        params.set("min_learned", String(minLearnedValue));
      if (maxLearnedValue !== null)
        params.set("max_learned", String(maxLearnedValue));

      const minMasteryValue = normalizeIntegerFilter(minMastery);
      const maxMasteryValue = normalizeIntegerFilter(maxMastery);
      if (minMasteryValue !== null)
        params.set("min_mastery", String(minMasteryValue));
      if (maxMasteryValue !== null)
        params.set("max_mastery", String(maxMasteryValue));

      const minAccuracyValue = normalizeNumberFilter(minAccuracy);
      const maxAccuracyValue = normalizeNumberFilter(maxAccuracy);
      if (minAccuracyValue !== null)
        params.set("min_accuracy", String(minAccuracyValue));
      if (maxAccuracyValue !== null)
        params.set("max_accuracy", String(maxAccuracyValue));

      return `/study/progress/list?${params.toString()}`;
    },
    [
      assignedFilter,
      assignedFirst,
      maxAccuracy,
      maxLearned,
      maxMastery,
      maxSeen,
      minAccuracy,
      minLearned,
      minMastery,
      minSeen,
      searchQuery,
      sort,
      statusFilter,
      tab,
    ],
  );

  const fetchWords = useCallback(
    async (page: number) => {
      const path = buildStudyProgressListPath(page);
      const response = await apiGet<StudyProgressListResponse>(path);
      return response;
    },
    [buildStudyProgressListPath],
  );

  useEffect(() => {
    let mounted = true;
    setError(null);
    setLoading(true);
    fetchWords(1)
      .then((response) => {
        if (!mounted) {
          return;
        }
        setWords(response.items);
        setListPage(response.page);
        setListTotal(response.total);
      })
      .catch((err) => {
        if (mounted) {
          setError(getErrorMessage(err, "Failed to load words"));
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [fetchWords, listQueryKey]);

  const loadMore = async () => {
    if (loadingMore) {
      return;
    }
    if (listTotal !== null && words.length >= listTotal) {
      return;
    }
    const nextPage = listPage + 1;
    setLoadingMore(true);
    try {
      const response = await fetchWords(nextPage);
      setWords((prev) => [...prev, ...response.items]);
      setListPage(response.page);
      setListTotal(response.total);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load more words"));
    } finally {
      setLoadingMore(false);
    }
  };

  const hasMore = listTotal !== null && words.length < listTotal;

  const selectedMeta = useMemo(() => {
    if (!selectedWord) {
      return null;
    }
    const status = resolveStatus(selectedWord.status);
    const badge = badgeForStatus(status);
    const percent = masteryPercent(selectedWord);
    return { status, badge, percent };
  }, [selectedWord]);
  const selectedTiming = selectedWord ? resolveTiming(selectedWord) : null;
  const selectedCorrect = selectedWord ? resolveCorrectCount(selectedWord) : null;
  const selectedIncorrect = selectedWord ? resolveIncorrectCount(selectedWord) : null;
  const selectedStreak = selectedWord ? resolveStreak(selectedWord) : null;

  const applyProgressUpdate = useCallback(
    (wordId: number, progress: StudyProgressUpdateResponse["progress"]) => {
      const updateWord = (word: StatsWord) => {
        if (word.word_id !== wordId) {
          return word;
        }
        return {
          ...word,
          status: progress.status ?? word.status,
          seen_count: progress.seen_count ?? word.seen_count,
          viewed_count: progress.viewed_count ?? word.viewed_count,
          quiz_attempt_count:
            progress.quiz_attempt_count ?? word.quiz_attempt_count,
          quiz_correct_count:
            progress.quiz_correct_count ?? word.quiz_correct_count,
          correct_streak_spaced:
            progress.correct_streak_spaced ?? word.correct_streak_spaced,
          learned_rating: progress.learned_rating ?? word.learned_rating,
          mastery_rating: progress.mastery_rating ?? word.mastery_rating,
          last_viewed_at: progress.last_viewed_at ?? word.last_viewed_at,
          next_due_at: progress.next_due_at ?? word.next_due_at,
        };
      };
      setWords((prev) => prev.map(updateWord));
      setSelectedWord((prev) => (prev ? updateWord(prev) : prev));
    },
    [],
  );

  const handleAdjust = useCallback(
    async (wordId: number, payload: StudyProgressUpdateRequest) => {
      setError(null);
      setAdjusting(true);
      logInfo("WEB_PROGRESS_ADJUST_START", "Progress adjust started", {
        method: "PATCH",
        url: `/study/progress/${wordId}`,
        payload,
      });
      try {
        const response = await apiPatch<StudyProgressUpdateResponse>(
          `/study/progress/${wordId}`,
          payload,
        );
        applyProgressUpdate(wordId, response.progress);
        logInfo("WEB_PROGRESS_ADJUST_OK", "Progress adjust succeeded", {
          method: "PATCH",
          url: `/study/progress/${wordId}`,
          status: 200,
        });
      } catch (err) {
        logError("WEB_PROGRESS_ADJUST_FAIL", "Progress adjust failed", {
          method: "PATCH",
          url: `/study/progress/${wordId}`,
          status: (err as { status?: number }).status ?? null,
          server_request_id: (err as { requestId?: string }).requestId ?? null,
          client_request_id:
            (err as { clientRequestId?: string }).clientRequestId ?? null,
        });
        setError(getErrorMessage(err, "Failed to update progress"));
      } finally {
        setAdjusting(false);
      }
    },
    [applyProgressUpdate],
  );

  const handleDowngrade = useCallback(
    async (wordId: number) => {
      const confirmed = window.confirm(
        "Downgrade this word to unlearned? It will reappear in your feed.",
      );
      if (!confirmed) {
        return;
      }
      setError(null);
      setDowngrading(true);
      logInfo("WEB_PROGRESS_DOWNGRADE_START", "Progress downgrade started", {
        method: "POST",
        url: `/study/progress/${wordId}/downgrade`,
      });
      try {
        const response = await apiPost<StudyProgressUpdateResponse>(
          `/study/progress/${wordId}/downgrade`,
        );
        applyProgressUpdate(wordId, response.progress);
        logInfo("WEB_PROGRESS_DOWNGRADE_OK", "Progress downgrade succeeded", {
          method: "POST",
          url: `/study/progress/${wordId}/downgrade`,
          status: 200,
        });
      } catch (err) {
        logError("WEB_PROGRESS_DOWNGRADE_FAIL", "Progress downgrade failed", {
          method: "POST",
          url: `/study/progress/${wordId}/downgrade`,
          status: (err as { status?: number }).status ?? null,
          server_request_id: (err as { requestId?: string }).requestId ?? null,
          client_request_id:
            (err as { clientRequestId?: string }).clientRequestId ?? null,
        });
        setError(getErrorMessage(err, "Failed to downgrade word"));
      } finally {
        setDowngrading(false);
      }
    },
    [applyProgressUpdate],
  );

  const loadAttempts = useCallback(
    async (wordId: number) => {
      if (loadingAttempts) {
        return;
      }
      setError(null);
      setLoadingAttempts(true);
      logInfo("WEB_PROGRESS_ATTEMPTS_START", "Quiz attempts load started", {
        method: "GET",
        url: `/study/progress/${wordId}/quiz-attempts`,
        page: 1,
      });
      try {
        const response = await fetchQuizAttempts(wordId, 1);
        setAttempts(response.attempts ?? []);
        setAttemptsPage(response.page ?? 1);
        setAttemptsTotal(response.total ?? null);
        logInfo("WEB_PROGRESS_ATTEMPTS_OK", "Quiz attempts load succeeded", {
          method: "GET",
          url: `/study/progress/${wordId}/quiz-attempts`,
          status: 200,
        });
      } catch (err) {
        logError("WEB_PROGRESS_ATTEMPTS_FAIL", "Quiz attempts load failed", {
          method: "GET",
          url: `/study/progress/${wordId}/quiz-attempts`,
          status: (err as { status?: number }).status ?? null,
          server_request_id: (err as { requestId?: string }).requestId ?? null,
          client_request_id:
            (err as { clientRequestId?: string }).clientRequestId ?? null,
        });
        setError(getErrorMessage(err, "Failed to load questions"));
      } finally {
        setLoadingAttempts(false);
      }
    },
    [fetchQuizAttempts, loadingAttempts],
  );

  const loadMoreAttempts = useCallback(
    async (wordId: number) => {
      if (loadingMoreAttempts) {
        return;
      }
      if (attemptsTotal !== null && attempts.length >= attemptsTotal) {
        return;
      }
      const nextPage = attemptsPage + 1;
      setError(null);
      setLoadingMoreAttempts(true);
      try {
        const response = await fetchQuizAttempts(wordId, nextPage);
        setAttempts((prev) => [...prev, ...(response.attempts ?? [])]);
        setAttemptsPage(response.page ?? nextPage);
        setAttemptsTotal(response.total ?? attemptsTotal);
      } catch (err) {
        setError(getErrorMessage(err, "Failed to load more questions"));
      } finally {
        setLoadingMoreAttempts(false);
      }
    },
    [
      attempts.length,
      attemptsPage,
      attemptsTotal,
      fetchQuizAttempts,
      loadingMoreAttempts,
    ],
  );

  return (
    <AppShell
      eyebrow="Stats & Summary"
      title="Your learning snapshot."
      action={
        <Button variant="ghost" onClick={() => navigate("/")}>
          Back home
        </Button>
      }
    >
      <section className="page-mascot-banner page-mascot-banner-stats">
        <div className="page-mascot-copy">
          <span className="ds-label">Momentum</span>
          <h2 className="ds-h2">This screen gets the brighter mascot treatment.</h2>
          <p className="ds-body muted">
            The feed reacts to each answer, while stats stays upbeat and progress-focused.
          </p>
        </div>
        <Mascot
          pose="happy_bright"
          alt="A bright happy cat highlighting your study progress."
          size="xl"
          className="page-mascot-hero"
        />
      </section>

      <section className="stats-grid">
        <Card className="stat-card" accent="word">
          <h2 className="ds-h2">{formatNumber(stats?.mastered_count)}</h2>
          <p className="ds-caption">Mastered</p>
        </Card>
        <Card className="stat-card" accent="quiz">
          <h2 className="ds-h2">{formatNumber(stats?.learning_count)}</h2>
          <p className="ds-caption">Learning</p>
        </Card>
        <Card className="stat-card" accent="sentence">
          <h2 className="ds-h2">{formatNumber(stats?.due_count)}</h2>
          <p className="ds-caption">Due</p>
        </Card>
        <Card className="stat-card" accent="word">
          <h2 className="ds-h2">{formatAccuracy(stats?.accuracy)}</h2>
          <p className="ds-caption">Accuracy</p>
        </Card>
        <Card className="stat-card" accent="quiz">
          <h2 className="ds-h2">
            {formatStreakDays(stats?.streak?.current_days)}
          </h2>
          <p className="ds-caption">Current streak</p>
        </Card>
        <Card className="stat-card" accent="sentence">
          <h2 className="ds-h2">
            {formatStreakDays(stats?.streak?.longest_days)}
          </h2>
          <p className="ds-caption">Longest streak</p>
        </Card>
      </section>

      <div className="tabs">
        <button
          type="button"
          className={`tab-button ${tab === "week" ? "tab-button-active" : ""}`}
          onClick={() => setTab("week")}
        >
          This Week
        </button>
        <button
          type="button"
          className={`tab-button ${tab === "all" ? "tab-button-active" : ""}`}
          onClick={() => setTab("all")}
        >
          All Time
        </button>
      </div>

      <Card className="form-card">
        <div className="form-stack">
          <div className="filters-grid">
            <div className="field">
              <span>Search</span>
              <input
                className="ds-input"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search words..."
              />
            </div>
            <div className="field">
              <span>Status</span>
              <select
                className="ds-input"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as StatusFilter)
                }
              >
                <option value="all">All</option>
                <option value="new">New</option>
                <option value="learning">Learning</option>
                <option value="reviewing">Reviewing</option>
                <option value="mastered">Mastered</option>
              </select>
            </div>
            <div className="field">
              <span>Sort</span>
              <select
                className="ds-input"
                value={sort}
                onChange={(event) => setSort(event.target.value as SortOption)}
              >
                <option value="recent">Recent</option>
                <option value="highest_mastery">Highest mastery</option>
                <option value="lowest_mastery">Lowest mastery</option>
                <option value="highest_learned">Highest learned</option>
                <option value="lowest_learned">Lowest learned</option>
                <option value="most_seen">Most seen</option>
                <option value="least_seen">Least seen</option>
                <option value="highest_accuracy">Highest accuracy</option>
                <option value="lowest_accuracy">Lowest accuracy</option>
              </select>
            </div>
            {tab === "all" ? (
              <div className="field">
                <span>Assigned</span>
                <select
                  className="ds-input"
                  value={assignedFilter}
                  onChange={(event) =>
                    setAssignedFilter(event.target.value as AssignedFilter)
                  }
                >
                  <option value="any">Any</option>
                  <option value="only">Only assigned</option>
                  <option value="exclude">Exclude assigned</option>
                </select>
              </div>
            ) : (
              <div className="field">
                <span>Assigned</span>
                <input className="ds-input" value="Only assigned" disabled />
              </div>
            )}
          </div>

          <details className="filters-advanced">
            <summary className="ds-caption muted">More filters</summary>
            <div className="filters-grid">
              <div className="field">
                <span>Assigned first</span>
                <div className="field field-toggle">
                  <span className="muted">{assignedFirst ? "On" : "Off"}</span>
                  <input
                    type="checkbox"
                    checked={assignedFirst}
                    onChange={(event) => setAssignedFirst(event.target.checked)}
                  />
                </div>
              </div>
              <div className="field">
                <span>Seen count</span>
                <div className="filters-range">
                  <input
                    className="ds-input"
                    inputMode="numeric"
                    placeholder="Min"
                    value={minSeen}
                    onChange={(event) => setMinSeen(event.target.value)}
                  />
                  <input
                    className="ds-input"
                    inputMode="numeric"
                    placeholder="Max"
                    value={maxSeen}
                    onChange={(event) => setMaxSeen(event.target.value)}
                  />
                </div>
              </div>
              <div className="field">
                <span>Learned rating</span>
                <div className="filters-range">
                  <input
                    className="ds-input"
                    inputMode="numeric"
                    placeholder="Min"
                    value={minLearned}
                    onChange={(event) => setMinLearned(event.target.value)}
                  />
                  <input
                    className="ds-input"
                    inputMode="numeric"
                    placeholder="Max"
                    value={maxLearned}
                    onChange={(event) => setMaxLearned(event.target.value)}
                  />
                </div>
              </div>
              <div className="field">
                <span>Mastery rating</span>
                <div className="filters-range">
                  <input
                    className="ds-input"
                    inputMode="numeric"
                    placeholder="Min"
                    value={minMastery}
                    onChange={(event) => setMinMastery(event.target.value)}
                  />
                  <input
                    className="ds-input"
                    inputMode="numeric"
                    placeholder="Max"
                    value={maxMastery}
                    onChange={(event) => setMaxMastery(event.target.value)}
                  />
                </div>
              </div>
              <div className="field">
                <span>Accuracy</span>
                <div className="filters-range">
                  <input
                    className="ds-input"
                    inputMode="decimal"
                    placeholder="Min (0-1)"
                    value={minAccuracy}
                    onChange={(event) => setMinAccuracy(event.target.value)}
                  />
                  <input
                    className="ds-input"
                    inputMode="decimal"
                    placeholder="Max (0-1)"
                    value={maxAccuracy}
                    onChange={(event) => setMaxAccuracy(event.target.value)}
                  />
                </div>
              </div>
            </div>
          </details>
        </div>
      </Card>

      <div className="word-list">
        {loading && words.length === 0 ? (
          <Card className="form-card">
            <p className="ds-body muted">Loading words...</p>
          </Card>
        ) : null}
        {!loading && words.length === 0 ? (
          <Card className="form-card">
            <p className="ds-body muted">No words to show yet.</p>
          </Card>
        ) : null}
        {words.map((word) => {
          const status = resolveStatus(word.status);
          const badge = badgeForStatus(status);
          const percent = masteryPercent(word);
          const timing = resolveTiming(word);
          const accuracy = word.accuracy;
          const showAccuracy = typeof accuracy === "number";
          return (
            <Card
              as="button"
              type="button"
              key={`${word.word_id}-${word.word}`}
              className="word-row card-hover"
              onClick={() => setSelectedWord(word)}
            >
              <div className="word-row-header">
                <div className="stack">
                  <h3 className="ds-h2">{word.word}</h3>
                  <p className="ds-caption">
                    {timing.label}: {timing.value}
                  </p>
                  {word.primary_definition ? (
                    <p className="ds-body muted">{word.primary_definition}</p>
                  ) : null}
                </div>
                <div className="badge-stack">
                  {word.is_assigned ? (
                    <span className="badge badge-info">Assigned</span>
                  ) : null}
                  <span className={`badge ${badge.className}`}>
                    {badge.showIcon ? (
                      <span className="badge-icon" aria-hidden>
                        <svg viewBox="0 0 24 24" fill="none">
                          <path
                            d="M12 4l2.6 5.3 5.9.9-4.2 4.1 1 5.8-5.3-2.8-5.3 2.8 1-5.8-4.2-4.1 5.9-.9L12 4z"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    ) : null}
                    {badge.label}
                  </span>
                </div>
              </div>
              <div className="word-row-meta">
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${percent ?? 0}%` }}
                  />
                </div>
                <span className="ds-caption">
                  {percent !== null ? `${Math.round(percent)}% mastery` : "Mastery pending"}
                  {showAccuracy ? ` · ${formatAccuracy(accuracy)} accuracy` : ""}
                </span>
              </div>
            </Card>
          );
        })}
        {hasMore ? (
          <div className="actions">
            <Button onClick={loadMore} disabled={loadingMore} loading={loadingMore}>
              {loadingMore ? "Loading..." : "Load more"}
            </Button>
          </div>
        ) : null}
      </div>

      {stats?.recent_activity ? (
        <Card className="form-card">
          <h2 className="ds-h2">Recent activity</h2>
          <div className="activity-list">
            {Object.entries(stats.recent_activity).map(([key, value]) => (
              <div className="activity-item" key={key}>
                <span className="muted">{key}</span>
                <span className="activity-value">
                  {typeof value === "object" ? JSON.stringify(value) : String(value)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      <Modal
        open={Boolean(selectedWord)}
        title={selectedWord?.word}
        onClose={() => setSelectedWord(null)}
      >
        {selectedWord && selectedMeta ? (
          <div className="stack">
            <div className="actions">
              <Button
                variant={selectedTab === "details" ? "secondary" : "ghost"}
                type="button"
                onClick={() => setSelectedTab("details")}
              >
                Details
              </Button>
              <Button
                variant={selectedTab === "questions" ? "secondary" : "ghost"}
                type="button"
                onClick={() => {
                  setSelectedTab("questions");
                  if (attempts.length === 0) {
                    void loadAttempts(selectedWord.word_id);
                  }
                }}
              >
                Questions
              </Button>
              <Button
                className="button-danger"
                variant="ghost"
                type="button"
                onClick={() => handleDowngrade(selectedWord.word_id)}
                disabled={downgrading}
                loading={downgrading}
              >
                Downgrade
              </Button>
            </div>
            <div className="word-detail-header">
              <div className="badge-stack">
                <span className={`badge ${selectedMeta.badge.className}`}>
                  {selectedMeta.badge.showIcon ? (
                    <span className="badge-icon" aria-hidden>
                      <svg viewBox="0 0 24 24" fill="none">
                        <path
                          d="M12 4l2.6 5.3 5.9.9-4.2 4.1 1 5.8-5.3-2.8-5.3 2.8 1-5.8-4.2-4.1 5.9-.9L12 4z"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  ) : null}
                  {selectedMeta.badge.label}
                </span>
                {selectedWord.is_assigned ? (
                  <span className="badge badge-info">Assigned</span>
                ) : null}
              </div>
              {selectedTiming ? (
                <p className="ds-caption">
                  {selectedTiming.label}: {selectedTiming.value}
                </p>
              ) : null}
            </div>
            {selectedWord.primary_definition ? (
              <p className="ds-body muted">{selectedWord.primary_definition}</p>
            ) : null}
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${selectedMeta.percent ?? 0}%` }}
              />
            </div>
            {selectedTab === "details" ? (
              <>
                <div className="word-detail-grid">
                  <div className="word-detail-item">
                    <span className="ds-caption">Mastery</span>
                    <span className="ds-body">
                      {selectedMeta.percent !== null
                        ? `${Math.round(selectedMeta.percent)}%`
                        : "-"}
                    </span>
                  </div>
                  <div className="word-detail-item">
                    <span className="ds-caption">Mastery rating</span>
                    <span className="ds-body">
                      {formatNumber(selectedWord.mastery_rating)}
                    </span>
                  </div>
                  <div className="word-detail-item">
                    <span className="ds-caption">Learned rating</span>
                    <span className="ds-body">
                      {formatNumber(selectedWord.learned_rating)}
                    </span>
                  </div>
                  <div className="word-detail-item">
                    <span className="ds-caption">Accuracy</span>
                    <span className="ds-body">
                      {typeof selectedWord.accuracy === "number"
                        ? formatAccuracy(selectedWord.accuracy)
                        : "-"}
                    </span>
                  </div>
                  <div className="word-detail-item">
                    <span className="ds-caption">Seen count</span>
                    <span className="ds-body">
                      {formatNumber(selectedWord.seen_count)}
                    </span>
                  </div>
                  <div className="word-detail-item">
                    <span className="ds-caption">Correct</span>
                    <span className="ds-body">{formatNumber(selectedCorrect)}</span>
                  </div>
                  <div className="word-detail-item">
                    <span className="ds-caption">Incorrect</span>
                    <span className="ds-body">
                      {formatNumber(selectedIncorrect)}
                    </span>
                  </div>
                  <div className="word-detail-item">
                    <span className="ds-caption">Streak</span>
                    <span className="ds-body">{formatNumber(selectedStreak)}</span>
                  </div>
                </div>
                <div className="stack">
                  <span className="ds-caption">Manual adjustments</span>
                  <div className="actions">
                    <Button
                      variant="secondary"
                      type="button"
                      onClick={() =>
                        handleAdjust(selectedWord.word_id, { learned_delta: -1 })
                      }
                      disabled={adjusting}
                    >
                      Learned -1
                    </Button>
                    <Button
                      variant="secondary"
                      type="button"
                      onClick={() =>
                        handleAdjust(selectedWord.word_id, { learned_delta: 1 })
                      }
                      disabled={adjusting}
                    >
                      Learned +1
                    </Button>
                    <Button
                      variant="ghost"
                      type="button"
                      onClick={() =>
                        handleAdjust(selectedWord.word_id, { mastery_delta: -1 })
                      }
                      disabled={adjusting}
                    >
                      Mastery -1
                    </Button>
                    <Button
                      variant="ghost"
                      type="button"
                      onClick={() =>
                        handleAdjust(selectedWord.word_id, { mastery_delta: 1 })
                      }
                      disabled={adjusting}
                    >
                      Mastery +1
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="attempts">
                {loadingAttempts ? (
                  <Card tone="muted">
                    <p className="ds-body muted">Loading questions...</p>
                  </Card>
                ) : null}
                {!loadingAttempts && attempts.length === 0 ? (
                  <Card tone="muted">
                    <p className="ds-body muted">No questions answered yet.</p>
                  </Card>
                ) : null}
                <div className="attempts-list">
                  {attempts.map((attempt) => (
                    <Card
                      key={String(attempt.attempt_id)}
                      tone="muted"
                      className="attempt-card"
                    >
                      <div className="attempt-meta">
                        <span>{formatDateTime(attempt.created_at)}</span>
                        <span>
                          {attempt.correct ? "Correct" : "Incorrect"}
                        </span>
                        <span className="muted">{attempt.question_type}</span>
                      </div>
                      <div className="stack">
                        <p className="ds-body">{attempt.prompt}</p>
                        <ol className="attempt-choices">
                          {attempt.choices.map((choice, index) => {
                            const isCorrect = index === attempt.correct_index;
                            const isChosen = index === attempt.chosen_index;
                            const className = [
                              "attempt-choice",
                              isCorrect ? "attempt-choice-correct" : "",
                              isChosen ? "attempt-choice-chosen" : "",
                            ]
                              .filter(Boolean)
                              .join(" ");
                            return (
                              <li key={index} className={className}>
                                {choice}
                              </li>
                            );
                          })}
                        </ol>
                        {attempt.explanation ? (
                          <p className="ds-caption muted">
                            Explanation: {attempt.explanation}
                          </p>
                        ) : null}
                      </div>
                    </Card>
                  ))}
                </div>
                {attemptsTotal !== null && attempts.length < attemptsTotal ? (
                  <div className="actions">
                    <Button
                      type="button"
                      onClick={() => loadMoreAttempts(selectedWord.word_id)}
                      disabled={loadingMoreAttempts}
                      loading={loadingMoreAttempts}
                    >
                      Load more
                    </Button>
                  </div>
                ) : null}
              </div>
            )}
            {Array.isArray(selectedWord.history) && selectedWord.history.length ? (
              <div className="word-detail-history">
                <h3 className="ds-h2">History</h3>
                <ul className="word-detail-list">
                  {selectedWord.history.map((entry, index) => (
                    <li key={index} className="ds-caption">
                      {JSON.stringify(entry)}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}
      </Modal>

      <Toast message={error} tone="error" />
    </AppShell>
  );
}
