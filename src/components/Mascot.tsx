import clsx from "./clsx";
import {
  type MascotPose,
  type MascotVariant,
  resolveMascotAsset,
} from "../mascot/catalog";
import { useMascotVariant } from "../mascot/useMascotVariant";

type MascotSize = "sm" | "md" | "lg" | "xl";

type MascotProps = {
  pose: MascotPose;
  alt?: string;
  decorative?: boolean;
  variant?: MascotVariant;
  size?: MascotSize;
  loading?: "eager" | "lazy";
  className?: string;
  imageClassName?: string;
};

export default function Mascot({
  pose,
  alt,
  decorative = false,
  variant,
  size = "lg",
  loading = "lazy",
  className,
  imageClassName,
}: MascotProps) {
  const requestedVariant = useMascotVariant(variant);
  const { actualVariant, src } = resolveMascotAsset(requestedVariant, pose);
  const resolvedAlt = decorative ? "" : alt ?? "VocabCat mascot illustration";

  return (
    <div
      className={clsx(
        "mascot",
        `mascot-size-${size}`,
        `mascot-variant-${requestedVariant}`,
        className,
      )}
      data-mascot-requested={requestedVariant}
      data-mascot-served={actualVariant}
    >
      <span className="mascot-glow" aria-hidden />
      <img
        src={src}
        alt={resolvedAlt}
        aria-hidden={decorative ? true : undefined}
        className={clsx("mascot-image", imageClassName)}
        loading={loading}
        decoding="async"
      />
    </div>
  );
}
