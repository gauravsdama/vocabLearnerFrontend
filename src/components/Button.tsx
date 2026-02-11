import React from "react";
import clsx from "./clsx";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "md" | "lg";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  size?: ButtonSize;
  loading?: boolean;
};

export default function Button({
  variant = "primary",
  fullWidth = false,
  size = "md",
  loading = false,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "button",
        `button-${variant}`,
        `button-${size}`,
        fullWidth ? "button-block" : "",
        loading ? "button-loading" : "",
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <span className="button-spinner" aria-hidden /> : null}
      <span className="button-label">{children}</span>
    </button>
  );
}
