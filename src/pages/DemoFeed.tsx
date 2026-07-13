import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import Button from "../components/Button";
import Card from "../components/Card";
import type { FeedCard } from "../api/types";
import { createDemoCards, submitDemoQuiz } from "../demo/demoCards";
import CardRenderer from "../feed/CardRenderer";
import { applyCardProgressUpdate } from "../feed/progressState";
import { debounce } from "../utils/debounce";

const FEED_WINDOW_BUFFER = 3;

export default function DemoFeed() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [cards, setCards] = useState(() => createDemoCards());
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(1);

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
    const updateViewportHeight = () => {
      const nextHeight = containerRef.current?.clientHeight ?? window.innerHeight;
      setViewportHeight(nextHeight > 0 ? nextHeight : 1);
    };

    updateViewportHeight();
    window.addEventListener("resize", updateViewportHeight);
    return () => window.removeEventListener("resize", updateViewportHeight);
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

  const resetDemo = () => {
    setCards(createDemoCards());
    setActiveIndex(0);
    scrollToIndex(0);
  };

  const onProgressUpdate = useCallback((cardId: string, nextProgress?: FeedCard["progress"]) => {
    if (!nextProgress) {
      return;
    }
    setCards((prev) => applyCardProgressUpdate(prev, cardId, nextProgress));
  }, []);

  const visibleRange = useMemo(() => {
    const start = Math.max(0, activeIndex - FEED_WINDOW_BUFFER);
    const end = Math.min(cards.length, activeIndex + FEED_WINDOW_BUFFER + 1);
    return { start, end };
  }, [activeIndex, cards.length]);

  const topSpacerHeight = visibleRange.start * viewportHeight;
  const bottomSpacerHeight = Math.max(0, cards.length - visibleRange.end) * viewportHeight;
  const visibleCards = cards.slice(visibleRange.start, visibleRange.end);

  return (
    <AppShell
      title="Demo feed"
      action={
        <>
          <Button variant="secondary" onClick={resetDemo}>
            Reset
          </Button>
          <Button variant="ghost" onClick={() => navigate("/")}>
            Back
          </Button>
        </>
      }
      maxWidth="full"
      className="app-shell-feed"
      contentClassName="feed-shell"
    >
      <div className="feed-container" ref={containerRef}>
        {topSpacerHeight > 0 ? (
          <div aria-hidden style={{ height: topSpacerHeight }} />
        ) : null}
        {visibleCards.map((card, offset) => {
          const index = visibleRange.start + offset;
          return (
            <CardRenderer
              key={card.card_id}
              card={card}
              onSkip={() => scrollToIndex(Math.min(activeIndex + 1, cards.length))}
              onProgressUpdate={onProgressUpdate}
              onQuizSubmit={submitDemoQuiz}
              isActive={index === activeIndex}
            />
          );
        })}
        {bottomSpacerHeight > 0 ? (
          <div aria-hidden style={{ height: bottomSpacerHeight }} />
        ) : null}
        <div className="feed-card">
          <Card className="feed-card-inner end-card">
            <div className="stack">
              <span className="ds-label">Demo complete</span>
              <h2 className="ds-h2">You reached the end of the sample feed.</h2>
              <p className="ds-body muted">
                Create an account to save progress, reminders, and review history.
              </p>
              <div className="actions">
                <Button onClick={() => navigate("/register")} size="lg">
                  Start Learning
                </Button>
                <Button variant="ghost" onClick={resetDemo}>
                  Replay Demo
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
