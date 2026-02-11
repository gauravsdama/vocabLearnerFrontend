import clsx from "./clsx";

type ToastProps = {
  message: string | null;
  tone?: "error" | "info";
};

export default function Toast({ message, tone = "info" }: ToastProps) {
  if (!message) {
    return null;
  }

  return (
    <div className={clsx("toast", `toast-${tone}`)} role="status">
      <span className="toast-icon" aria-hidden>
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          <path
            d="M12 7.5v5.2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="12" cy="17.2" r="1.2" fill="currentColor" />
        </svg>
      </span>
      <span>{message}</span>
    </div>
  );
}
