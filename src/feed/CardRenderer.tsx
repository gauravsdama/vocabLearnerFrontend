import React, { useEffect, useRef, useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import OptionCard from "../components/OptionCard";
import ProgressPill from "../components/ProgressPill";
import Toast from "../components/Toast";
import { apiPost } from "../api/client";
import type {
  FeedCard,
  Progress,
  QuizCard,
  QuizSubmitResponse,
  SentenceSubmitResponse,
  WordCard,
  WriteSentenceCard,
} from "../api/types";
import { getErrorMessage } from "../utils/apiError";
import { logError, logInfo, logWarn } from "../utils/logger";

const emptyArray: string[] = [];
const EXAMPLE_TARGET = 3;

function formatPartOfSpeech(value?: string | null) {
  if (!value) {
    return null;
  }
  const normalized = value.trim().toLowerCase();
  const map: Record<string, string> = {
    "n.": "noun",
    "v.": "verb",
    "adj.": "adjective",
    "adv.": "adverb",
    "prep.": "preposition",
    "pron.": "pronoun",
    "conj.": "conjunction",
    "interj.": "interjection",
  };
  const expanded = map[normalized] ?? normalized;
  return expanded.charAt(0).toUpperCase() + expanded.slice(1);
}

function getUniqueExamples(examples: string[]) {
  const cleaned = examples.map((item) => item.trim()).filter(Boolean);
  return Array.from(new Set(cleaned));
}

type CardRendererProps = {
  card: FeedCard;
  onSkip: () => void;
  onProgressUpdate: (progress?: Progress) => void;
  isActive: boolean;
  progress?: Progress | null;
};

export default function CardRenderer({
  card,
  onSkip,
  onProgressUpdate,
  isActive,
  progress,
}: CardRendererProps) {
  const [toast, setToast] = useState<string | null>(null);
  const cardAccent =
    card.card_type === "WORD"
      ? "word"
      : card.card_type === "QUIZ_MCQ"
        ? "quiz"
        : "sentence";
  const pillTone = cardAccent;
  const displayProgress = progress ?? card.progress;
  const cardLabel =
    card.card_type === "WORD"
      ? "Word"
      : card.card_type === "QUIZ_MCQ"
        ? "Question"
        : "Prompt";

  useEffect(() => {
    setToast(null);
  }, [card.card_id]);

  return (
    <div className="feed-card">
      <Card className="feed-card-inner" accent={cardAccent}>
        <div className="feed-card-top">
          <div className="feed-card-meta">
            <span className={`pill pill-${pillTone}`}>{cardLabel}</span>
            <ProgressPill progress={displayProgress} />
          </div>
          <Button variant="ghost" onClick={onSkip}>
            Skip
          </Button>
        </div>
        <div className="feed-card-body">
          {card.card_type === "WORD" ? (
            <WordCardView card={card} onSkip={onSkip} isActive={isActive} />
          ) : card.card_type === "QUIZ_MCQ" ? (
            <QuizCardView
              card={card}
              onProgressUpdate={onProgressUpdate}
              onToast={setToast}
            />
          ) : (
            <SentenceCardView
              card={card}
              onProgressUpdate={onProgressUpdate}
              onToast={setToast}
            />
          )}
        </div>
        <Toast message={toast} tone="error" />
      </Card>
    </div>
  );
}

function WordCardView({
  card,
  onSkip,
  isActive,
}: {
  card: WordCard;
  onSkip: () => void;
  isActive: boolean;
}) {
  const [index, setIndex] = useState(0);
  const autoSkippedRef = useRef(false);

  useEffect(() => {
    setIndex(0);
    autoSkippedRef.current = false;
  }, [card.card_id]);

  const examplesRaw = card.word.examples ?? emptyArray;
  const uniqueExamples = getUniqueExamples(examplesRaw);
  const examples = uniqueExamples.slice(0, EXAMPLE_TARGET);
  const partOfSpeech = formatPartOfSpeech(card.word.part_of_speech);

  const pages = [
    <div className="stack" key="definition">
      <h2 className="ds-h1 word-title">{card.word.word.toUpperCase()}</h2>
      {partOfSpeech ? <p className="part-of-speech">{partOfSpeech}</p> : null}
      <p className="ds-body muted">
        {card.word.definition ?? "Definition not available."}
      </p>
    </div>,
    <div className="stack" key="examples">
      <h3 className="examples-title">Example sentences</h3>
      {examples.length > 0 ? (
        <ul className="example-list">
          {examples.map((example, exampleIndex) => (
            <li key={`${example}-${exampleIndex}`} className="ds-body">
              {example}
            </li>
          ))}
        </ul>
      ) : null}
    </div>,
  ];

  useEffect(() => {
    if (!isActive) {
      return;
    }
    if (uniqueExamples.length >= EXAMPLE_TARGET) {
      autoSkippedRef.current = false;
      return;
    }
    if (autoSkippedRef.current) {
      return;
    }
    autoSkippedRef.current = true;
    logWarn("WEB_FEED_EXAMPLES_INSUFFICIENT", "Insufficient unique examples", {
      card_id: card.card_id,
      word_id: card.word.word_id,
      word: card.word.word,
      examples_count: examplesRaw.length,
      unique_examples_count: uniqueExamples.length,
      examples: examplesRaw,
    });
    onSkip();
  }, [
    card.card_id,
    card.word.word,
    card.word.word_id,
    examplesRaw.length,
    uniqueExamples.length,
    onSkip,
    isActive,
  ]);

  if (card.quiz) {
    pages.push(
      <div className="stack" key="quiz-preview">
        <h3 className="ds-h2">Quiz preview</h3>
        <p className="ds-body muted">{card.quiz.prompt}</p>
        <div className="choice-grid">
          {card.quiz.choices.map((choice) => (
            <OptionCard key={choice} state="disabled">
              {choice}
            </OptionCard>
          ))}
        </div>
      </div>,
    );
  }

  return <Subpages pages={pages} index={index} onChange={setIndex} />;
}

function QuizCardView({
  card,
  onProgressUpdate,
  onToast,
}: {
  card: QuizCard;
  onProgressUpdate: (progress?: Progress) => void;
  onToast: (message: string | null) => void;
}) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<QuizSubmitResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIndex(0);
    setSelected(null);
    setResult(null);
  }, [card.card_id]);

  if (!card.quiz) {
    return (
      <Subpages
        pages={[
          <div className="stack" key="missing">
            <h2 className="ds-h2">Quiz unavailable</h2>
            <p className="ds-body muted">No quiz data was provided.</p>
          </div>,
        ]}
        index={0}
        onChange={() => undefined}
      />
    );
  }

  const submit = async () => {
    if (selected === null || loading) {
      return;
    }
    setLoading(true);
    try {
      logInfo("WEB_QUIZ_SUBMIT_START", "Quiz submit started", {
        method: "POST",
        url: "/quiz/submit",
        feed_card_id: card.card_id,
        question_id: card.quiz.question_id,
      });
      const response = await apiPost<QuizSubmitResponse>("/quiz/submit", {
        feed_card_id: card.card_id,
        question_id: card.quiz.question_id,
        chosen_index: selected,
      });
      setResult(response);
      onProgressUpdate(response.updated_progress);
      setIndex(2);
      logInfo("WEB_QUIZ_SUBMIT_OK", "Quiz submit succeeded", {
        method: "POST",
        url: "/quiz/submit",
        status: 200,
        feed_card_id: card.card_id,
      });
    } catch (err) {
      logError("WEB_QUIZ_SUBMIT_FAIL", "Quiz submit failed", {
        method: "POST",
        url: "/quiz/submit",
        status: (err as { status?: number }).status ?? null,
        server_request_id: (err as { requestId?: string }).requestId ?? null,
        client_request_id:
          (err as { clientRequestId?: string }).clientRequestId ?? null,
        feed_card_id: card.card_id,
      });
      onToast(getErrorMessage(err, "Quiz submission failed."));
    } finally {
      setLoading(false);
    }
  };

  const pages = [
    <div className="stack" key="question">
      <h2 className="ds-h1">{card.quiz.prompt}</h2>
    </div>,
    <div className="stack" key="choices">
      <h3 className="ds-h2">Choices</h3>
      <div className="choice-grid">
        {card.quiz.choices.map((choice, choiceIndex) => (
          <OptionCard
            key={choice}
            state={
              result
                ? selected === choiceIndex
                  ? result.correct
                    ? "correct"
                    : "incorrect"
                  : "disabled"
                : selected === choiceIndex
                  ? "selected"
                  : "idle"
            }
            disabled={loading || Boolean(result)}
            onClick={() => setSelected(choiceIndex)}
          >
            {choice}
          </OptionCard>
        ))}
      </div>
      <Button onClick={submit} disabled={selected === null || loading}>
        {loading ? "Checking..." : "Submit"}
      </Button>
    </div>,
    <div className="stack" key="result">
      <h3 className="ds-h2">Result</h3>
      {result ? (
        <>
          <p className={result.correct ? "correct" : "incorrect"}>
            {result.correct ? "Correct" : "Incorrect"}
          </p>
          {result.explanation ? (
            <p className="ds-body muted">{result.explanation}</p>
          ) : null}
        </>
      ) : (
        <p className="ds-body muted">Submit your answer to see results.</p>
      )}
    </div>,
  ];

  return <Subpages pages={pages} index={index} onChange={setIndex} />;
}

function SentenceCardView({
  card,
  onProgressUpdate,
  onToast,
}: {
  card: WriteSentenceCard;
  onProgressUpdate: (progress?: Progress) => void;
  onToast: (message: string | null) => void;
}) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [result, setResult] = useState<SentenceSubmitResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIndex(0);
    setText("");
    setResult(null);
  }, [card.card_id]);

  const submit = async () => {
    if (!text.trim() || loading) {
      return;
    }
    setLoading(true);
    try {
      logInfo("WEB_SENT_SUBMIT_START", "Sentence submit started", {
        method: "POST",
        url: "/sentence/submit",
        feed_card_id: card.card_id,
        word_id: card.word.word_id,
      });
      const response = await apiPost<SentenceSubmitResponse>(
        "/sentence/submit",
        {
          feed_card_id: card.card_id,
          word_id: card.word.word_id,
          sentence_text: text,
        },
      );
      setResult(response);
      onProgressUpdate(response.updated_progress);
      setIndex(2);
      logInfo("WEB_SENT_SUBMIT_OK", "Sentence submit succeeded", {
        method: "POST",
        url: "/sentence/submit",
        status: 200,
        feed_card_id: card.card_id,
      });
    } catch (err) {
      logError("WEB_SENT_SUBMIT_FAIL", "Sentence submit failed", {
        method: "POST",
        url: "/sentence/submit",
        status: (err as { status?: number }).status ?? null,
        server_request_id: (err as { requestId?: string }).requestId ?? null,
        client_request_id:
          (err as { clientRequestId?: string }).clientRequestId ?? null,
        feed_card_id: card.card_id,
      });
      onToast(getErrorMessage(err, "Sentence submission failed."));
    } finally {
      setLoading(false);
    }
  };

  const promptText =
    card.write_sentence?.prompt ?? "Craft a sentence that feels natural.";

  const pages = [
    <div className="stack" key="prompt">
      <h2 className="ds-h1">Use "{card.word.word}"</h2>
      <p className="ds-body muted">{promptText}</p>
    </div>,
    <div className="stack" key="input">
      <h3 className="ds-h2">Write your sentence</h3>
      <textarea
        rows={5}
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={`Type a sentence with "${card.word.word}"`}
        className="ds-input"
      />
      <Button onClick={submit} disabled={!text.trim() || loading}>
        {loading ? "Submitting..." : "Submit"}
      </Button>
    </div>,
    <div className="stack" key="result">
      <h3 className="ds-h2">Result</h3>
      {result ? (
        <>
          <p className={result.is_valid ? "correct" : "incorrect"}>
            {result.is_valid ? "Looks good" : "Needs work"}
          </p>
          {typeof result.score === "number" ? (
            <p className="ds-body">Score: {result.score}</p>
          ) : null}
          <p className="ds-body muted">{result.feedback}</p>
        </>
      ) : (
        <p className="ds-body muted">Submit your sentence to get feedback.</p>
      )}
    </div>,
  ];

  return <Subpages pages={pages} index={index} onChange={setIndex} />;
}

type SubpagesProps = {
  pages: React.ReactNode[];
  index: number;
  onChange: (index: number) => void;
};

function Subpages({ pages, index, onChange }: SubpagesProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const ignoreScrollRef = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }
    const width = track.clientWidth;
    ignoreScrollRef.current = true;
    track.scrollTo({ left: index * width, behavior: "smooth" });
    const timeout = window.setTimeout(() => {
      ignoreScrollRef.current = false;
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [index]);

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track || ignoreScrollRef.current) {
      return;
    }
    const rawIndex = Math.round(track.scrollLeft / track.clientWidth);
    const nextIndex = Math.min(Math.max(rawIndex, 0), pages.length - 1);
    if (nextIndex !== index) {
      onChange(nextIndex);
    }
  };

  return (
    <div className="subpages">
      <div
        className="subpages-track"
        ref={trackRef}
        onScroll={handleScroll}
      >
        {pages.map((page, pageIndex) => (
          <div className="subpage" key={pageIndex}>
            {page}
          </div>
        ))}
      </div>
      <div className="subpage-controls">
        <div className="subpage-dots">
          {pages.map((_, dotIndex) => (
            <span
              key={dotIndex}
              className={dotIndex === index ? "dot dot-active" : "dot"}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
