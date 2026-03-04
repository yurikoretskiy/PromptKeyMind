/* ============================================
   PromptKeyMind — Training Data
   Stages 1-2 are derived FROM Stages 3-5 vocabulary
   so every letter and transition you practice
   prepares you for the real words and prompts.
   ============================================ */

// Stage 1: Letter warm-up — finger groups + vocabulary-derived syllables
// Letters and syllables come from your actual keywords and prompts.
export const WARMUP = {
  // Finger-grouped letters for isolated drilling
  fingerGroups: [
    { name: 'index', keys: ['f', 'j', 'r', 'u', 't', 'y', 'g', 'h', 'v', 'm', 'b', 'n'] },
    { name: 'middle', keys: ['d', 'k', 'e', 'i', 'c'] },
    { name: 'ring', keys: ['s', 'l', 'w', 'o', 'x'] },
    { name: 'pinky', keys: ['a', 'p', 'q', 'z'] },
  ],
  // Syllable patterns — every one appears in your vocabulary
  // e.g. "pr" from prompt/project, "wo" from workflow, "at" from automation
  syllables: [
    // From -ation words (automation, integration, evaluation, generation)
    'at', 'ti', 'io', 'on',
    // From prompt, project, prototype, process, improve
    'pr', 'ro', 'om', 'mp',
    // From system, structure, estimate, step
    'sy', 'st', 'te', 'em',
    // From workflow, show, how
    'wo', 'or', 'ow', 'ho',
    // From explain, experiment, execution, context
    'ex', 'xp', 'pl', 'la',
    // From create, architecture, compare, summary
    'cr', 'ea', 're', 'ar',
    // From design, simplify, integration
    'de', 'si', 'ig', 'in',
    // From compare, summarize, make
    'co', 'pa', 'su', 'ma',
    // From model, solution, evaluate, analysis
    'mo', 'el', 'so', 'al',
    // From build, find, trigger, response
    'bu', 'fi', 'tr', 'ri',
    // From token, node, error, what, this
    'to', 'no', 'er', 'wh', 'th',
  ],
};

// Stage 2: Key transitions — bigrams and chunks extracted from your vocabulary
// Every transition here appears in words you'll type in Stages 3-5.
export const TRANSITIONS = {
  // Bigrams ranked by how often they appear across your vocabulary
  pairs: [
    // Highest frequency — appear in 5+ vocabulary words
    'at', 'ti', 'io', 'on', 'in', 'te', 're', 'er',
    // High frequency — appear in 3-4 words
    'st', 'pr', 'ro', 'an', 'al', 'en', 'ar', 'de',
    // Medium frequency — appear in 2-3 words
    'ex', 'pl', 'co', 'mo', 'tr', 'si', 'el', 'ma',
    // Key vocabulary transitions
    'wo', 'ow', 'sy', 'cr', 'ea', 'ig', 'mp', 'ct',
    'so', 'su', 'bu', 'fi', 'sh', 'ho', 'wh', 'th',
  ],
  // Trigrams/chunks — recognizable pieces of your vocabulary words
  chunks: [
    // From automation, integration, evaluation, generation, execution
    'tion', 'atio', 'ation',
    // From prompt, project, prototype, process
    'pro', 'prom', 'proj',
    // From system, structure
    'sys', 'str', 'ruct',
    // From workflow, work
    'work', 'flow', 'ork',
    // From explain, experiment, execution
    'exp', 'xpl', 'pla',
    // From create, architecture
    'cre', 'ate', 'arch',
    // From design, deploy, data
    'des', 'dep', 'dat',
    // From compare, complexity, context
    'com', 'con', 'tex',
    // From model, solution, analysis
    'mod', 'sol', 'ana',
    // From integrate, trigger
    'int', 'gra', 'trig',
  ],
  // Repetition drills for muscle memory on key word roots
  drills: [
    'pro pro pro', 'sys sys sys', 'tion tion tion',
    'work work work', 'flow flow flow', 'ate ate ate',
    'str str str', 'exp exp exp', 'com com com',
    'aut aut aut', 'mod mod mod', 'int int int',
  ],
};

// Stage 3: Keywords — personal vocabulary
export const KEYWORDS = {
  single: [
    'n8n', 'workflow', 'automation', 'system', 'prompt',
    'model', 'analysis', 'tools', 'project', 'integration',
    'prototype', 'experiment', 'client', 'process', 'data',
    'structure', 'evaluation', 'architecture', 'pipeline', 'trigger',
    'execution', 'deployment', 'solution', 'design', 'context',
    'token', 'generation', 'response', 'instruction', 'summary',
    'api', 'json', 'cli', 'db', 'webhook',
  ],
  pairs: [
    'n8n workflow', 'workflow automation', 'automation system',
    'system integration', 'prompt workflow', 'model analysis',
    'client project', 'data analysis', 'project workflow',
    'model evaluation', 'system architecture', 'pipeline trigger',
    'api integration', 'json data', 'workflow execution',
    'n8n automation', 'n8n integration', 'prompt model',
    'tool integration', 'system design',
  ],
};

// Stage 4: Command phrases — prompt patterns
export const COMMANDS = {
  creation: [
    'create workflow',
    'create simple workflow',
    'create prototype',
    'create system',
    'create a simple prototype',
    'build a new workflow',
    'make it simpler',
    'make it shorter',
  ],
  explanation: [
    'explain step by step',
    'explain the process',
    'explain the architecture',
    'explain this system',
    'explain how this works',
    'show the simplest version',
    'show the architecture',
    'show me the workflow',
  ],
  comparison: [
    'compare these options',
    'compare two approaches',
    'compare tools',
    'compare these two',
    'what is better',
    'which approach is simpler',
  ],
  debugging: [
    'what is wrong here',
    'why does this happen',
    'how can I fix this',
    'what is the best solution',
    'what is the error',
    'find the problem',
  ],
  analysis: [
    'summarize this',
    'analyze the workflow',
    'estimate the complexity',
    'evaluate this approach',
    'what tools should I use',
    'what is the simplest approach',
  ],
};

// Stage 5: Real prompts — full sentences
export const PROMPTS = [
  'create a simple n8n workflow',
  'show the system architecture',
  'explain the process step by step',
  'compare these two approaches',
  'what is the simplest solution',
  'create a simple workflow for this task',
  'explain this step by step',
  'what is the best architecture for this',
  'show me the simplest version',
  'how can I automate this process',
  'create a prototype for this idea',
  'what tools should I use for this project',
  'compare these two tools and suggest the best one',
  'explain the workflow architecture step by step',
  'build a simple automation pipeline',
  'analyze the system and find the problem',
  'what is the simplest way to integrate this',
  'create a simple api for this workflow',
  'show me how to fix this error',
  'estimate the complexity of this project',
  'design a simple system for this use case',
  'please explain this system step by step',
  'create a simple prototype for this idea',
  'what is the simplest workflow for this project',
];

// Starter verbs — train these heavily
export const STARTER_VERBS = [
  'explain', 'create', 'show', 'compare', 'estimate',
  'analyze', 'summarize', 'build', 'find', 'fix',
  'design', 'evaluate', 'suggest', 'improve', 'simplify',
];

// All trackable keys
export const TRACKED_KEYS = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('');

// Mac keyboard layout (English only, matching MacBook Air/Pro)
export const KEYBOARD_LAYOUT = [
  // Row 1: number row
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
  // Row 2: QWERTY
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  // Row 3: home row
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
  // Row 4: bottom row (with shift placeholders)
  ['shift-l', '`', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
  // Row 5: bottom modifiers + space
  ['fn', 'ctrl', 'opt', 'cmd', ' ', 'cmd-r', 'opt-r'],
];

// Finger assignment per key
export const KEY_FINGERS = {
  '1': 'pinky-l', '2': 'ring-l', '3': 'middle-l', '4': 'index-l', '5': 'index-l',
  '6': 'index-r', '7': 'index-r', '8': 'middle-r', '9': 'ring-r', '0': 'pinky-r', '-': 'pinky-r', '=': 'pinky-r',
  '`': 'pinky-l',
  'q': 'pinky-l', 'w': 'ring-l', 'e': 'middle-l', 'r': 'index-l', 't': 'index-l',
  'y': 'index-r', 'u': 'index-r', 'i': 'middle-r', 'o': 'ring-r', 'p': 'pinky-r',
  'a': 'pinky-l', 's': 'ring-l', 'd': 'middle-l', 'f': 'index-l', 'g': 'index-l',
  'h': 'index-r', 'j': 'index-r', 'k': 'middle-r', 'l': 'ring-r', ';': 'pinky-r',
  'z': 'pinky-l', 'x': 'ring-l', 'c': 'middle-l', 'v': 'index-l', 'b': 'index-l',
  'n': 'index-r', 'm': 'index-r', ',': 'middle-r', '.': 'ring-r', '/': 'pinky-r',
  ' ': 'thumb',
  'shift-l': 'pinky-l', 'fn': 'pinky-l', 'ctrl': 'pinky-l',
  'opt': 'pinky-l', 'cmd': 'thumb', 'cmd-r': 'thumb', 'opt-r': 'pinky-r',
};

// Home keys (for visual indicator)
export const HOME_KEYS = ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'];
