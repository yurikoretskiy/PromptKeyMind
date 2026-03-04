# PromptKeyMind — Project Handover

## Problem

Typing trainers teach you to type faster. They don't teach you to type *your* words faster.

A prompt engineer types `create a simple n8n workflow` and `explain the architecture step by step` hundreds of times. Generic trainers drill `the quick brown fox` — words that share almost zero muscle memory with their actual work. The training doesn't transfer.

## Solution

PromptKeyMind is a personal typing trainer that uses your real vocabulary as training content. It breaks your actual words and phrases into progressive difficulty stages so every minute of practice builds muscle memory you'll use.

## The Training Model

5 stages, each building on the previous:

```
Stage 1: Letters       →  Individual keys, grouped by finger
Stage 2: Transitions   →  Bigrams/trigrams extracted from your words
Stage 3: Keywords      →  Your actual vocabulary terms
Stage 4: Commands      →  Prompt patterns you type daily
Stage 5: Full Prompts  →  Complete sentences as you'd send to an AI
```

**The key principle: derive backwards.** Stages 1-2 are not generic — they are extracted FROM Stages 3-5. If `workflow` is in your vocabulary, then `wo`, `rk`, `fl`, `ow` appear in Stage 2 transitions, and the individual letters `w`, `o`, `r`, `k`, `f`, `l` are drilled in Stage 1.

This means:
- Every letter you practice in Stage 1 prepares you for a word in Stage 3
- Every bigram in Stage 2 appears in a phrase you'll type in Stage 5
- No wasted effort on patterns you'll never use

## Technical Architecture

### Stack

Vanilla HTML + CSS + JavaScript. No framework, no build tools, no npm.

**Why:** The app loads instantly, runs from any static file server (or `file://`), and has zero maintenance burden. There's nothing to update, no dependencies to audit, no build pipeline to break. For a personal tool, this is the right trade-off.

### Module Structure

| Module | Responsibility | Lines |
|--------|---------------|-------|
| `app.js` | Main controller — event handling, stage navigation, UI orchestration | 329 |
| `typing.js` | Typing engine — character matching, cursor position, WPM/accuracy calculation | 226 |
| `keyboard.js` | Virtual Mac keyboard — renders layout, highlights active key and finger zone | 153 |
| `stages.js` | 5 stage definitions — exercise text generators using randomized selection | 122 |
| `stats.js` | Persistence layer — localStorage for per-key accuracy, streaks, preferences | 176 |
| `data.js` | All training content — vocabulary arrays, keyboard layout, finger mapping | 232 |

Total: ~2,900 lines across 9 source files.

### Data Flow

```
User types a key
  → typing.js matches against expected character
  → Updates correct/incorrect state, advances cursor
  → Emits update → app.js refreshes WPM/accuracy display
  → keyboard.js highlights next expected key + finger zone
  → Hand SVG highlights the correct finger
```

### Persistence

All state is in `localStorage`:
- Per-key accuracy (correct/total per character)
- Daily streak counter
- Theme preference (dark/light)
- Keyboard visibility toggle
- Stage progress

No backend. No accounts. Data lives in the browser.

### Customization

All vocabulary lives in `js/data.js` as plain JavaScript arrays. To change the training content:

1. Edit `KEYWORDS`, `COMMANDS`, and `PROMPTS` arrays with your vocabulary
2. Extract bigrams/syllables from your new words into `TRANSITIONS` and `WARMUP`
3. Reload the page

No build step required.

## Current State

**Version:** Post-Iteration 3 (stable)

**What works:**
- All 5 stages generate and run correctly
- Typing engine tracks WPM, accuracy, and per-key stats
- Mac keyboard layout with finger zone colors (index=blue/purple, middle=green, ring=orange, pinky=pink)
- Hand SVG indicators highlight the correct finger for each key
- Dark/light theme toggle with smooth transitions
- Per-key accuracy progress bar (A-Z, 0-9)
- Word wrapping prevents mid-word line breaks
- Vocabulary reference page (`vocab.html`) documents all training content
- Stats persist across sessions

**Verified on:** Chrome/macOS, desktop viewport.

## Limitations

- **Desktop only** — no mobile or tablet layout
- **English QWERTY only** — Mac keyboard layout hardcoded
- **No vocab editor UI** — vocabulary changes require editing `data.js` directly
- **No backend** — no cross-device sync, no analytics, no sharing
- **No adaptive difficulty** — stages don't adjust based on per-key accuracy (like Keybr does)
- **Timer is display-only** — doesn't auto-advance or enforce stage completion

## Potential Next Steps

| Priority | Feature | Effort |
|----------|---------|--------|
| High | Adaptive difficulty — focus on weak keys automatically | Medium |
| High | Custom vocabulary upload — paste your words, auto-extract stages 1-2 | Medium |
| Medium | Mobile-responsive layout | Medium |
| Medium | Session analytics — WPM trend over time, accuracy heatmap | Medium |
| Low | Multiple keyboard layouts (Windows, ISO, etc.) | Low |
| Low | Export/import stats (JSON backup) | Low |

## How to Run

```bash
cd PromptKeyMind
python3 -m http.server 8080
# Open http://localhost:8080
```

Or deploy to any static hosting (GitHub Pages, Netlify, Vercel) — just push and it works.
