import * as assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  clampInteger,
  deriveDailyGoal,
} from "../src/utils/learningTargets.js";

describe("learningTargets", () => {
  it("clamps integer values into the backend-supported range", () => {
    assert.equal(clampInteger(3.9, 5, 100), 5);
    assert.equal(clampInteger(24.7, 5, 100), 24);
    assert.equal(clampInteger(140, 5, 100), 100);
  });

  it("derives at least one daily word from a weekly goal", () => {
    assert.equal(deriveDailyGoal(0), 1);
    assert.equal(deriveDailyGoal(1), 1);
    assert.equal(deriveDailyGoal(20), 3);
  });
});
