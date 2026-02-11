import React from "react";
import clsx from "./clsx";

type OptionState = "idle" | "selected" | "correct" | "incorrect" | "disabled";

type OptionCardProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  state?: OptionState;
};

export default function OptionCard({
  state = "idle",
  className,
  disabled,
  children,
  ...props
}: OptionCardProps) {
  const isDisabled = disabled || state === "disabled";
  const stateClass = state !== "idle" ? `option-card-${state}` : "";
  const icon =
    state === "correct" ? (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M6 12.5l4 4 8-9"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ) : state === "incorrect" ? (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M8 8l8 8M16 8l-8 8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ) : null;

  return (
    <button
      type="button"
      className={clsx("option-card", stateClass, className)}
      disabled={isDisabled}
      aria-pressed={state === "selected" ? true : undefined}
      {...props}
    >
      <span className="option-card-text">{children}</span>
      {icon ? <span className="option-card-icon">{icon}</span> : null}
    </button>
  );
}
