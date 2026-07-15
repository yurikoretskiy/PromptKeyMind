# Claude handoff — session 3e37ace7

**Focus**: Fixed local-run bugs, built full real MacBook keyboard, reviewed unexpected uncommitted mode-switcher work
**Updated**: 15 Jul 2026, 10:58 — session closed

## State
- [x] Fixed caret line-wrap glitch, modal record-loop, keyboard auto-scale, stage 1 continuity — committed `[cc] v1.3`
- [x] Built full real MacBook keyboard layout from reference photo, unused keys dimmed — committed `[cc] v1.4`
- [x] Fixed commit convention violation (missing [cc]/version tags on v1.3/v1.4) via cherry-pick rewrite — verified tree-identical before swapping `master`
- [x] Confirmed `promptkeymind.yurykoretskiy.space` DNS already resolves to the VPS correctly
- [x] Built `buildWordProgression(word)` (letters→bigrams→trigrams→word→real-vocab context) in `stages.js`, 3 unit tests passing, deliberately not wired into the live UI
- [!] Substantial **uncommitted** work appeared in `local/` during a session gap (lost background-task record, model switches) that I have no visible authorship of: a Classic/Prompt mode switcher wiring `buildWordProgression` in, a new Focus/Hands/Keyboard/Tutor visual-aid switcher, and keyboard-legend refinements (uppercase keycaps) that reverse an earlier lowercase recommendation. 27/27 tests pass but two feature/design decisions were never explicitly approved by Yury — blocker: he needs to look at the running local window (localhost:8080) and say keep/change/drop per feature before this gets committed.
- [!] Push to GitHub + VPS deploy — blocked on Yury saying the literal word "deploy"/"push" (his own gate, now enforced by the harness's permission classifier, not just my judgment)

## Next step
Yury reviews the live uncommitted UI at localhost:8080 (mode switcher top-right, visual-aid switcher above keyboard), decides per-feature keep/change/drop, then it gets committed with a proper `[cc] vX.Y` tag. Separately/independently: say "deploy" to push the 4 already-committed local commits (v1.2–v1.4 + docs) and redeploy the VPS — this also fixes the promptkeymind.yurykoretskiy.space cert error (VPS is currently stuck on stale v0.4).

## Routing
- Reference photo used for the keyboard rebuild: `docs/archive/Design examples/mymackeyboard.png`
- Test suite: `local/test.mjs` (27 tests, all passing as of this session)
- VPS: `/root/PromptKeyMind` — git remote was stale (`yurikoretskiy`), needs updating to `yurykoretskiy` before pulling
- Memory: `deploy-approval-gate.md`, `commit-conventions.md` in this project's Claude memory — both written this session, both now enforced

## Suggested skills
- `frontend-design` if continuing to refine the visual-aid-switcher / mode-switcher UI
- `superpowers:brainstorming` if the Prompt-mode / Flow-stage concept needs more design work before committing
