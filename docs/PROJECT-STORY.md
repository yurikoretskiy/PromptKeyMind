# PromptKeyMind — The Full Story

How a personal typing trainer was born, what problems it solves, what decisions were made along the way, and why every detail matters.

---

## Where It Started

I use voice-to-text a lot. It genuinely changed my productivity — I can think out loud, brainstorm, dump context. But there's a problem: sometimes I still need to type. When I'm in a quiet place. When I'm too tired to talk. When the conversation shifts from exploring to commanding — short, precise instructions like "create a simple workflow" or "explain this step by step."

About a year ago I spent a few weeks practicing typing every day, 10-15 minutes. I noticed real progress. But I stopped, and when I came back, I realized two things:

**First**, even five minutes of typing in the morning helps me start the day. It wakes up the brain. It's not just a mechanical skill — it's like a warm-up for thinking.

**Second**, every typing trainer I tried was teaching me the wrong words. "The quick brown fox jumps over the lazy dog." I don't type that. I type `n8n workflow`, `compare these two approaches`, `show the architecture`. My real vocabulary is maybe 100-150 words. If I could type *those* without thinking, my actual work speed would jump.

That was the seed of the idea.

## The Core Insight: Patterns, Not Letters

The brain doesn't memorize individual letters. It memorizes patterns — movement shapes on the keyboard. The same way a programmer memorizes Cmd+Shift+P, or a musician memorizes chord shapes, a typist memorizes word shapes.

When you type "the" enough times, you don't think T-H-E. Your fingers just know the shape. The word becomes a single motor program stored in the cerebellum.

So if I train `workflow` a hundred times, my brain stores it as one movement. Then `workflow automation` becomes a chunk. Then `create a simple workflow` becomes almost automatic.

This is the difference: generic trainers optimize for *typing speed*. What I actually need is to reduce **thinking-to-command latency** — the gap between having an idea and getting it into the machine.

## Two Modes of Communication

Looking at how I actually work, there's a clear pattern:

- **Voice mode** — when I'm thinking, exploring, giving context, brainstorming. Long, messy, stream-of-consciousness.
- **Typing mode** — when I'm controlling. Short instructions. Precise commands. Corrections. Structured prompts.

Most typing trainers train for Mode 1 language — full sentences, common English. But my typing is almost entirely Mode 2. That's a very small vocabulary, but it needs to be *fast*.

The trainer should focus on the words and patterns I use when I switch from voice to keyboard — the control language.

## What I Liked in Existing Tools

I tried two trainers that each did something right:

### SpeedTypingOnline
- Shows the keyboard on screen with finger positions highlighted
- Introduces keys gradually, finger by finger
- You can scroll and hide the keyboard when you don't need it anymore
- Clean, structured lessons

What I took from it: the finger-grouped lesson structure and the idea of a visual keyboard that shows you which finger to use.

### Keybr
- Adaptive — detects which keys you mistype most
- Generates fake words containing those weak letters
- Forces repetition until accuracy improves
- Shows per-key statistics

What I took from it: the per-key accuracy tracking bar (A through Z, each key colored by how well you type it). It's a simple visual that tells you exactly where you're weak.

The ideal trainer would combine both: structured finger training (SpeedTypingOnline) + adaptive weak-key focus (Keybr) + personal vocabulary (mine).

## The Name

I brainstormed names with Claude. The suggestions were PromptType, FlowKeys, KeyMind. Claude actually recommended against PromptKeyMind — said three concept words stacked together is "too heavy for a product name."

I went with PromptKeyMind anyway.

It captures exactly what the tool is: **Prompt** (AI workflows), **Key** (typing), **Mind** (the brain connection). Yes, it's long. But it's my personal tool. And honestly, every time I say it, I remember what it's for.

## Building It: Three Iterations

### Iteration 1 — The MVP

The first version was straightforward: five stages of typing exercises, a timer, WPM counter, accuracy tracking. Pure vanilla HTML, CSS, and JavaScript — no React, no build tools, no npm. Just files you open in a browser.

Why no framework? Because this is a personal tool. It needs to load instantly, never break because of a dependency update, and run from literally any computer with a browser. No build step means I can edit `data.js` and just reload. Zero friction.

The five stages came from analyzing how typing skills build on each other:

1. **Letters** — wake up the fingers, practice individual key positions
2. **Transitions** — train the movement between keys (bigrams like "wo", "pr", "st")
3. **Keywords** — my actual vocabulary words
4. **Commands** — the prompt patterns I type daily ("explain step by step", "create a simple workflow")
5. **Full prompts** — complete sentences exactly as I'd send to an AI

Each stage is 2 minutes. Total session: 10 minutes. Enough to activate the brain without feeling like homework.

### Iteration 2 — Making It Real

This is where it got personal.

**The keyboard.** The first version had a generic keyboard layout. It looked fine but felt disconnected. Then I had an idea: I took a photo of my actual MacBook keyboard. Not a stock image — my keyboard, the one my fingers touch every day. I used it as a reference to build the virtual keyboard so it would match exactly what I see when I look down.

Why does this matter? Because an abstract keyboard has no connection to you. When the on-screen keyboard matches your real one — same key sizes, same layout, same spacing — the visual feedback actually transfers. Your eyes see the highlighted key, and your brain maps it directly to the physical key under your fingers. It's the difference between studying a map and walking the actual street.

The keyboard also shows finger zones in color: index fingers get blue/purple, middle fingers green, ring fingers orange, pinkies pink. And there are hand SVGs on either side that highlight which specific finger to use for each key. So at any moment you can see: this is the key, this is the finger, this is the hand.

**The sunny day problem.** I was working outside on my laptop and realized I couldn't see anything. The dark theme — which looked beautiful indoors — was completely unreadable in sunlight. So I added a light theme. Not as an afterthought, but properly: CSS custom properties, high contrast ratios, a toggle button. Now I switch based on where I'm working.

This is the kind of thing you only discover by actually using what you build.

**The vocabulary page.** I added `vocab.html` — a reference page that shows all the training content organized by stage. Every word, every phrase, every prompt. It's useful for reviewing what's in the trainer and for editing the vocabulary. It also serves as documentation of the training model.

### Iteration 3 — Making It Coherent

This was the hardest iteration and the most important one.

I tested all five stages and something felt wrong. Stage 1 was mixing random syllables with home row drills and small words. Stage 2 had bigrams that seemed disconnected from the words I'd type later. Stage 3 keywords like "json" had no connection to anything in Stages 1 or 2.

The stages were independent pools of content. There was no *learning sequence*. Practicing "d k d k" in Stage 1 doesn't prepare you for "deployment" in Stage 3. The letters and transitions I drilled had no relationship to the words I'd actually type.

I looked at how SpeedTypingOnline structures their lessons — keys introduced by finger pairs, each lesson building on the previous — and realized the principle:

**Derive backwards.**

If I'm going to type "workflow" in Stage 3, then "wo", "rk", "fl", "ow" should appear in Stage 2 transitions. And the individual letters w, o, r, k, f, l should be drilled in Stage 1. Every syllable in the warm-up should come from a real word. Every bigram in transitions should appear in a real phrase.

So I rebuilt the training data from scratch:
- Started with Stages 3-5 (my real vocabulary — keywords, commands, prompts)
- Extracted all bigrams and trigrams from those words → Stage 2
- Extracted all individual letters grouped by finger → Stage 1

Now nothing is random. Stage 1 syllables like "pr" come from "prompt" and "project". Stage 2 chunks like "tion" come from "automation" and "integration". Everything connects forward.

I also removed the home row drills and small words from Stage 1. "asdf jkl;" is a classic typing exercise, but it doesn't belong here. This trainer isn't about learning to type from scratch — it's about building muscle memory for specific words. Keep it focused.

**The word-wrapping battle.** One annoying bug: long words like "deployment" would break across lines mid-word. This sounds simple to fix but turned out to be genuinely hard.

The typing engine renders each character as an individual `<span>` element (so it can color them green/red as you type). But the browser treats each span as an independent inline element — it doesn't know which spans form a word. So "deployment" might break as "deploy-" on one line and "ment" on the next.

I tried five different CSS approaches:
1. `word-break: keep-all` — didn't work because spans aren't words
2. Wrapping spans per word with `display: inline-block` — words still broke because `overflow-wrap` on the parent overrode it
3. Using non-breaking spaces (`\u00A0`) — prevented ALL line breaks, not just mid-word ones
4. `display: inline` with `white-space: nowrap` on word wrappers — text went on one infinite line
5. Finally: word wrappers with `white-space: nowrap` + space characters with `white-space: pre-wrap` — this preserved spaces visually AND allowed line breaks between words

Five attempts for what should have been a one-line CSS fix. Sometimes the simplest-sounding problems are the hardest.

## Ideas That Were Applied

- **Personal vocabulary as training content** — the core concept, everything derives from this
- **Five progressive stages** — letters → transitions → keywords → commands → prompts
- **Derive backwards** — Stages 1-2 generated FROM Stages 3-5 vocabulary
- **Mac keyboard matching real hardware** — photographed my actual keyboard as reference
- **Finger zone colors** — from SpeedTypingOnline's approach, helps learn which finger goes where
- **Hand SVG indicators** — visual hint showing the correct finger for each key
- **Per-key accuracy tracking** — from Keybr's per-letter statistics bar
- **Dark + light themes** — discovered the need by actually using it outdoors
- **Word wrapper spans** — technical solution to prevent mid-word line breaks
- **Vocabulary reference page** — shows all training content, serves as documentation
- **No framework** — deliberate choice for zero maintenance and instant loading
- **localStorage for everything** — no backend needed for a personal tool

## Ideas That Were Rejected

- **Home row drills in Stage 1** — "asdf jkl;" is classic typing training but doesn't serve this tool's purpose. Removed in Iteration 3 — Stage 1 should only drill letters that appear in your real vocabulary.
- **Small common words in Stage 1** — words like "the", "and", "for" don't need dedicated practice. They'll appear naturally in Stages 4-5. Stage 1 stays pure: individual letters and vocabulary-derived syllables.
- **Mobile layout** — I type on a laptop. This tool is for laptop/desktop keyboards. No point designing a mobile experience for a tool about physical keyboard muscle memory.
- **Backend / user accounts** — way too heavy for a personal tool. localStorage is enough. If I lose my stats, I just practice more.
- **Framework (React, Vue, etc.)** — would add complexity, build steps, dependency management. For a 2,900-line app that one person uses, vanilla JS is the right call.
- **Generic English vocabulary** — the whole point is to NOT train random words. Every word in the trainer should be a word I actually type.

## Ideas Suggested but Not Yet Implemented

These came up during development and make sense for future iterations:

- **Adaptive difficulty (Keybr-style)** — the trainer would detect which keys I consistently mistype and generate focused exercises. Right now the exercises are random within each stage. Making them adaptive would be a significant upgrade.
- **Custom vocabulary upload** — paste a block of text, the system auto-extracts words, bigrams, and generates all five stages. Currently you have to manually edit `data.js`.
- **Session analytics** — WPM trend over time, accuracy heatmap per key, weekly progress chart. Right now stats are tracked but not visualized beyond the current session.
- **Multiple keyboard layouts** — the keyboard is hardcoded to Mac QWERTY. Supporting Windows or ISO layouts would make it useful for other people.
- **Export/import stats** — JSON backup of your progress. Useful if you clear browser data or switch machines.
- **Voice correction mode** — practice typing words that voice-to-text frequently misrecognizes. This connects to my actual workflow where I switch between voice and typing.

## What Makes This Different

Every typing trainer I've seen trains generic language. They optimize for words-per-minute on text you'll never type again.

PromptKeyMind trains *your* language. The 100-150 words you actually use. The command patterns you type ten times a day. The prompts you send to AI tools.

And it builds the skill progressively: first the letters, then the transitions between letters, then the words, then the phrases, then the full sentences. Each stage prepares you for the next because the content is literally extracted from the next stage.

The result isn't just faster typing. It's **faster thinking-to-action**. When "create a simple workflow" becomes a single motor program — when your fingers just *know* the shape — the gap between having an idea and executing it shrinks to almost nothing.

That's what this tool is really about.

## The Technical Philosophy

Every technical decision was made with one question: does this serve a personal tool that one person uses daily?

- **Vanilla JS** because I never want to debug a webpack config at 7am when I just want to practice typing
- **No npm** because zero dependencies means zero things that can break
- **localStorage** because I don't need a database for typing stats
- **CSS custom properties** because theme switching should be instant, not a page reload
- **ES modules** because the code should be organized but not compiled
- **Static files** because `python3 -m http.server` is the entire deployment

This isn't scalable. It's not production-grade. It doesn't need to be. It's a sharp tool built for one person's specific workflow, and it does exactly what it needs to do.

## What's Here Now

Three iterations. ~2,900 lines of code. Nine source files. Two HTML pages. One CSS file with dark and light themes. A Mac keyboard with finger zones and hand indicators. Five training stages with vocabulary-derived content. Per-key accuracy tracking. Daily streaks. All running in a browser with zero dependencies.

It works. I use it. And every word it teaches me is a word I'll type tomorrow.
