# PromptKeyMind

> Typing trainer built around your real AI prompt vocabulary — not random words.

Generic typing trainers drill "the quick brown fox." You don't type that. You type `create a simple n8n workflow`, `explain the architecture step by step`, `compare these two approaches`. PromptKeyMind trains the words, transitions, and phrases you actually use.

## Features

- **5 progressive stages** — letters, transitions, keywords, command phrases, full prompts
- **Vocabulary-derived training** — Stages 1-2 are generated backwards from your real vocabulary in Stages 3-5
- **Mac keyboard** with finger zone colors and hand indicators
- **Per-key accuracy tracking** (Keybr-style progress bar)
- **Dark/light theme**
- **localStorage persistence** — stats, streaks, preferences survive page reloads
- **Zero dependencies** — pure HTML, CSS, JavaScript. No build step.

## The 5 Stages

| Stage | What | Purpose |
|-------|------|---------|
| 1. Letters | Single letters + syllables grouped by finger | Wake up fingers, drill letter positions |
| 2. Transitions | Bigrams and trigrams from your vocabulary | Build transition speed between common letter pairs |
| 3. Keywords | Your real words: `workflow`, `automation`, `api` | Muscle memory for individual terms |
| 4. Commands | Prompt patterns: `explain step by step` | Drill the phrases you type daily |
| 5. Prompts | Full sentences: `create a simple n8n workflow` | Real-world typing at full speed |

Every syllable in Stage 1 and every bigram in Stage 2 comes from words you'll type in Stages 3-5. Nothing is random.

## Quick Start

**Live:** [type.yurykoretskiy.space](https://type.yurykoretskiy.space)

**Local:**
```bash
cd PromptKeyMind
python3 -m http.server 8080
# Open http://localhost:8080
```

Click the typing area and start typing. The keyboard highlights the next key and which finger to use.

## Architecture

```
index.html          Entry point (single page app)
vocab.html          Vocabulary reference page
css/styles.css      All styles, dark/light themes, keyboard layout
js/
  app.js            Main controller — wires everything together
  typing.js         Typing engine: character matching, cursor, WPM, accuracy
  keyboard.js       Virtual keyboard rendering + finger highlighting
  stages.js         5 stage definitions + exercise generators
  stats.js          localStorage persistence, per-key accuracy, streaks
  data.js           Training content — all vocabulary lives here
```

Module dependency:

```
app.js ──→ typing.js
       ──→ keyboard.js ──→ data.js (layout, finger map)
       ──→ stages.js   ──→ data.js (vocabulary)
       ──→ stats.js
```

## Customize Your Vocabulary

All training content lives in [`js/data.js`](js/data.js) as plain arrays. Edit directly — no build step needed.

- `KEYWORDS.single` — your core vocabulary words
- `KEYWORDS.pairs` — common word combinations
- `COMMANDS` — prompt command patterns (grouped by type)
- `PROMPTS` — full sentences you type to AI
- `WARMUP.syllables` — letter pairs derived from your vocabulary
- `TRANSITIONS.pairs` — bigrams ranked by frequency in your vocabulary

After editing Stages 3-5 vocabulary, update Stages 1-2 data to match — extract the syllables and bigrams from your new words.

## Vision

This is growing beyond a personal tool:

- **Vocabulary layers** — switch between "AI Prompting", "Personal Writing", "Shopping/Search", or custom topics
- **Import vocabulary** — paste text, import Claude/ChatGPT exports, auto-generate all 5 stages
- **Profiles** — export/import settings, stats, and vocabulary
- **Vocabulary exchange** — share vocabulary packs with others
- **Self-hostable** — Docker image for your own VPS

Full roadmap: [BACKLOG.md](BACKLOG.md)

## Tech Decisions

- **No framework** — instant load, zero bundle size, runs from any static host
- **ES modules** — clean imports without a bundler
- **CSS custom properties** — theme switching without JS style manipulation
- **localStorage** — no backend needed for personal use
- **Docker + nginx** — deploy anywhere with `docker-compose up`

## Docs

- [HANDOVER.md](HANDOVER.md) — quick business overview: problem, solution, architecture, state
- [PROJECT-STORY.md](PROJECT-STORY.md) — full narrative: why it was built, every decision, the journey
- [BACKLOG.md](BACKLOG.md) — phased roadmap of what's coming

## License

MIT
