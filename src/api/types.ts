export type ApiErrorShape = {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
    request_id?: string;
    retry_after_seconds?: number;
    retryAfterSeconds?: number;
  };
};

export type ApiError = {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  requestId?: string;
  clientRequestId?: string;
  retryAfterSeconds?: number;
  status: number;
};

export type AuthRequest = {
  email: string;
  password: string;
};

export type User = {
  id: string;
  email: string;
  email_verified?: boolean | null;
  timezone?: string | null;
  daily_new_words_goal?: number | null;
  feed_prefs?: FeedPrefs | null;
  words_per_week?: number | null;
  texts_per_week?: number | null;
  sms_opt_in?: boolean;
  phone_e164?: string | null;
  features?: UserFeatures | null;
};

export type UserFeatures = {
  smsEnabled?: boolean;
  sms_enabled?: boolean;
  [key: string]: unknown;
};

export type AuthResponse = {
  access_token: string;
  token_type: string;
  user: User;
};

export type FeedPrefs = {
  mode?: string;
  [key: string]: unknown;
};

export type FeedCardType = "WORD" | "QUIZ_MCQ" | "WRITE_SENTENCE";

export type Progress = {
  status: string;
  seen_count: number;
  quiz_attempt_count: number;
  quiz_correct_count: number;
  correct_streak_spaced: number;
  next_due_at: string | null;
};

export type WordInfo = {
  word_id: number;
  word: string;
  part_of_speech?: string | null;
  definition?: string | null;
  examples: string[];
};

export type QuizInfo = {
  question_id: string | number;
  question_type: string;
  prompt: string;
  choices: string[];
  explanation?: string | null;
};

export type WriteSentenceInfo = {
  prompt?: string | null;
};

export type FeedCardBase = {
  card_id: string;
  card_type: FeedCardType;
  position_index: number;
  word: WordInfo;
  quiz?: QuizInfo | null;
  write_sentence?: WriteSentenceInfo | null;
  progress: Progress;
};

export type WordCard = FeedCardBase & {
  card_type: "WORD";
};

export type QuizCard = FeedCardBase & {
  card_type: "QUIZ_MCQ";
  quiz: QuizInfo;
};

export type WriteSentenceCard = FeedCardBase & {
  card_type: "WRITE_SENTENCE";
  write_sentence: WriteSentenceInfo;
};

export type FeedCard = WordCard | QuizCard | WriteSentenceCard;

export type FeedSessionResponse = {
  feed_session_id: string;
  cards: FeedCard[];
  messages?: MessageDTO[];
};

export type FeedNextResponse = {
  feed_session_id: string;
  cards: FeedCard[];
  messages?: MessageDTO[];
};

export type MarkViewedRequest = {
  feed_session_id: string;
  feed_card_id: string;
};

export type MarkSkippedRequest = {
  feed_session_id: string;
  feed_card_id: string;
};

export type FeedEndRequest = {
  feed_session_id: string;
};

export type QuizSubmitRequest = {
  feed_card_id: string;
  question_id: string | number;
  chosen_index: number;
};

export type QuizSubmitResponse = {
  correct: boolean;
  explanation?: string | null;
  updated_progress?: Progress;
};

export type SentenceSubmitRequest = {
  feed_card_id: string;
  word_id: number;
  sentence_text: string;
};

export type SentenceSubmitResponse = {
  is_valid: boolean;
  score?: number | null;
  feedback: string;
  updated_progress?: Progress;
};

export type UserProfileResponse = User;

export type UserProfileUpdate = {
  timezone?: string | null;
  daily_new_words_goal?: number | null;
  feed_prefs?: FeedPrefs | null;
  words_per_week?: number | null;
  texts_per_week?: number | null;
};

export type SmsOptInRequest = {
  phone_e164: string;
};

export type TutorialStatusResponse = {
  tutorial_completed: boolean;
};

export type TutorialCompleteRequest = {
  words_per_week: number;
  texts_per_week: number;
  timezone?: string | null;
};

export type StatsSummary = {
  mastered_count: number;
  learning_count: number;
  due_count: number;
  accuracy: number;
  streak?: {
    current_days: number;
    longest_days: number;
    [key: string]: number | string | null | undefined;
  };
  recent_activity?: Record<
    string,
    string | number | boolean | null | Record<string, unknown>
  >;
  messages?: MessageDTO[];
};

export type MessageDTO = {
  id: string;
  title?: string | null;
  body?: string | null;
  level?: "info" | "success" | "warning" | "error";
  created_at?: string | null;
  dismissible?: boolean;
  action_label?: string | null;
  action_url?: string | null;
  [key: string]: unknown;
};

export type MessagesResponse = {
  messages?: MessageDTO[];
};

export type StatsWord = {
  word_id: number;
  word: string;
  primary_definition?: string | null;
  examples?: string[];
  status?: string | null;
  mastery_score?: number | null;
  mastery_rating?: number | null;
  learned_rating?: number | null;
  accuracy?: number | null;
  seen_count?: number | null;
  viewed_count?: number | null;
  quiz_attempt_count?: number | null;
  quiz_correct_count?: number | null;
  correct_streak_spaced?: number | null;
  last_seen_at?: string | null;
  last_viewed_at?: string | null;
  next_due_at?: string | null;
  recommended_question_id?: string | null;
  is_assigned?: boolean | null;
  correct_count?: number | null;
  incorrect_count?: number | null;
  streak?: number | null;
  history?: Array<Record<string, unknown>>;
};

export type StatsWordsResponse = {
  items?: StatsWord[];
  next_cursor?: string | null;
  next_offset?: number | null;
};

export type StudyProgressListResponse = {
  items: StatsWord[];
  page: number;
  page_size: number;
  total: number;
};

export type StudyProgressUpdateRequest = {
  learned_rating?: number;
  mastery_rating?: number;
  learned_delta?: number;
  mastery_delta?: number;
};

export type StudyProgressUpdateResponse = {
  word_id: number;
  progress: {
    status?: string | null;
    seen_count?: number | null;
    viewed_count?: number | null;
    quiz_attempt_count?: number | null;
    quiz_correct_count?: number | null;
    correct_streak_spaced?: number | null;
    learned_rating?: number | null;
    mastery_rating?: number | null;
    last_viewed_at?: string | null;
    next_due_at?: string | null;
  };
};

export type StudyProgressQuizAttempt = {
  attempt_id: string | number;
  question_id: string | number;
  created_at: string;
  correct: boolean;
  chosen_index: number;
  correct_index: number;
  prompt: string;
  choices: string[];
  question_type: string;
  explanation?: string | null;
};

export type StudyProgressQuizAttemptsResponse = {
  word_id: number;
  page: number;
  page_size: number;
  total: number;
  attempts: StudyProgressQuizAttempt[];
};

export type MeResponse = {
  user: User;
  features?: UserFeatures | null;
  messages?: MessageDTO[];
};

export type ResendEmailVerificationResponse = {
  message?: string;
};
