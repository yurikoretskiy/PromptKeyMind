# PromptKeyMind

Personal typing trainer focused on real workflow vocabulary — prompts, commands, automation terms.

**Platform**: Laptop/desktop only (no mobile support needed).

## Rules

- **Announce every task** before starting — format: `TASK: <verb> <object>` (e.g., "TASK: Rebuilding Claude Usage app")
- **One agent at a time** — run subagents sequentially, never in parallel; default to haiku, escalate only when complexity or explicit instruction demands it
- **Execute → Verify → Fix** — after each task, show a self-check report (pass/fail); if fail, fix before moving on
- **Stay on plan** — follow the approved plan precisely; no scope creep, no unrequested improvements
- **Recommend provider per task** — during plan mode, evaluate each task and flag if another model or provider (Gemini, Codex, etc.) would be better suited; include a `Model:` column in the plan's task table so I can approve or override before execution starts

## Skills

- **Always use `frontend-design` skill** when creating or modifying UI/HTML/CSS — invoke it before writing any frontend code
- Use `superpowers:brainstorming` before any creative/feature work
- Use `superpowers:test-driven-development` when adding logic
- Use `superpowers:verification-before-completion` before claiming work is done
- Use `superpowers:systematic-debugging` for any bugs or unexpected behavior

## Architecture

- **Vanilla HTML + CSS + JS** — no frameworks, no build tools, no npm
- **Single page app** — `index.html` is the entry point, open directly in Chrome
- **localStorage** for all persistence (progress, stats, streaks)
- **ES modules** — JS files use `import`/`export` syntax

## File Structure

```
├── CLAUDE.md           ← this file
├── README.md           ← GitHub README
├── index.html          ← single page app entry point
├── vocab.html          ← vocabulary reference page
├── css/
│   └── styles.css      ← all styles, dark/light themes, keyboard layout
├── js/
│   ├── app.js          ← main controller, wires everything together
│   ├── typing.js       ← typing engine: char matching, cursor, WPM/accuracy
│   ├── keyboard.js     ← virtual keyboard rendering + finger highlighting
│   ├── stages.js       ← 5 stage definitions + exercise generation
│   ├── stats.js        ← localStorage persistence, per-key accuracy, streaks
│   └── data.js         ← word lists, phrases, sentences (user-editable)
├── docs/
│   ├── HANDOVER.md     ← project handover document
│   ├── screenshots/    ← verification & demo screenshots (gitignored)
│   └── archive/        ← brainstorming docs & design refs (gitignored)
```

## Key Conventions

- **No external dependencies** — everything is self-contained
- **data.js** contains all training content as plain arrays — easy to edit manually
- **Dark theme** is default; light theme via toggle. CSS uses `[data-theme]` attribute on `<html>`
- **Keyboard** is toggleable (show/hide) — user should never be forced to see it
- **5 training stages**: Letter warm-up → Transitions → Keywords → Command phrases → Real prompts
- **Timer** per stage defaults to 2 minutes each

## Design References

- **Keybr** — adaptive per-key training, letter progress bar, clean minimal UI
- **SpeedTypingOnline** — virtual keyboard with finger color zones, hand indicators, lesson structure

## Testing

- Open `index.html` in Chrome (no server needed for MVP)
- All 5 stages should be navigable and typeable
- Stats persist across page reloads (localStorage)
- Theme toggle switches instantly between dark/light
