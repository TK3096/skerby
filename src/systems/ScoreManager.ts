const STORAGE_KEY = "skerby_scores";

export interface ScoreEntry {
  name: string;
  score: number;
}

export class ScoreManager {
  private storage: Storage;

  constructor(storage: Storage = localStorage) {
    this.storage = storage;
  }

  recordScore(name: string, score: number) {
    const scores = this.getAllScores();
    scores.push({ name, score });
    this.storage.setItem(STORAGE_KEY, JSON.stringify(scores));
  }

  getTopScores(limit = 5): ScoreEntry[] {
    const scores = this.getAllScores();
    scores.sort((a, b) => b.score - a.score);
    return scores.slice(0, limit);
  }

  private getAllScores(): ScoreEntry[] {
    const raw = this.storage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }
}
