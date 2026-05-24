import React from "react";
import BrandWordmark from "./BrandWordmark";
import clsx from "./clsx";
import MessageCenter from "./MessageCenter";

type AppShellProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  centered?: boolean;
  maxWidth?: "default" | "narrow" | "full";
  className?: string;
  contentClassName?: string;
};

export default function AppShell({
  eyebrow,
  title,
  subtitle,
  action,
  children,
  centered = false,
  maxWidth = "default",
  className,
  contentClassName,
}: AppShellProps) {
  const showHeader = Boolean(eyebrow || title || subtitle || action);
  const isBrandEyebrow = eyebrow?.toLowerCase() === "vocabcat";
  const innerClass = clsx(
    "app-shell-inner",
    maxWidth === "narrow" ? "app-shell-narrow" : "",
    maxWidth === "full" ? "app-shell-full" : "",
  );

  return (
    <div className={clsx("app-shell", centered ? "app-shell-center" : "", className)}>
      <div className={innerClass}>
        {showHeader ? (
          <div className="app-shell-header">
            <div className="app-shell-title">
              {eyebrow ? (
                isBrandEyebrow ? (
                  <BrandWordmark />
                ) : (
                  <span className="ds-label">{eyebrow}</span>
                )
              ) : null}
              {title ? <h1 className="ds-h2">{title}</h1> : null}
              {subtitle ? <p className="ds-body muted">{subtitle}</p> : null}
            </div>
            {action ? <div className="app-shell-action">{action}</div> : null}
          </div>
        ) : null}
        <div className={clsx("app-shell-content", contentClassName)}>
          <MessageCenter />
          {children}
        </div>
      </div>
    </div>
  );
}
