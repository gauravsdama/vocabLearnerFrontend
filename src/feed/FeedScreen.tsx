import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import Button from "../components/Button";
import Card from "../components/Card";
import Toast from "../components/Toast";
import { apiGet, apiPost } from "../api/client";
import type {
  FeedCard,
  FeedEndRequest,
  FeedNextResponse,
  FeedSessionResponse,
  MarkSkippedRequest,
  MarkViewedRequest,
  Progress,
} from "../api/types";
import { debounce } from "../utils/debounce";
import { getErrorMessage } from "../utils/apiError";
import { logError, logInfo, logWarn } from "../utils/logger";
import CardRenderer from "./CardRenderer";
import { useMessages } from "../components/MessageCenter";

const FEED_LIMIT = 10;

export default function FeedScreen() {
  const navigate = useNavigate();
  const { addMessages } = useMessages();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewed = useRef<Set<string>>(new Set());
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [cards, setCards] = useState<FeedCard[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const activeCardIdRef = useRef<string | null>(null);

  const loadInitial = useCallback(async () => {
    setLoading(true);
    setError(null);
    setActiveIndex(0);
    setProgress(null);
    viewed.current.clear();
    let resumeLoaded = false;
    try {
      logInfo("WEB_FEED_RESUME_START", "Feed resume started", {
        method: "POST",
        url: "/feed/resume",
      });
      const resume = await apiPost<FeedSessionResponse>("/feed/resume", {
        mode: "mixed",
        limit: FEED_LIMIT,
      });
      resumeLoaded = true;
      logInfo("WEB_FEED_RESUME_OK", "Feed resume succeeded", {
        method: "POST",
        url: "/feed/resume",
        status: 200,
        card_count: resume.cards.length,
      });
      if (resume.cards.length === 0) {
        logInfo("WEB_FEED_START_START", "Feed start started", {
          method: "POST",
          url: "/feed/start",
        });
        try {
          const start = await apiPost<FeedSessionResponse>("/feed/start", {
            mode: "mixed",
            limit: FEED_LIMIT,
          });
          if (start.messages?.length) {
            addMessages(start.messages);
          }
          logInfo("WEB_FEED_START_OK", "Feed start succeeded", {
            method: "POST",
            url: "/feed/start",
            status: 200,
            card_count: start.cards.length,
          });
          setSessionId(start.feed_session_id);
          setCards(start.cards);
          setHasMore(true);
        } catch (err) {
          logError("WEB_FEED_START_FAIL", "Feed start failed", {
            method: "POST",
            url: "/feed/start",
            status: (err as { status?: number }).status ?? null,
            server_request_id: (err as { requestId?: string }).requestId ?? null,
            client_request_id:
              (err as { clientRequestId?: string }).clientRequestId ?? null,
          });
          throw err;
        }
      } else {
        if (resume.messages?.length) {
          addMessages(resume.messages);
        }
        setSessionId(resume.feed_session_id);
        setCards(resume.cards);
        setHasMore(true);
      }
    } catch (err) {
      if (!resumeLoaded) {
        logError("WEB_FEED_RESUME_FAIL", "Feed resume failed", {
          method: "POST",
          url: "/feed/resume",
          status: (err as { status?: number }).status ?? null,
          server_request_id: (err as { requestId?: string }).requestId ?? null,
          client_request_id:
            (err as { clientRequestId?: string }).clientRequestId ?? null,
        });
      }
      setError(getErrorMessage(err, "Failed to load feed"));
    } finally {
      setLoading(false);
    }
  }, [addMessages]);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  useEffect(() => {
    sessionIdRef.current = sessionId;
  }, [sessionId]);

  const fetchMore = useCallback(async () => {
    if (!sessionId || loadingMore || !hasMore) {
      return;
    }
    setLoadingMore(true);
    try {
      logInfo("WEB_FEED_NEXT_START", "Feed next started", {
        method: "GET",
        url: `/feed/${sessionId}/next`,
      });
      const lastCard = cards[cards.length - 1];
      const lastIndex = lastCard?.position_index ?? cards.length - 1;
      const response = await apiGet<FeedNextResponse>(
        `/feed/${sessionId}/next?after_index=${lastIndex}&limit=${FEED_LIMIT}`,
      );
      if (response.messages?.length) {
        addMessages(response.messages);
      }
      logInfo("WEB_FEED_NEXT_OK", "Feed next succeeded", {
        method: "GET",
        url: `/feed/${sessionId}/next`,
        status: 200,
        card_count: response.cards.length,
      });
      if (response.feed_session_id) {
        setSessionId(response.feed_session_id);
      }
      if (response.cards.length === 0) {
        setHasMore(false);
      } else {
        setCards((prev) => [...prev, ...response.cards]);
      }
    } catch (err) {
      logError("WEB_FEED_NEXT_FAIL", "Feed next failed", {
        method: "GET",
        url: `/feed/${sessionId}/next`,
        status: (err as { status?: number }).status ?? null,
        server_request_id: (err as { requestId?: string }).requestId ?? null,
        client_request_id:
          (err as { clientRequestId?: string }).clientRequestId ?? null,
      });
      setError(getErrorMessage(err, "Failed to load more cards"));
    } finally {
      setLoadingMore(false);
    }
  }, [sessionId, loadingMore, hasMore, cards, addMessages]);

  useEffect(() => {
    if (!sessionId || !hasMore) {
      return;
    }
    const remaining = cards.length - activeIndex;
    if (remaining <= 3) {
      fetchMore();
    }
  }, [activeIndex, cards.length, fetchMore, hasMore, sessionId]);

  useEffect(() => {
    if (!sessionId) {
      return undefined;
    }
    const card = cards[activeIndex];
    if (!card) {
      return undefined;
    }
    activeCardIdRef.current = card.card_id;
    if (viewed.current.has(card.card_id)) {
      return undefined;
    }

    const markViewed = () => {
      if (!sessionId) {
        return;
      }
      if (viewed.current.has(card.card_id)) {
        return;
      }
      viewed.current.add(card.card_id);
      const payload: MarkViewedRequest = {
        feed_session_id: sessionId,
        feed_card_id: card.card_id,
      };
      logInfo("WEB_FEED_MARK_VIEWED", "Feed mark viewed", {
        method: "POST",
        url: "/feed/mark_viewed",
        feed_card_id: card.card_id,
        feed_session_id: sessionId,
        position_index: card.position_index,
      });
      apiPost("/feed/mark_viewed", payload)
        .then(() => undefined)
        .catch((err) => {
          logWarn("WEB_FEED_MARK_VIEWED", "Feed mark viewed failed", {
            method: "POST",
            url: "/feed/mark_viewed",
            status: (err as { status?: number }).status ?? null,
            server_request_id: (err as { requestId?: string }).requestId ?? null,
            client_request_id:
              (err as { clientRequestId?: string }).clientRequestId ?? null,
          });
        });
    };

    if (card.card_type !== "WORD") {
      markViewed();
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      if (activeCardIdRef.current !== card.card_id) {
        return;
      }
      markViewed();
    }, 7000);

    return () => window.clearTimeout(timeoutId);
  }, [activeIndex, cards, sessionId]);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) {
      return undefined;
    }

    const handleScroll = debounce(() => {
      if (!containerRef.current) {
        return;
      }
      const { scrollTop, clientHeight } = containerRef.current;
      const nextIndex = Math.round(scrollTop / clientHeight);
      setActiveIndex((prev) => (prev === nextIndex ? prev : nextIndex));
    }, 60);

    node.addEventListener("scroll", handleScroll);
    return () => {
      node.removeEventListener("scroll", handleScroll);
      handleScroll.cancel();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (!sessionIdRef.current) {
        return;
      }
      logInfo("WEB_FEED_END", "Feed end on unmount", {
        method: "POST",
        url: "/feed/end",
        feed_session_id: sessionIdRef.current,
      });
      const payload: FeedEndRequest = {
        feed_session_id: sessionIdRef.current,
      };
      apiPost("/feed/end", payload).catch((err) => {
        logWarn("WEB_FEED_END", "Feed end failed", {
          method: "POST",
          url: "/feed/end",
          status: (err as { status?: number }).status ?? null,
          server_request_id: (err as { requestId?: string }).requestId ?? null,
          client_request_id:
            (err as { clientRequestId?: string }).clientRequestId ?? null,
        });
      });
    };
  }, []);

  const scrollToIndex = (index: number) => {
    const node = containerRef.current;
    if (!node) {
      return;
    }
    node.scrollTo({
      top: index * node.clientHeight,
      behavior: "smooth",
    });
  };

  const handleSkip = async (card: FeedCard) => {
    if (!sessionId) {
      return;
    }
    try {
      logInfo("WEB_FEED_MARK_SKIPPED", "Feed mark skipped", {
        method: "POST",
        url: "/feed/mark_skipped",
        feed_card_id: card.card_id,
        feed_session_id: sessionId,
      });
      const payload: MarkSkippedRequest = {
        feed_session_id: sessionId,
        feed_card_id: card.card_id,
      };
      await apiPost("/feed/mark_skipped", payload);
    } catch (err) {
      logWarn("WEB_FEED_MARK_SKIPPED", "Feed mark skipped failed", {
        method: "POST",
        url: "/feed/mark_skipped",
        status: (err as { status?: number }).status ?? null,
        server_request_id: (err as { requestId?: string }).requestId ?? null,
        client_request_id:
          (err as { clientRequestId?: string }).clientRequestId ?? null,
      });
      setError(getErrorMessage(err, "Failed to skip card"));
    } finally {
      scrollToIndex(Math.min(activeIndex + 1, cards.length));
    }
  };

  const endSession = useCallback(async (currentSessionId: string | null) => {
    if (!currentSessionId) {
      return;
    }
    logInfo("WEB_FEED_END", "Feed end started", {
      method: "POST",
      url: "/feed/end",
      feed_session_id: currentSessionId,
    });
    const payload: FeedEndRequest = { feed_session_id: currentSessionId };
    await apiPost("/feed/end", payload);
  }, []);

  const startNewSession = async () => {
    setLoading(true);
    setError(null);
    setProgress(null);
    try {
      try {
        await endSession(sessionId);
      } catch {
        logWarn("WEB_FEED_END", "Feed end failed before new session", {
          method: "POST",
          url: "/feed/end",
          feed_session_id: sessionId,
        });
        // best effort
      }
      logInfo("WEB_FEED_START_START", "Feed start started", {
        method: "POST",
        url: "/feed/start",
      });
      const start = await apiPost<FeedSessionResponse>("/feed/start", {
        mode: "mixed",
        limit: FEED_LIMIT,
      });
      if (start.messages?.length) {
        addMessages(start.messages);
      }
      logInfo("WEB_FEED_START_OK", "Feed start succeeded", {
        method: "POST",
        url: "/feed/start",
        status: 200,
        card_count: start.cards.length,
      });
      setSessionId(start.feed_session_id);
      setCards(start.cards);
      setHasMore(true);
      setActiveIndex(0);
      viewed.current.clear();
      scrollToIndex(0);
    } catch (err) {
      logError("WEB_FEED_START_FAIL", "Feed start failed", {
        method: "POST",
        url: "/feed/start",
        status: (err as { status?: number }).status ?? null,
        server_request_id: (err as { requestId?: string }).requestId ?? null,
        client_request_id:
          (err as { clientRequestId?: string }).clientRequestId ?? null,
      });
      setError(getErrorMessage(err, "Failed to start new session"));
    } finally {
      setLoading(false);
    }
  };

  const onProgressUpdate = useCallback((next?: Progress) => {
    if (next) {
      setProgress(next);
    }
  }, []);

  if (loading) {
    return (
      <AppShell centered maxWidth="narrow">
        <Card className="loading-card">
          <span className="ds-label">Loading</span>
          <h1 className="ds-h2">Preparing your feed.</h1>
        </Card>
      </AppShell>
    );
  }

  if (!loading && cards.length === 0) {
    return (
      <AppShell centered maxWidth="narrow">
        <Card className="loading-card">
          <span className="ds-label">No cards yet</span>
          <h1 className="ds-h2">Your feed is empty.</h1>
          <p className="ds-body muted">
            Start a new session to pull fresh cards.
          </p>
          <div className="actions">
            <Button onClick={startNewSession} size="lg">
              Start New Session
            </Button>
            <Button variant="ghost" onClick={() => navigate("/")}>
              Back to Home
            </Button>
          </div>
        </Card>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Your feed"
      action={
        <Button variant="ghost" onClick={() => navigate("/")}>
          Back
        </Button>
      }
      maxWidth="full"
      className="app-shell-feed"
      contentClassName="feed-shell"
    >
      <div className="feed-container" ref={containerRef}>
        {cards.map((card, index) => (
          <CardRenderer
            key={card.card_id}
            card={card}
            onSkip={() => handleSkip(card)}
            onProgressUpdate={onProgressUpdate}
            isActive={index === activeIndex}
            progress={progress}
          />
        ))}
        {!hasMore && cards.length > 0 ? (
          <div className="feed-card">
            <Card className="feed-card-inner end-card">
              <div className="stack">
                <span className="ds-label">Session complete</span>
                <h2 className="ds-h2">That's everything for now.</h2>
                <p className="ds-body muted">
                  Start a new session or head back to your menu.
                </p>
                <div className="actions">
                  <Button onClick={startNewSession} size="lg">
                    Start New Session
                  </Button>
                  <Button variant="ghost" onClick={() => navigate("/")}>
                    Back to Home
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        ) : null}
      </div>
      <Toast message={error} tone="error" />
    </AppShell>
  );
}
