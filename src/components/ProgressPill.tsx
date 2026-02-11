import type { Progress } from "../api/types";

export default function ProgressPill({
  progress,
}: {
  progress?: Progress | null;
}) {
  if (!progress) {
    return null;
  }

  return (
    <div className="progress-pill">
      <span className="progress-pill-dot" aria-hidden />
      <span>Status: {progress.status}</span>
      <span>Seen: {progress.seen_count}</span>
      <span>
        Quiz: {progress.quiz_correct_count}/{progress.quiz_attempt_count}
      </span>
    </div>
  );
}
