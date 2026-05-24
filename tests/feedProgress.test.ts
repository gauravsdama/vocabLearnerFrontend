import * as assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { FeedCard } from "../src/api/types.js";
import { applyCardProgressUpdate } from "../src/feed/progressState.js";

describe("feed progress state", () => {
  it("updates only the matching card progress", () => {
    const cards: FeedCard[] = [
      {
        card_id: "card-1",
        card_type: "WORD",
        position_index: 0,
        word: {
          word_id: 1,
          word: "alpha",
          examples: [],
        },
        progress: {
          status: "new",
          seen_count: 0,
          quiz_attempt_count: 0,
          quiz_correct_count: 0,
          correct_streak_spaced: 0,
          next_due_at: null,
        },
      },
      {
        card_id: "card-2",
        card_type: "WORD",
        position_index: 1,
        word: {
          word_id: 2,
          word: "beta",
          examples: [],
        },
        progress: {
          status: "learning",
          seen_count: 2,
          quiz_attempt_count: 1,
          quiz_correct_count: 1,
          correct_streak_spaced: 1,
          next_due_at: null,
        },
      },
    ];

    const updated = applyCardProgressUpdate(
      [...cards],
      "card-2",
      {
        status: "mastered",
        seen_count: 5,
        quiz_attempt_count: 3,
        quiz_correct_count: 3,
        correct_streak_spaced: 3,
        next_due_at: null,
      },
    );

    assert.equal(updated[0]?.progress?.status, "new");
    assert.equal(updated[1]?.progress?.status, "mastered");
    assert.equal(updated[1]?.progress?.seen_count, 5);
  });
});
