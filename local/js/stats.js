/* ============================================
   PromptKeyMind — Stats & Progress
   localStorage persistence, per-key accuracy,
   daily streaks, session history.
   ============================================ */

import { TRACKED_KEYS } from './data.js';

const STORAGE_KEY = 'promptkeymind_stats';

function today() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function createDefault() {
  return {
    // Per-key accuracy: { key: { correct, total } }
    keyAccuracy: {},
    // Session history: [{ date, stage, wpm, accuracy, elapsed }]
    sessions: [],
    // Daily tracking
    dailyMinutes: {}, // { "2026-03-04": 5.2 }
    streak: 0,
    lastActiveDate: null,
    // Daily goal in minutes
    goalMinutes: 10,
  };
}

export class StatsManager {
  constructor() {
    this.data = loadData() || createDefault();
    this._updateStreak();
  }

  /**
   * Record a completed exercise session.
   */
  recordSession(stageId, results) {
    // Update per-key accuracy
    for (const [key, stats] of Object.entries(results.keyStats)) {
      if (!this.data.keyAccuracy[key]) {
        this.data.keyAccuracy[key] = { correct: 0, total: 0 };
      }
      this.data.keyAccuracy[key].correct += stats.correct;
      this.data.keyAccuracy[key].total += stats.total;
    }

    // Add session record
    this.data.sessions.push({
      date: today(),
      stage: stageId,
      wpm: results.wpm,
      accuracy: results.accuracy,
      elapsed: results.elapsed,
    });

    // Keep last 30 days of sessions
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    const cutoffStr = cutoff.toISOString().slice(0, 10);
    this.data.sessions = this.data.sessions.filter(s => s.date >= cutoffStr);

    // Update daily minutes
    const d = today();
    const minutes = (results.elapsed || 0) / 60000;
    this.data.dailyMinutes[d] = (this.data.dailyMinutes[d] || 0) + minutes;

    // Update streak
    this.data.lastActiveDate = d;
    this._updateStreak();

    saveData(this.data);
  }

  /**
   * Get per-key accuracy for the key progress bar.
   * Returns array of { key, accuracy, status }
   */
  getKeyProgress() {
    return TRACKED_KEYS.map(key => {
      const stats = this.data.keyAccuracy[key];
      if (!stats || stats.total === 0) {
        return { key, accuracy: 0, status: 'untested' };
      }
      const acc = Math.round((stats.correct / stats.total) * 100);
      let status = 'learning';
      if (acc >= 95 && stats.total >= 10) status = 'mastered';
      else if (acc >= 80) status = 'learning';
      else status = 'struggling';
      return { key, accuracy: acc, status };
    });
  }

  /**
   * Get today's practice minutes.
   */
  getTodayMinutes() {
    return this.data.dailyMinutes[today()] || 0;
  }

  /**
   * Get daily goal progress (0-100).
   */
  getGoalProgress() {
    const minutes = this.getTodayMinutes();
    return Math.min(100, Math.round((minutes / this.data.goalMinutes) * 100));
  }

  /**
   * Get current streak count.
   */
  getStreak() {
    return this.data.streak;
  }

  /**
   * Get recent session averages.
   */
  getRecentAvg() {
    const todaySessions = this.data.sessions.filter(s => s.date === today());
    if (todaySessions.length === 0) return { wpm: 0, accuracy: 100 };
    const avgWpm = Math.round(todaySessions.reduce((s, x) => s + x.wpm, 0) / todaySessions.length);
    const avgAcc = Math.round(todaySessions.reduce((s, x) => s + x.accuracy, 0) / todaySessions.length);
    return { wpm: avgWpm, accuracy: avgAcc };
  }

  _updateStreak() {
    const d = today();
    const last = this.data.lastActiveDate;

    if (!last) {
      this.data.streak = 0;
      return;
    }

    if (last === d) {
      // Already active today — streak unchanged or starts at 1
      if (this.data.streak === 0) this.data.streak = 1;
      return;
    }

    // Check if yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    if (last === yesterdayStr) {
      this.data.streak++;
    } else {
      // Gap — reset streak
      this.data.streak = 0;
    }
  }

  /**
   * Clear all stats (for testing/reset).
   */
  reset() {
    this.data = createDefault();
    saveData(this.data);
  }
}
