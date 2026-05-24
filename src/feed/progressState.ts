import type { FeedCard } from "../api/types";

export function applyCardProgressUpdate(
  cards: FeedCard[],
  cardId: string,
  nextProgress?: FeedCard["progress"],
) {
  if (!nextProgress) {
    return cards;
  }

  return cards.map((card) =>
    card.card_id === cardId ? { ...card, progress: nextProgress } : card,
  );
}
