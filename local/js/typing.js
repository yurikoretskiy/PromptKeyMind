/* ============================================
   PromptKeyMind — Typing Engine
   Handles character matching, cursor, WPM,
   accuracy, and per-key stats.
   ============================================ */

export class TypingEngine {
  constructor() {
    this.text = '';
    this.chars = [];
    this.currentIndex = 0;
    this.correctCount = 0;
    this.errorCount = 0;
    this.startTime = null;
    this.isActive = false;
    this.keyStats = {}; // { key: { correct: n, total: n } }
    this.onUpdate = null; // callback(state)
    this.onComplete = null; // callback(results)
    this.onKeyHighlight = null; // callback(key)
  }

  /**
   * Load text for typing practice.
   * @param {string} text - The text to type
   * @param {HTMLElement} container - The typing-text element
   */
  load(text, container) {
    this.text = text;
    this.chars = [];
    this.currentIndex = 0;
    this.correctCount = 0;
    this.errorCount = 0;
    this.startTime = null;
    this.isActive = false;

    // Build character spans grouped by word to prevent mid-word line breaks
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    const words = text.split(' ');
    let charIndex = 0;
    words.forEach((word, wi) => {
      // Wrap each word's chars in a span to prevent line-break within a word
      const wordEl = document.createElement('span');
      wordEl.className = 'word';
      for (let i = 0; i < word.length; i++) {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = word[i];
        if (charIndex === 0) span.classList.add('current');
        wordEl.appendChild(span);
        this.chars.push(span);
        charIndex++;
      }
      container.appendChild(wordEl);
      // Add space character between words (regular space, not nbsp, so lines can break here)
      if (wi < words.length - 1) {
        const spaceSpan = document.createElement('span');
        spaceSpan.className = 'char char-space';
        spaceSpan.textContent = ' ';
        container.appendChild(spaceSpan);
        this.chars.push(spaceSpan);
        charIndex++;
      }
    });

    // Highlight first key
    if (this.onKeyHighlight && text.length > 0) {
      this.onKeyHighlight(text[0]);
    }

    this._emitUpdate();
  }

  /**
   * Handle a keypress event.
   * @param {string} key - The character typed
   * @returns {boolean} Whether input was accepted
   */
  handleKey(key) {
    if (this.currentIndex >= this.text.length) return false;

    // Start timer on first keypress
    if (!this.startTime) {
      this.startTime = Date.now();
      this.isActive = true;
    }

    const expected = this.text[this.currentIndex];
    const charEl = this.chars[this.currentIndex];
    const expectedLower = expected.toLowerCase();

    // Track per-key stats
    if (!this.keyStats[expectedLower]) {
      this.keyStats[expectedLower] = { correct: 0, total: 0 };
    }
    this.keyStats[expectedLower].total++;

    if (key === expected) {
      charEl.classList.remove('current');
      charEl.classList.add('correct');
      this.correctCount++;
      this.keyStats[expectedLower].correct++;
    } else {
      charEl.classList.remove('current');
      charEl.classList.add('incorrect');
      this.errorCount++;
    }

    this.currentIndex++;

    // Set next character as current
    if (this.currentIndex < this.text.length) {
      this.chars[this.currentIndex].classList.add('current');
      if (this.onKeyHighlight) {
        this.onKeyHighlight(this.text[this.currentIndex]);
      }
    }

    this._emitUpdate();

    // Check completion
    if (this.currentIndex >= this.text.length) {
      this.isActive = false;
      if (this.onComplete) {
        this.onComplete(this.getResults());
      }
    }

    return true;
  }

  /**
   * Handle backspace — undo last character.
   */
  handleBackspace() {
    if (this.currentIndex <= 0) return;

    // Remove current marker
    if (this.currentIndex < this.text.length) {
      this.chars[this.currentIndex].classList.remove('current');
    }

    this.currentIndex--;
    const charEl = this.chars[this.currentIndex];
    const wasCorrect = charEl.classList.contains('correct');

    charEl.classList.remove('correct', 'incorrect');
    charEl.classList.add('current');

    if (wasCorrect) {
      this.correctCount--;
    } else {
      this.errorCount--;
    }

    // Undo per-key stat
    const key = this.text[this.currentIndex].toLowerCase();
    if (this.keyStats[key]) {
      this.keyStats[key].total--;
      if (wasCorrect) this.keyStats[key].correct--;
    }

    if (this.onKeyHighlight) {
      this.onKeyHighlight(this.text[this.currentIndex]);
    }

    this._emitUpdate();
  }

  /**
   * Calculate current WPM.
   */
  getWPM() {
    if (!this.startTime || this.correctCount === 0) return 0;
    const minutes = (Date.now() - this.startTime) / 60000;
    if (minutes < 0.01) return 0;
    // Standard: 5 characters = 1 word
    return Math.round((this.correctCount / 5) / minutes);
  }

  /**
   * Calculate current accuracy percentage.
   */
  getAccuracy() {
    const total = this.correctCount + this.errorCount;
    if (total === 0) return 100;
    return Math.round((this.correctCount / total) * 100);
  }

  /**
   * Calculate progress percentage.
   */
  getProgress() {
    if (this.text.length === 0) return 0;
    return Math.round((this.currentIndex / this.text.length) * 100);
  }

  /**
   * Get full results object.
   */
  getResults() {
    return {
      wpm: this.getWPM(),
      accuracy: this.getAccuracy(),
      progress: this.getProgress(),
      correct: this.correctCount,
      errors: this.errorCount,
      total: this.text.length,
      keyStats: { ...this.keyStats },
      elapsed: this.startTime ? Date.now() - this.startTime : 0,
    };
  }

  _emitUpdate() {
    if (this.onUpdate) {
      this.onUpdate({
        wpm: this.getWPM(),
        accuracy: this.getAccuracy(),
        progress: this.getProgress(),
        currentIndex: this.currentIndex,
        total: this.text.length,
      });
    }
  }
}
