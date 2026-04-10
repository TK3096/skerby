import { describe, it, expect, beforeEach, vi } from "vitest";
import { ScoreManager } from "../src/systems/ScoreManager";

describe("ScoreManager", () => {
  let store: Record<string, string>;
  let manager: ScoreManager;

  beforeEach(() => {
    store = {};
    const mockStorage = {
      getItem: vi.fn((key: string) => store[key] ?? null),
      setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    } as unknown as Storage;
    manager = new ScoreManager(mockStorage);
  });

  it("returns empty array when no scores exist", () => {
    expect(manager.getTopScores()).toEqual([]);
  });

  it("records a score", () => {
    manager.recordScore("Alice", 100);
    const scores = manager.getTopScores();
    expect(scores).toHaveLength(1);
    expect(scores[0]).toEqual({ name: "Alice", score: 100 });
  });

  it("sorts scores descending", () => {
    manager.recordScore("Alice", 50);
    manager.recordScore("Bob", 200);
    manager.recordScore("Charlie", 100);
    const scores = manager.getTopScores();
    expect(scores[0].name).toBe("Bob");
    expect(scores[1].name).toBe("Charlie");
    expect(scores[2].name).toBe("Alice");
  });

  it("returns only top 5", () => {
    for (let i = 0; i < 7; i++) {
      manager.recordScore(`Player${i}`, i * 10);
    }
    const scores = manager.getTopScores();
    expect(scores).toHaveLength(5);
    expect(scores[0].score).toBe(60);
    expect(scores[4].score).toBe(20);
  });

  it("keeps multiple scores from the same player", () => {
    manager.recordScore("Alice", 100);
    manager.recordScore("Alice", 200);
    const scores = manager.getTopScores();
    expect(scores).toHaveLength(2);
  });

  it("persists scores across instances", () => {
    manager.recordScore("Alice", 100);

    const mockStorage2 = {
      getItem: vi.fn((key: string) => store[key] ?? null),
      setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    } as unknown as Storage;
    const manager2 = new ScoreManager(mockStorage2);
    const scores = manager2.getTopScores();
    expect(scores).toHaveLength(1);
    expect(scores[0].name).toBe("Alice");
  });
});
