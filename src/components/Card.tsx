import React from "react";
import clsx from "./clsx";

type CardTone = "surface" | "muted";
type CardAccent = "word" | "quiz" | "sentence" | "neutral";

type CardProps<T extends React.ElementType> = {
  as?: T;
  tone?: CardTone;
  accent?: CardAccent;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

export default function Card<T extends React.ElementType = "div">({
  as,
  tone = "surface",
  accent = "neutral",
  header,
  footer,
  className,
  children,
  ...props
}: CardProps<T>) {
  const Component = as ?? "div";
  const accentClass = accent !== "neutral" ? `card-accent-${accent}` : "";
  const content =
    header || footer ? (
      <>
        {header ? <div className="card-header">{header}</div> : null}
        <div className="card-body">{children}</div>
        {footer ? <div className="card-footer">{footer}</div> : null}
      </>
    ) : (
      children
    );

  return (
    <Component
      className={clsx("card", `card-${tone}`, accentClass, className)}
      {...props}
    >
      {content}
    </Component>
  );
}
