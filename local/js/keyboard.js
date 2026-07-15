/* ============================================
   PromptKeyMind — Virtual Keyboard
   Mac-style keyboard with finger zone colors,
   active key highlighting, toggle visibility.
   ============================================ */

import { KEYBOARD_LAYOUT, KEY_FINGERS, HOME_KEYS } from './data.js';

// Modifier/special keys that get wider sizing and labels
const MODIFIER_KEYS = {
  'shift-l': { label: 'Shift', cssClass: 'key-shift' },
  'fn': { label: 'fn', cssClass: 'key-mod-sm' },
  'ctrl': { label: '⌃', cssClass: 'key-mod-sm' },
  'opt': { label: '⌥', cssClass: 'key-mod-sm' },
  'cmd': { label: '⌘', cssClass: 'key-mod' },
  'cmd-r': { label: '⌘', cssClass: 'key-mod' },
  'opt-r': { label: '⌥', cssClass: 'key-mod-sm' },
  ' ': { label: '', cssClass: 'key-space' },
};

const DISPLAY_LABELS = {
  '`': '`', '-': '-', '=': '=',
  ';': ';', ',': ',', '.': '.', '/': '/',
};

export class VirtualKeyboard {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.keys = new Map(); // key -> DOM element
    this.activeKey = null;
    this.activeFinger = null; // currently highlighted finger SVG element
    this.isVisible = true;
    this.handLeft = document.getElementById('hand-left');
    this.handRight = document.getElementById('hand-right');
    this._render();
    this._setupAutoScale();
  }

  /**
   * Scale the keyboard+hands block down as one unit when it is wider than
   * the available space (browser zoom, narrow window). The px-based key
   * layout stays intact; only the rendered size shrinks.
   */
  _setupAutoScale() {
    this.wrapper = document.getElementById('keyboard-with-hands');
    if (!this.wrapper || typeof ResizeObserver === 'undefined') return;

    const apply = () => this._applyScale();
    this._resizeObserver = new ResizeObserver(apply);
    this._resizeObserver.observe(this.wrapper.parentElement);
    window.addEventListener('resize', apply);
  }

  _applyScale() {
    const wrapper = this.wrapper;
    if (!wrapper || !this.isVisible) return;

    // Natural (unscaled) width: keyboard + both hands + flex gaps
    const gap = 12;
    const natural = this.container.offsetWidth +
      (this.handLeft ? this.handLeft.offsetWidth + gap : 0) +
      (this.handRight ? this.handRight.offsetWidth + gap : 0);
    const avail = wrapper.parentElement.clientWidth;

    if (natural > avail && avail > 0) {
      const s = avail / natural;
      wrapper.style.transformOrigin = 'top center';
      wrapper.style.transform = `scale(${s})`;
      // transform doesn't affect layout height — set it explicitly
      wrapper.style.height = (this.container.offsetHeight * s) + 'px';
    } else {
      wrapper.style.transform = '';
      wrapper.style.height = '';
    }
  }

  _render() {
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }

    KEYBOARD_LAYOUT.forEach((row) => {
      const rowEl = document.createElement('div');
      rowEl.className = 'keyboard-row';

      row.forEach(key => {
        const keyEl = document.createElement('div');
        keyEl.className = 'key';

        const mod = MODIFIER_KEYS[key];
        if (mod) {
          keyEl.classList.add(mod.cssClass);
          keyEl.textContent = mod.label;
          keyEl.classList.add('key-modifier');
        } else {
          const label = DISPLAY_LABELS[key] || key.toUpperCase();
          keyEl.textContent = label;
        }

        // Finger zone
        const finger = KEY_FINGERS[key];
        if (finger) keyEl.setAttribute('data-finger', finger);

        // Home key indicator
        if (HOME_KEYS.includes(key)) keyEl.classList.add('home-key');

        keyEl.setAttribute('data-key', key);
        rowEl.appendChild(keyEl);
        this.keys.set(key, keyEl);
      });

      this.container.appendChild(rowEl);
    });
  }

  highlight(key) {
    // Clear previous key highlight
    if (this.activeKey) {
      const prevEl = this.keys.get(this.activeKey);
      if (prevEl) prevEl.classList.remove('active');
    }

    // Clear previous finger highlight
    if (this.activeFinger) {
      this.activeFinger.classList.remove('active');
      this.activeFinger = null;
    }

    const lowerKey = key.toLowerCase();
    const keyEl = this.keys.get(lowerKey);
    if (keyEl) {
      keyEl.classList.add('active');
      this.activeKey = lowerKey;

      // Highlight corresponding finger on hand SVG
      const finger = KEY_FINGERS[lowerKey];
      if (finger) {
        this._highlightFinger(finger);
      }
    }
  }

  /** Highlight the matching finger path on the correct hand SVG */
  _highlightFinger(finger) {
    // Determine which hand to search
    let hand = null;
    if (finger.endsWith('-l')) {
      hand = this.handLeft;
    } else if (finger.endsWith('-r')) {
      hand = this.handRight;
    } else if (finger === 'thumb') {
      // Space bar thumb — highlight right hand thumb by default
      hand = this.handRight;
    }

    if (!hand) return;

    const fingerEl = hand.querySelector(`[data-finger="${finger}"]`);
    if (fingerEl) {
      fingerEl.classList.add('active');
      this.activeFinger = fingerEl;
    }
  }

  clearHighlight() {
    if (this.activeKey) {
      const el = this.keys.get(this.activeKey);
      if (el) el.classList.remove('active');
      this.activeKey = null;
    }
    if (this.activeFinger) {
      this.activeFinger.classList.remove('active');
      this.activeFinger = null;
    }
  }

  toggle() {
    this.setVisible(!this.isVisible);
    return this.isVisible;
  }

  setVisible(visible) {
    this.isVisible = visible;
    this.container.classList.toggle('hidden', !visible);
    const handsWrapper = document.getElementById('keyboard-with-hands');
    if (handsWrapper) {
      handsWrapper.classList.toggle('hidden', !visible);
      if (!visible) {
        // Clear inline scale so the max-height hide transition can collapse
        handsWrapper.style.transform = '';
        handsWrapper.style.height = '';
      }
    }
    if (visible) this._applyScale();
  }
}
