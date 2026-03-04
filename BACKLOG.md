# PromptKeyMind — Backlog

## Current State (v0.3)

Working MVP with 5 training stages, Mac keyboard with finger zones and hand indicators, dark/light themes, per-key accuracy tracking, vocabulary-derived training data (derive backwards principle), localStorage persistence.

Live at: `type.yurykoretskiy.space`

---

## Phase 1: Deployment & Versioning
*Get it live, establish a release rhythm.*

- [x] Deploy to VPS subdomain (`type.yurykoretskiy.space`)
- [x] Milestone versioning — each push = version tag in commits
- [ ] Favicon and meta tags (Open Graph for link previews)
- [ ] Auto-deploy on push (GitHub webhook → VPS pull)

## Phase 2: Profiles & Persistence
*Make it personal and portable.*

- [ ] User profile — name, preferences, stored in localStorage
- [ ] Settings export/import — download/upload JSON with all preferences, stats, streaks
- [ ] Profile reset — clear everything and start fresh
- [ ] Theme memory per profile
- [ ] Keyboard layout preference per profile

## Phase 3: Vocabulary System
*The core differentiator — make vocabulary a first-class feature.*

- [ ] Multiple vocabulary layers — switch between "Professional Prompting", "Personal Typing", "Shopping/Search", "Short Letters", or custom topics
- [ ] Vocabulary editor UI — add/remove/edit words without touching code
- [ ] Import vocabulary from text — paste a block of text, auto-extract keywords, bigrams, prompts
- [ ] Import from sources — Claude conversations, ChatGPT exports, notes
- [ ] Auto-derive Stages 1-2 — when vocabulary changes, automatically regenerate letter drills and transitions
- [ ] Vocabulary versioning — keep history of changes, roll back if needed
- [ ] Vocabulary export — share your vocabulary set as a file
- [ ] Vocabulary exchange — import someone else's vocabulary pack

## Phase 4: Hosting & Multi-user
*From personal tool to something others can use.*

- [ ] Self-hostable — Docker image anyone can deploy on their own VPS
- [ ] Public instance — `type.yurykoretskiy.space` open for anyone to try
- [ ] Per-user storage — backend for saving profiles and vocabularies (not just localStorage)
- [ ] Share vocabulary links — "Try my prompting vocabulary" as a URL
- [ ] Consider SaaS model (not a priority — avoid maintenance burden unless there's real demand)

## Phase 5: Advanced Training
*Make the training smarter.*

- [ ] Adaptive difficulty — detect weak keys, generate focused exercises (Keybr-style)
- [ ] Session analytics — WPM trend over time, accuracy heatmap per key, weekly chart
- [ ] Multiple keyboard layouts — Windows, ISO, etc.
- [ ] Mobile-responsive layout
- [ ] Voice correction mode — practice words that voice-to-text often misrecognizes
- [ ] Timed challenges — speed runs with scoring
- [ ] Export/import stats — JSON backup of all progress

---

## Ideas Parking Lot
*Not committed to any phase yet. Worth remembering.*

- n8n workflow to auto-generate vocabulary from ChatGPT/Claude conversation exports
- Notion integration — pull vocabulary from Notion databases
- Browser extension — capture words you type frequently and suggest them for practice
- Multiplayer — compete with friends on typing the same vocabulary
- AI-generated exercises — use an LLM to create realistic prompt sentences from your vocabulary
- Keyboard heatmap — visual overlay showing which keys you hit most/least accurately
