/* ============================================
   PromptKeyMind — Stage Definitions
   5 training stages with exercise generation.
   ============================================ */

import { WARMUP, TRANSITIONS, KEYWORDS, COMMANDS, PROMPTS } from './data.js';

/**
 * Shuffle an array (Fisher-Yates).
 */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Pick n random items from an array.
 */
function pick(arr, n) {
  return shuffle(arr).slice(0, n);
}

export const STAGES = [
  {
    id: 1,
    name: 'Stage 1 — Letter Warm-up',
    hint: 'Wake up your fingers with vocabulary-derived syllables',
    duration: 120, // seconds
    generate() {
      // Pick a random finger group and drill its letters
      const group = WARMUP.fingerGroups[Math.floor(Math.random() * WARMUP.fingerGroups.length)];
      const letters = group.keys.map(k => [k, k, k]).flat();

      // Pick syllables that use these finger's letters, plus general ones
      const syllables = pick(WARMUP.syllables, 16);

      const parts = [
        ...shuffle(letters),
        ...syllables.flatMap(s => [s, s, s]),
      ];
      return parts.join(' ');
    },
  },
  {
    id: 2,
    name: 'Stage 2 — Key Transitions',
    hint: 'Train transitions that appear in your real vocabulary',
    duration: 120,
    generate() {
      const pairs = pick(TRANSITIONS.pairs, 12);
      const chunks = pick(TRANSITIONS.chunks, 10);
      const drills = pick(TRANSITIONS.drills, 3);
      const parts = [
        ...pairs.flatMap(p => [p, p, p]),
        ...chunks,
        ...drills,
      ];
      return parts.join(' ');
    },
  },
  {
    id: 3,
    name: 'Stage 3 — Keywords',
    hint: 'Build muscle memory for your real vocabulary',
    duration: 120,
    generate() {
      const singles = pick(KEYWORDS.single, 14);
      const pairs = pick(KEYWORDS.pairs, 8);
      const parts = [
        ...singles,
        ...pairs,
      ];
      return shuffle(parts).join(' ');
    },
  },
  {
    id: 4,
    name: 'Stage 4 — Command Phrases',
    hint: 'Practice the prompt patterns you type daily',
    duration: 120,
    generate() {
      const all = [
        ...COMMANDS.creation,
        ...COMMANDS.explanation,
        ...COMMANDS.comparison,
        ...COMMANDS.debugging,
        ...COMMANDS.analysis,
      ];
      const selected = pick(all, 10);
      return selected.join('  ');
    },
  },
  {
    id: 5,
    name: 'Stage 5 — Real Prompts',
    hint: 'Type full sentences exactly as you would to an AI',
    duration: 120,
    generate() {
      const selected = pick(PROMPTS, 8);
      return selected.join('  ');
    },
  },
];

/**
 * Get stage by id (1-indexed).
 */
export function getStage(id) {
  return STAGES.find(s => s.id === id) || STAGES[0];
}

/**
 * Generate exercise text for a stage.
 */
export function generateExercise(stageId) {
  const stage = getStage(stageId);
  return stage.generate();
}
