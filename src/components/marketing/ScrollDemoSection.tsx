import { useEffect, useRef, useState } from "react";
import clsx from "../clsx";
import PhoneMockup from "./PhoneMockup";
import { copy, demoStates } from "./content";
import { marketingReadCat } from "./marketingCats";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(media.matches);

    update();
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", update);
      return () => media.removeEventListener("change", update);
    }

    media.addListener(update);
    return () => media.removeListener(update);
  }, []);

  return prefersReducedMotion;
}

export default function ScrollDemoSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      if (!sectionRef.current) {
        return;
      }

      const rect = sectionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const scrollableDistance = Math.max(rect.height - viewportHeight * 0.92, 1);
      const nextProgress = clamp((viewportHeight * 0.24 - rect.top) / scrollableDistance, 0, 1);
      const nextIndex = Math.round(nextProgress * (demoStates.length - 1));

      setProgress((previous) =>
        Math.abs(previous - nextProgress) > 0.001 ? nextProgress : previous,
      );
      setActiveIndex((previous) => (previous === nextIndex ? previous : nextIndex));
    };

    const onScroll = () => {
      if (frame) {
        return;
      }
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="marketing-demo-section"
      aria-labelledby="how-it-works-title"
    >
      <div className="marketing-shell marketing-demo-grid">
        <div className="marketing-demo-sticky">
          <div className="marketing-demo-intro">
            <h2 id="how-it-works-title" className="marketing-section-title">
              {copy("demo.headline")}
            </h2>
            <div className="marketing-demo-progress" aria-hidden>
              <span
                className="marketing-demo-progress-bar"
                style={{ transform: `scaleX(${Math.max(progress, 0.01)})` }}
              />
            </div>
          </div>
          <PhoneMockup activeIndex={activeIndex} reducedMotion={reducedMotion} />
        </div>

        <div className="marketing-demo-steps" aria-label={copy("demo.walkthroughAriaLabel")}>
          {demoStates.map((state, index) => (
            <article
              key={state.id}
              className={clsx(
                "marketing-demo-step",
                index === 0 ? "marketing-demo-step-featured" : "",
                index === activeIndex ? "marketing-demo-step-active" : "",
              )}
            >
              {index === 0 ? (
                <div className="marketing-demo-step-cat-shell" aria-hidden>
                  <img
                    src={marketingReadCat.src}
                    alt=""
                    className="marketing-demo-step-cat"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ) : null}
              <div className="marketing-demo-step-card">
                <span className="marketing-demo-step-index">
                  {copy(`demo.stepIndex.${index + 1}`)}
                </span>
                <div className="marketing-demo-step-copy">
                  <h3>{state.sideTitle}</h3>
                  <p>{state.sideBody}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
