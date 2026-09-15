import clsx from "./clsx";
import Mascot from "./Mascot";
import { BRAND_MASCOT_POSE } from "../mascot/catalog";

type BrandWordmarkProps = {
  className?: string;
  textClassName?: string;
  text?: string;
};

export default function BrandWordmark({
  className,
  textClassName,
  text = "VocabCat",
}: BrandWordmarkProps) {
  return (
    <span className={clsx("brand-wordmark", className)}>
      <Mascot
        pose={BRAND_MASCOT_POSE}
        variant="white"
        decorative
        size="sm"
        loading="eager"
        className="brand-wordmark-mascot"
      />
      <span className={clsx("brand-wordmark-text", textClassName)}>{text}</span>
    </span>
  );
}
