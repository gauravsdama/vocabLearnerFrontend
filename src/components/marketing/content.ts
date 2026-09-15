import landingCopyMarkdown from "../../../LANDING_PAGE_COPY.pair.md?raw";

export type DemoStateId =
  | "word"
  | "question"
  | "feedback"
  | "review"
  | "reminders"
  | "summary";

export type DemoState = {
  id: DemoStateId;
  label: string;
  sideTitle: string;
  sideBody: string;
  ariaLabel: string;
};

function parseLandingCopy(markdown: string) {
  const entries = new Map<string, string>();
  const entryPattern = /#### `([^`]+)`[\s\S]*?```text\r?\n([\s\S]*?)\r?\n```/g;
  let match: RegExpExecArray | null;

  while ((match = entryPattern.exec(markdown)) !== null) {
    entries.set(match[1], match[2].trim().replace(/\s*\r?\n\s*/g, " "));
  }

  return (key: string) => {
    const value = entries.get(key);
    if (!value) {
      throw new Error(
        `[landing-copy] Missing or empty entry "${key}" in LANDING_PAGE_COPY.pair.md`,
      );
    }
    return value;
  };
}

export const copy = parseLandingCopy(landingCopyMarkdown);

const indexed = (prefix: string, count: number) =>
  Array.from({ length: count }, (_, index) => copy(`${prefix}.${index + 1}`));

export const heroContent = {
  headline: copy("hero.headline"),
  subheadline: copy("hero.subheadline"),
  primaryCta: copy("hero.primaryCta"),
  secondaryCta: copy("hero.secondaryCta"),
};

export const heroHighlights = indexed("hero.highlight", 3);

const demoIds: DemoStateId[] = [
  "word",
  "question",
  "feedback",
  "review",
  "reminders",
  "summary",
];

export const demoStates: DemoState[] = demoIds.map((id) => ({
  id,
  label: copy(`demo.${id}.label`),
  sideTitle: copy(`demo.${id}.sideTitle`),
  sideBody: copy(`demo.${id}.sideBody`),
  ariaLabel: copy(`demo.${id}.ariaLabel`),
}));

export const problemSection = {
  headline: copy("problem.headline"),
  body: copy("problem.body"),
  cards: Array.from({ length: 3 }, (_, index) => ({
    title: copy(`problem.card.${index + 1}.title`),
    body: copy(`problem.card.${index + 1}.body`),
  })),
};

export const solutionSection = {
  headline: copy("solution.headline"),
  body: copy("solution.body"),
  features: Array.from({ length: 4 }, (_, index) => ({
    title: copy(`solution.feature.${index + 1}.title`),
    description: copy(`solution.feature.${index + 1}.body`),
  })),
};

export const habitSection = {
  headline: copy("habit.headline"),
  body: copy("habit.body"),
  pillars: Array.from({ length: 3 }, (_, index) => ({
    title: copy(`habit.pillar.${index + 1}.title`),
    description: copy(`habit.pillar.${index + 1}.body`),
  })),
};

export const reminderSection = {
  headline: copy("reminder.headline"),
  body: copy("reminder.body"),
  cards: Array.from({ length: 3 }, (_, index) => {
    const prefix = `reminder.card.${index + 1}`;
    return {
      app: copy(`${prefix}.app`),
      channel: copy(`${prefix}.channel`),
      time: copy(`${prefix}.time`),
      subject: copy(`${prefix}.subject`),
      body: copy(`${prefix}.body`),
    };
  }),
};

export const audienceSection = {
  headline: copy("audience.headline"),
  students: indexed("audience.student", 4),
  parents: indexed("audience.parent", 4),
};

export const ctaSection = {
  headline: copy("cta.headline"),
  subheadline: copy("cta.subheadline"),
  primaryCta: copy("cta.primary"),
  secondaryCta: copy("cta.secondary"),
};
