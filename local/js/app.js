/* ============================================
   PromptKeyMind — Main App Controller
   Wires together typing engine, keyboard,
   stages, stats, timer, and UI.
   ============================================ */

import { TypingEngine } from './typing.js';
import { VirtualKeyboard } from './keyboard.js';
import { STAGES, getStage, generateExercise } from './stages.js';
import { StatsManager } from './stats.js';

class App {
  constructor() {
    // Core modules
    this.typing = new TypingEngine();
    this.keyboard = new VirtualKeyboard('keyboard-container');
    this.stats = new StatsManager();

    // State
    this.currentStage = 1;
    this.timerInterval = null;
    this.timeRemaining = 120; // seconds
    this.sessionActive = false;

    // DOM elements
    this.el = {
      typingText: document.getElementById('typing-text'),
      typingInput: document.getElementById('typing-input'),
      typingArea: document.getElementById('typing-area'),
      stageName: document.getElementById('stage-name'),
      stageHint: document.getElementById('stage-hint'),
      timer: document.getElementById('timer'),
      statWpm: document.getElementById('stat-wpm'),
      statAccuracy: document.getElementById('stat-accuracy'),
      statProgress: document.getElementById('stat-progress'),
      statStreak: document.getElementById('stat-streak'),
      keyProgress: document.getElementById('key-progress'),
      goalFill: document.getElementById('goal-fill'),
      goalText: document.getElementById('goal-text'),
      btnReset: document.getElementById('btn-reset'),
      btnNext: document.getElementById('btn-next'),
      themeToggle: document.getElementById('theme-toggle'),
      keyboardToggle: document.getElementById('keyboard-toggle'),
      stageTabs: document.querySelectorAll('.stage-tab'),
    };

    this._setupCallbacks();
    this._setupEventListeners();
    this._loadTheme();
    this._loadKeyboardPref();
    this._updateKeyProgress();
    this._updateDailyGoal();
    this._updateStreak();
    this._loadStage(this.currentStage);
  }

  // --- Setup ---

  _setupCallbacks() {
    this.typing.onUpdate = (state) => {
      this.el.statWpm.textContent = state.wpm;
      this.el.statAccuracy.textContent = state.accuracy + '%';
      this.el.statProgress.textContent = state.progress + '%';
    };

    this.typing.onComplete = (results) => {
      this._onExerciseComplete(results);
    };

    this.typing.onKeyHighlight = (key) => {
      this.keyboard.highlight(key);
    };
  }

  _setupEventListeners() {
    // Typing input
    this.el.typingArea.addEventListener('click', () => {
      this.el.typingInput.focus();
    });

    this.el.typingInput.addEventListener('keydown', (e) => {
      // Prevent default for special keys we handle
      if (e.key === 'Backspace') {
        e.preventDefault();
        this.typing.handleBackspace();
        return;
      }

      // Ignore modifier-only keys and shortcuts
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === 'Tab' || e.key === 'Escape') {
        if (e.key === 'Escape') {
          e.preventDefault();
          this._resetExercise();
        }
        return;
      }

      // Only handle printable characters
      if (e.key.length === 1) {
        e.preventDefault();
        if (!this.sessionActive) {
          this._startTimer();
          this.sessionActive = true;
        }
        this.typing.handleKey(e.key);
      }
    });

    // Keyboard shortcuts (global)
    document.addEventListener('keydown', (e) => {
      // T = toggle theme (only when not focused on input)
      if (e.key === 't' && document.activeElement !== this.el.typingInput) {
        this._toggleTheme();
        return;
      }
      // K = toggle keyboard (only when not focused on input)
      if (e.key === 'k' && document.activeElement !== this.el.typingInput) {
        this._toggleKeyboard();
        return;
      }
      // Right arrow = next stage (only when not focused on input)
      if (e.key === 'ArrowRight' && document.activeElement !== this.el.typingInput) {
        this._nextStage();
        return;
      }
      // Left arrow = prev stage
      if (e.key === 'ArrowLeft' && document.activeElement !== this.el.typingInput) {
        this._prevStage();
        return;
      }
    });

    // Stage tabs
    this.el.stageTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const stage = parseInt(tab.getAttribute('data-stage'));
        this._switchStage(stage);
      });
    });

    // Buttons
    this.el.btnReset.addEventListener('click', () => this._resetExercise());
    this.el.btnNext.addEventListener('click', () => this._nextStage());
    this.el.themeToggle.addEventListener('click', () => this._toggleTheme());
    this.el.keyboardToggle.addEventListener('click', () => this._toggleKeyboard());

    // Auto-focus input on load
    this.el.typingInput.focus();
  }

  // --- Stage Management ---

  _loadStage(stageId) {
    const stage = getStage(stageId);
    this.currentStage = stageId;
    this.timeRemaining = stage.duration;
    this.sessionActive = false;

    // Update UI
    this.el.stageName.textContent = stage.name;
    this.el.stageHint.textContent = stage.hint;
    this._updateTimerDisplay();

    // Update active tab
    this.el.stageTabs.forEach(tab => {
      const tabStage = parseInt(tab.getAttribute('data-stage'));
      tab.classList.toggle('active', tabStage === stageId);
      tab.setAttribute('aria-selected', tabStage === stageId);
    });

    // Generate and load exercise
    const text = generateExercise(stageId);
    this.typing.load(text, this.el.typingText);

    // Reset stats display
    this.el.statWpm.textContent = '0';
    this.el.statAccuracy.textContent = '100%';
    this.el.statProgress.textContent = '0%';

    // Stop any running timer
    this._stopTimer();

    // Focus input
    this.el.typingInput.value = '';
    this.el.typingInput.focus();
  }

  _switchStage(stageId) {
    if (stageId === this.currentStage) return;
    this._loadStage(stageId);
  }

  _nextStage() {
    const next = this.currentStage < 5 ? this.currentStage + 1 : 1;
    this._switchStage(next);
  }

  _prevStage() {
    const prev = this.currentStage > 1 ? this.currentStage - 1 : 5;
    this._switchStage(prev);
  }

  _resetExercise() {
    this._loadStage(this.currentStage);
  }

  // --- Timer ---

  _startTimer() {
    if (this.timerInterval) return;
    this.timerInterval = setInterval(() => {
      this.timeRemaining--;
      this._updateTimerDisplay();

      if (this.timeRemaining <= 0) {
        this._stopTimer();
        this._onTimeUp();
      }
    }, 1000);
  }

  _stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  _updateTimerDisplay() {
    const min = Math.floor(this.timeRemaining / 60);
    const sec = this.timeRemaining % 60;
    this.el.timer.textContent = `${min}:${sec.toString().padStart(2, '0')}`;

    // Warning state under 30 seconds
    this.el.timer.classList.toggle('warning', this.timeRemaining <= 30 && this.timeRemaining > 0);
  }

  _onTimeUp() {
    const results = this.typing.getResults();
    this._recordAndUpdate(results);
    // Auto-advance after a short delay
    setTimeout(() => this._nextStage(), 1500);
  }

  // --- Exercise Completion ---

  _onExerciseComplete(results) {
    this._stopTimer();
    this._recordAndUpdate(results);
    // Brief pause then allow next action
  }

  _recordAndUpdate(results) {
    this.stats.recordSession(this.currentStage, results);
    this._updateKeyProgress();
    this._updateDailyGoal();
    this._updateStreak();
    this.sessionActive = false;
  }

  // --- UI Updates ---

  _updateKeyProgress() {
    const progress = this.stats.getKeyProgress();
    // Clear and rebuild
    while (this.el.keyProgress.firstChild) {
      this.el.keyProgress.removeChild(this.el.keyProgress.firstChild);
    }
    progress.forEach(({ key, status }) => {
      const el = document.createElement('div');
      el.className = 'key-progress-item';
      if (status !== 'untested') el.classList.add(status);
      el.textContent = key.toUpperCase();
      this.el.keyProgress.appendChild(el);
    });
  }

  _updateDailyGoal() {
    const progress = this.stats.getGoalProgress();
    const minutes = this.stats.getTodayMinutes();
    const goal = this.stats.data.goalMinutes;
    this.el.goalFill.style.width = progress + '%';
    this.el.goalText.textContent = `${Math.round(minutes)} / ${goal} min`;
  }

  _updateStreak() {
    this.el.statStreak.textContent = this.stats.getStreak();
  }

  // --- Theme ---

  _toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('promptkeymind_theme', next);
  }

  _loadTheme() {
    const saved = localStorage.getItem('promptkeymind_theme');
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
    }
  }

  // --- Keyboard Toggle ---

  _toggleKeyboard() {
    const visible = this.keyboard.toggle();
    const btn = this.el.keyboardToggle;
    btn.textContent = visible ? 'Hide ⌨' : 'Show ⌨';
    localStorage.setItem('promptkeymind_keyboard', visible ? 'visible' : 'hidden');
  }

  _loadKeyboardPref() {
    const saved = localStorage.getItem('promptkeymind_keyboard');
    if (saved === 'hidden') {
      this.keyboard.setVisible(false);
      this.el.keyboardToggle.textContent = 'Show ⌨';
    }
  }
}

// Boot
document.addEventListener('DOMContentLoaded', () => {
  new App();
});
