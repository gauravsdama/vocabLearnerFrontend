import type { FeedCard, Progress, QuizCard, QuizSubmitResponse } from "../api/types";

type DemoWord = {
  slug: string;
  word: string;
  partOfSpeech: string;
  definition: string;
  examples: string[];
  prompt: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
};

const demoWords: DemoWord[] = [
  {
    slug: "lucid",
    word: "Lucid",
    partOfSpeech: "adj.",
    definition: "Clear and easy to understand.",
    examples: [
      "Her lucid explanation made the science project feel manageable.",
      "The article gave a lucid overview of how solar panels work.",
      "Even under pressure, he gave a lucid answer.",
    ],
    prompt: "Which sentence uses lucid correctly?",
    choices: [
      "The lucid instructions helped everyone begin quickly.",
      "The lucid backpack was too heavy to lift.",
      "She watered the lucid before dinner.",
      "The team postponed the lucid until Friday.",
    ],
    correctIndex: 0,
    explanation: "Lucid describes something clear and easy to understand.",
  },
  {
    slug: "resilient",
    word: "Resilient",
    partOfSpeech: "adj.",
    definition: "Able to recover quickly after difficulty.",
    examples: [
      "The resilient team kept improving after each loss.",
      "A resilient plant can survive a week without rain.",
      "She stayed resilient during a stressful month.",
    ],
    prompt: "What does resilient most nearly mean?",
    choices: ["Quick to recover", "Hard to notice", "Full of noise", "Likely to vanish"],
    correctIndex: 0,
    explanation: "A resilient person or thing can bounce back after stress or trouble.",
  },
  {
    slug: "pragmatic",
    word: "Pragmatic",
    partOfSpeech: "adj.",
    definition: "Focused on practical results rather than abstract ideas.",
    examples: [
      "They chose a pragmatic plan that could be finished by Monday.",
      "Her pragmatic advice helped us fix the problem fast.",
      "A pragmatic leader asks what will actually work.",
    ],
    prompt: "A pragmatic choice is usually...",
    choices: ["Practical", "Careless", "Imaginary", "Decorative"],
    correctIndex: 0,
    explanation: "Pragmatic means practical and concerned with what works.",
  },
  {
    slug: "meticulous",
    word: "Meticulous",
    partOfSpeech: "adj.",
    definition: "Showing great attention to detail.",
    examples: [
      "The meticulous editor noticed every typo.",
      "He kept meticulous notes during the experiment.",
      "A meticulous checklist helped the event run smoothly.",
    ],
    prompt: "Which action is meticulous?",
    choices: [
      "Checking each measurement twice",
      "Guessing without reading",
      "Leaving tools scattered",
      "Skipping the final step",
    ],
    correctIndex: 0,
    explanation: "Meticulous work is careful, precise, and detail-focused.",
  },
  {
    slug: "ephemeral",
    word: "Ephemeral",
    partOfSpeech: "adj.",
    definition: "Lasting for a very short time.",
    examples: [
      "The rainbow was ephemeral, fading after a few minutes.",
      "Some online trends are ephemeral.",
      "The flower's beauty felt ephemeral after the storm arrived.",
    ],
    prompt: "What is the best synonym for ephemeral?",
    choices: ["Brief", "Ancient", "Heavy", "Certain"],
    correctIndex: 0,
    explanation: "Ephemeral things do not last long.",
  },
  {
    slug: "candid",
    word: "Candid",
    partOfSpeech: "adj.",
    definition: "Truthful and direct, especially about something difficult.",
    examples: [
      "His candid feedback helped the group improve.",
      "The interview was candid but respectful.",
      "She gave a candid answer instead of avoiding the topic.",
    ],
    prompt: "A candid response is...",
    choices: ["Honest and direct", "Secret and hidden", "Late and unfinished", "Loud and musical"],
    correctIndex: 0,
    explanation: "Candid means open, honest, and straightforward.",
  },
  {
    slug: "tenacious",
    word: "Tenacious",
    partOfSpeech: "adj.",
    definition: "Very determined and unwilling to give up.",
    examples: [
      "The tenacious runner finished despite the rain.",
      "Her tenacious studying paid off on the exam.",
      "A tenacious reporter kept asking useful questions.",
    ],
    prompt: "Which person is tenacious?",
    choices: [
      "Someone who keeps trying after setbacks",
      "Someone who forgets the goal",
      "Someone who avoids every challenge",
      "Someone who arrives without a plan",
    ],
    correctIndex: 0,
    explanation: "Tenacious describes determined persistence.",
  },
  {
    slug: "nuance",
    word: "Nuance",
    partOfSpeech: "n.",
    definition: "A subtle difference in meaning, feeling, or expression.",
    examples: [
      "The poem's nuance became clearer after a second reading.",
      "A good debate leaves room for nuance.",
      "The actor captured every nuance of the character's mood.",
    ],
    prompt: "Nuance most often refers to a...",
    choices: ["Subtle difference", "Large explosion", "Simple machine", "Strict deadline"],
    correctIndex: 0,
    explanation: "A nuance is a fine or subtle distinction.",
  },
  {
    slug: "ambivalent",
    word: "Ambivalent",
    partOfSpeech: "adj.",
    definition: "Having mixed or conflicting feelings about something.",
    examples: [
      "He felt ambivalent about moving to a new city.",
      "The class was ambivalent about changing the project topic.",
      "She was ambivalent: excited for the trip but nervous about flying.",
    ],
    prompt: "If Maya is ambivalent about joining the club, she feels...",
    choices: ["Both interested and unsure", "Completely certain", "Too tired to speak", "Unable to remember it"],
    correctIndex: 0,
    explanation: "Ambivalent means having mixed feelings.",
  },
  {
    slug: "eloquent",
    word: "Eloquent",
    partOfSpeech: "adj.",
    definition: "Fluent, expressive, and persuasive in speaking or writing.",
    examples: [
      "The student's eloquent speech persuaded the audience.",
      "Her essay was eloquent without being complicated.",
      "An eloquent thank-you note can feel personal and sincere.",
    ],
    prompt: "An eloquent speaker is usually...",
    choices: ["Expressive and persuasive", "Silent and confused", "Careless and rushed", "Hidden and invisible"],
    correctIndex: 0,
    explanation: "Eloquent language is clear, expressive, and persuasive.",
  },
];

const baseProgress: Progress = {
  status: "new",
  seen_count: 0,
  quiz_attempt_count: 0,
  quiz_correct_count: 0,
  correct_streak_spaced: 0,
  next_due_at: null,
};

export function createDemoCards(): FeedCard[] {
  return demoWords.flatMap((item, index) => {
    const wordId = index + 1;
    const quiz = {
      question_id: `demo-${item.slug}-quiz`,
      question_type: "multiple_choice",
      prompt: item.prompt,
      choices: item.choices,
      explanation: item.explanation,
    };
    const word = {
      word_id: wordId,
      word: item.word,
      part_of_speech: item.partOfSpeech,
      definition: item.definition,
      examples: item.examples,
    };
    const wordCard: FeedCard = {
      card_id: `demo-${item.slug}-word`,
      card_type: "WORD",
      position_index: index * 2,
      word,
      quiz,
      progress: { ...baseProgress },
    };
    const quizCard: FeedCard = {
      card_id: `demo-${item.slug}-quiz`,
      card_type: "QUIZ_MCQ",
      position_index: index * 2 + 1,
      word,
      quiz,
      progress: { ...baseProgress },
    };
    return [wordCard, quizCard];
  });
}

export function submitDemoQuiz(
  card: QuizCard,
  selectedIndex: number,
): QuizSubmitResponse {
  const demoWord = demoWords.find(
    (item) => `demo-${item.slug}-quiz` === String(card.quiz.question_id),
  );
  const correct = selectedIndex === demoWord?.correctIndex;
  return {
    correct,
    explanation: demoWord?.explanation ?? card.quiz.explanation ?? null,
    updated_progress: {
      ...card.progress,
      status: correct ? "learning" : card.progress.status,
      seen_count: Math.max(card.progress.seen_count, 1),
      quiz_attempt_count: card.progress.quiz_attempt_count + 1,
      quiz_correct_count: card.progress.quiz_correct_count + (correct ? 1 : 0),
      correct_streak_spaced: correct ? card.progress.correct_streak_spaced + 1 : 0,
    },
  };
}
