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

export const heroContent = {
  headline: "Learn vocabulary the way you already scroll.",
  subheadline:
    "Vocabcat turns vocabulary practice into a short daily habit with quick questions, personalized review, reminders, and clear progress summaries.",
  primaryCta: "Start Learning",
  secondaryCta: "See How It Works",
};

export const heroHighlights = [
  "Short daily sessions",
  "Personalized review",
  "Learning summaries",
] as const;

export const demoStates: DemoState[] = [
  {
    id: "word",
    label: "Word card",
    sideTitle: "Start with one word.",
    sideBody:
      "Each session begins with a focused word card that is quick to read and easy to understand.",
    ariaLabel: "a word card for Eloquent and its definition",
  },
  {
    id: "question",
    label: "Quick question",
    sideTitle: "Answer a quick question.",
    sideBody:
      "Short questions reinforce meaning without turning practice into a long study session.",
    ariaLabel: "a multiple-choice question about the meaning of Eloquent",
  },
  {
    id: "feedback",
    label: "Instant feedback",
    sideTitle: "Learn from feedback immediately.",
    sideBody:
      "Students see what they got right, what they missed, and why the answer makes sense.",
    ariaLabel: "instant feedback explaining the correct answer for Eloquent",
  },
  {
    id: "review",
    label: "Review queue",
    sideTitle: "Review the words that need attention.",
    sideBody:
      "Vocabcat keeps weak words in rotation so practice becomes targeted instead of random.",
    ariaLabel: "a review queue showing words ready for review",
  },
  {
    id: "reminders",
    label: "Reminders",
    sideTitle: "Stay consistent with reminders.",
    sideBody:
      "Email and text reminders help students keep the habit going, even on busy days.",
    ariaLabel: "email and text reminder notifications for a vocab review",
  },
  {
    id: "summary",
    label: "Progress summary",
    sideTitle: "See progress over time.",
    sideBody:
      "Simple summaries show what was practiced, what improved, and what still needs review.",
    ariaLabel: "a weekly summary with reviewed words, improvements, and a streak",
  },
];

export const problemSection = {
  headline: "Vocabulary practice is easy to delay.",
  body:
    "Flashcards, long lists, and test prep books require time and discipline. Most students know vocabulary matters, but consistency is hard to maintain.",
  cards: [
    {
      title: "Practice feels too long",
      body: "Traditional study formats ask for more time and focus than most students can give every day.",
    },
    {
      title: "Review is easy to forget",
      body: "Without a simple return path, missed words slip away between school, homework, and everything else.",
    },
    {
      title: "Progress is hard to see",
      body: "If improvement stays hidden, the habit feels abstract instead of rewarding.",
    },
  ],
};

export const solutionSection = {
  headline: "Built for short, consistent practice.",
  body:
    "Vocabcat breaks vocabulary learning into small, repeatable sessions that fit into a normal day.",
  features: [
    {
      title: "Scroll-based sessions",
      description:
        "Move through words and questions quickly without feeling stuck in a long lesson.",
    },
    {
      title: "Personalized review",
      description:
        "Missed words come back automatically so students spend more time on what they need.",
    },
    {
      title: "Smart reminders",
      description: "Email and text reminders make practice easier to remember.",
    },
    {
      title: "Learning summaries",
      description:
        "Weekly summaries show reviewed words, improvement, streaks, and areas for review.",
    },
    {
      title: "AI-generated practice",
      description:
        "Questions can adapt around vocabulary meaning, usage, and review needs.",
    },
  ],
};

export const habitSection = {
  headline: "Designed around consistency.",
  body:
    "A strong vocabulary is built through repeated exposure. Vocabcat makes that repetition easier by turning practice into a small daily action instead of a large study task.",
  pillars: [
    {
      title: "Start quickly",
      description:
        "Begin with one focused word card instead of preparing for a long study block.",
    },
    {
      title: "Practice briefly",
      description:
        "Short questions and targeted review keep each session manageable and clear.",
    },
    {
      title: "Return daily",
      description:
        "Reminders and summaries make it easier to keep practice active over time.",
    },
  ],
};

export const reminderSection = {
  headline: "Reminders that keep learning active.",
  body:
    "Vocabcat sends email and text reminders so practice does not get skipped. It also provides summaries showing what was learned and what needs review.",
  cards: [
    {
      app: "Mail",
      channel: "Gmail",
      time: "now",
      subject: "Today’s vocab review is ready",
      body: "You have 5 words waiting for practice.",
    },
    {
      app: "Messages",
      channel: "Text Message",
      time: "2m ago",
      subject: "5 words are waiting today",
      body: "Your daily vocab session is ready. Keep your streak going.",
    },
    {
      app: "Mail",
      channel: "Weekly Summary",
      time: "Mon",
      subject: "This week",
      body: "18 words reviewed, 7 improved, 3 still need attention.",
    },
  ],
};

export const audienceSection = {
  headline: "Useful for students. Clear for parents.",
  students: [
    "Quick sessions that fit into busy schedules",
    "Less pressure than long study blocks",
    "Clear feedback after each question",
    "Progress that is easy to track",
  ],
  parents: [
    "Reminders help reduce missed practice",
    "Summaries show visible progress",
    "Review is structured and consistent",
    "Practice feels manageable at home",
  ],
};

export const ctaSection = {
  headline: "Make vocabulary practice a daily habit.",
  subheadline: "Short sessions. Clear progress. Consistent review.",
  primaryCta: "Get Started",
  secondaryCta: "View Demo",
};
