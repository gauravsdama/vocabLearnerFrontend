export const FALLBACK_TIMEZONE = "UTC";
export const DEFAULT_WORDS_PER_WEEK = 20;
export const DEFAULT_TEXTS_PER_WEEK = 3;
export const MIN_WORDS_PER_WEEK = 5;
export const MAX_WORDS_PER_WEEK = 210;
export const MIN_TEXTS_PER_WEEK = 0;
export const MAX_TEXTS_PER_WEEK = 14;

export function deriveDailyGoal(weekly: number) {
  if (!Number.isFinite(weekly) || weekly <= 0) {
    return 1;
  }
  return Math.max(1, Math.ceil(weekly / 7));
}

export function clampInteger(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Math.trunc(value)));
}
