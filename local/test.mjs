/**
 * PromptKeyMind — Automated browser tests
 * Tests: stage persistence, theme persistence, timer modal, typing engine
 * Run: node test.mjs (requires playwright in node_modules)
 */

import { chromium } from 'playwright';
import { strict as assert } from 'assert';

const BASE = process.env.BASE || 'http://localhost:8080';
let browser, page;
let passed = 0;
let failed = 0;

function ok(name) { passed++; console.log(`  PASS ${name}`); }
function fail(name, err) { failed++; console.log(`  FAIL ${name}: ${err}`); }

async function test(name, fn) {
  try { await fn(); ok(name); }
  catch (e) { fail(name, e.message); }
}

/**
 * Helper: create a fresh page that fast-forwards the app timer.
 * The override only fires once, preventing re-trigger loops after reset.
 */
async function createTimerPage(ctx, stageNum) {
  const tp = await ctx.newPage();
  await tp.addInitScript(() => {
    let hasFired = false;
    const orig = window.setInterval;
    window.setInterval = function(fn, ms) {
      const id = orig(fn, ms);
      if (ms === 1000 && !hasFired) {
        hasFired = true;
        // Fast-forward: exhaust 120 ticks after a short delay
        orig(() => {
          for (let i = 0; i < 125; i++) fn();
        }, 150);
      }
      return id;
    };
  });
  await tp.goto(BASE);
  await tp.waitForLoadState('domcontentloaded');
  if (stageNum) {
    await tp.evaluate((s) => localStorage.setItem('promptkeymind_stage', s), String(stageNum));
    await tp.reload();
    await tp.waitForLoadState('domcontentloaded');
  }
  await tp.waitForTimeout(200);
  return tp;
}

/** Helper: type the first char to start the timer */
async function typeFirstChar(tp) {
  await tp.locator('#typing-input').focus();
  const c = await tp.evaluate(() =>
    document.querySelector('#typing-text .char').textContent
  );
  await tp.keyboard.press(c === ' ' ? 'Space' : c);
}

/** Helper: wait for time-up modal to appear */
async function waitForModal(tp, timeout = 3000) {
  await tp.locator('#timeup-overlay').waitFor({ state: 'visible', timeout });
}

browser = await chromium.launch({ headless: true });
const context = await browser.newContext();

console.log('\nPromptKeyMind Local — Test Suite\n');

// ─── Basic Loading ───
console.log('-- Basic Loading --');
page = await context.newPage();
await page.goto(BASE);

await test('App loads without errors', async () => {
  assert.equal(await page.title(), 'PromptKeyMind');
});

await test('No external font references', async () => {
  const html = await page.content();
  assert.ok(!html.includes('googleapis'), 'Found googleapis');
  assert.ok(!html.includes('gstatic'), 'Found gstatic');
});

await test('Local font files serve correctly', async () => {
  const jb = await page.evaluate(() => fetch('/fonts/JetBrainsMono.woff2').then(r => r.status));
  const outfit = await page.evaluate(() => fetch('/fonts/Outfit.woff2').then(r => r.status));
  assert.equal(jb, 200);
  assert.equal(outfit, 200);
});

await test('All 5 stage tabs visible', async () => {
  assert.equal(await page.locator('.stage-tab').count(), 5);
});

await test('Typing area has text', async () => {
  const text = await page.locator('#typing-text').textContent();
  assert.ok(text.trim().length > 0);
});

await test('Virtual keyboard renders', async () => {
  const keys = await page.locator('.key').count();
  assert.ok(keys > 20, `Only ${keys} keys`);
});

// ─── Theme Persistence ───
console.log('\n-- Theme Persistence --');

// Clear localStorage for clean state
await page.evaluate(() => localStorage.removeItem('promptkeymind_theme'));
await page.reload();
await page.waitForLoadState('domcontentloaded');

await test('Default theme is dark', async () => {
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
});

await test('Toggle to light theme', async () => {
  await page.click('#theme-toggle');
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'light');
});

await test('Light theme persists after reload', async () => {
  await page.reload();
  await page.waitForLoadState('domcontentloaded');
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'light');
});

await page.click('#theme-toggle'); // restore dark

// ─── Stage Persistence ───
console.log('\n-- Stage Persistence --');

await test('Switch to Stage 3', async () => {
  await page.click('.stage-tab[data-stage="3"]');
  assert.ok((await page.locator('#stage-name').textContent()).includes('Stage 3'));
});

await test('Stage 3 persists after reload', async () => {
  await page.reload();
  await page.waitForLoadState('domcontentloaded');
  assert.ok((await page.locator('#stage-name').textContent()).includes('Stage 3'));
  assert.equal(await page.locator('.stage-tab.active').getAttribute('data-stage'), '3');
});

// ─── Typing Engine ───
console.log('\n-- Typing Engine --');

await page.click('.stage-tab[data-stage="1"]');
await page.waitForTimeout(200);

await test('Typing correct chars — accuracy 100%, progress > 0', async () => {
  await page.locator('#typing-input').focus();

  const chars = await page.evaluate(() => {
    const spans = document.querySelectorAll('#typing-text .char');
    return Array.from(spans).slice(0, 5).map(s => s.textContent);
  });

  for (const ch of chars) {
    await page.keyboard.press(ch === ' ' ? 'Space' : ch);
    await page.waitForTimeout(200); // slow enough for WPM calc (>600ms total)
  }

  const accuracy = await page.locator('#stat-accuracy').textContent();
  const progress = await page.locator('#stat-progress').textContent();
  assert.equal(accuracy, '100%');
  assert.ok(progress !== '0%', `Progress should advance, got ${progress}`);
});

await test('WPM updates after enough time', async () => {
  // WPM needs > 600ms elapsed. We typed 5 chars with 200ms gaps = ~1s total.
  const wpm = parseInt(await page.locator('#stat-wpm').textContent());
  assert.ok(wpm > 0, `WPM should be > 0, got ${wpm}`);
});

await test('Wrong chars show errors and drop accuracy', async () => {
  await page.click('#btn-reset');
  await page.waitForTimeout(200);
  await page.locator('#typing-input').focus();

  // Type 3 definitely-wrong chars (use symbols that can't match letters)
  for (let i = 0; i < 3; i++) {
    await page.keyboard.press('!');
    await page.waitForTimeout(50);
  }

  const accuracy = parseInt(await page.locator('#stat-accuracy').textContent());
  const incorrectCount = await page.locator('#typing-text .char.incorrect').count();
  assert.ok(incorrectCount === 3, `Expected 3 incorrect, got ${incorrectCount}`);
  assert.ok(accuracy < 100, `Accuracy should drop, got ${accuracy}%`);
});

await test('Backspace undoes last character', async () => {
  const incorrectBefore = await page.locator('#typing-text .char.incorrect').count();
  await page.keyboard.press('Backspace');
  await page.waitForTimeout(50);
  const incorrectAfter = await page.locator('#typing-text .char.incorrect').count();
  assert.equal(incorrectAfter, incorrectBefore - 1, `Expected ${incorrectBefore - 1}, got ${incorrectAfter}`);
});

// ─── Timer & Time-up Modal ───
console.log('\n-- Timer & Time-up Modal --');

await test('Timer counts down after typing starts', async () => {
  await page.click('#btn-reset');
  await page.waitForTimeout(200);
  assert.equal(await page.locator('#timer').textContent(), '2:00');

  await page.locator('#typing-input').focus();
  const ch = await page.evaluate(() => document.querySelector('#typing-text .char').textContent);
  await page.keyboard.press(ch === ' ' ? 'Space' : ch);
  await page.waitForTimeout(1500);

  assert.notEqual(await page.locator('#timer').textContent(), '2:00', 'Timer did not count down');
});

await test('Time-up modal appears when timer expires', async () => {
  const tp = await createTimerPage(context, 1);
  await typeFirstChar(tp);
  await waitForModal(tp);

  const h3 = await tp.locator('.timeup-modal h3').textContent();
  assert.ok(h3.includes("Time's up"), `Modal title wrong: ${h3}`);

  const continueBtn = await tp.locator('.timeup-actions .btn-primary').textContent();
  const nextBtn = await tp.locator('.timeup-actions .btn-secondary').textContent();
  assert.ok(continueBtn.length > 0, 'Continue button missing');
  assert.ok(nextBtn.includes('Next'), `Next button wrong: ${nextBtn}`);

  await tp.close();
});

await test('Continue button resets same stage', async () => {
  const tp = await createTimerPage(context, 2);
  await typeFirstChar(tp);
  await waitForModal(tp);

  await tp.locator('.timeup-actions .btn-primary').click();
  // Wait for modal to be removed from DOM
  await tp.locator('#timeup-overlay').waitFor({ state: 'detached', timeout: 3000 });

  const name = await tp.locator('#stage-name').textContent();
  assert.ok(name.includes('Stage 2'), `Should stay Stage 2, got: ${name}`);

  await tp.close();
});

await test('Next button advances to next stage', async () => {
  const tp = await createTimerPage(context, 2);
  await typeFirstChar(tp);
  await waitForModal(tp);

  await tp.locator('.timeup-actions .btn-secondary').click();
  await tp.waitForTimeout(500);

  const name = await tp.locator('#stage-name').textContent();
  assert.ok(name.includes('Stage 3'), `Should advance to Stage 3, got: ${name}`);

  await tp.close();
});

// ─── Vocab Page ───
console.log('\n-- Vocab Page --');

await test('Vocab page loads', async () => {
  await page.goto(`${BASE}/vocab.html`);
  await page.waitForLoadState('domcontentloaded');
  assert.ok((await page.title()).includes('Vocabulary'));
});

await test('No external font references on vocab page', async () => {
  assert.ok(!(await page.content()).includes('googleapis'));
});

// ─── Cross-stage Navigation ───
console.log('\n-- Cross-stage Navigation --');
await page.goto(BASE);
await page.waitForLoadState('domcontentloaded');

await test('Navigate all 5 stages and type in each', async () => {
  for (let stage = 1; stage <= 5; stage++) {
    await page.click(`.stage-tab[data-stage="${stage}"]`);
    await page.waitForTimeout(200);

    const name = await page.locator('#stage-name').textContent();
    assert.ok(name.includes(`Stage ${stage}`), `Expected Stage ${stage}, got: ${name}`);

    await page.locator('#typing-input').focus();
    const ch = await page.evaluate(() =>
      document.querySelector('#typing-text .char.current')?.textContent || 'a'
    );
    await page.keyboard.press(ch === ' ' ? 'Space' : ch);
    await page.waitForTimeout(100);

    const correct = await page.locator('#typing-text .char.correct').count();
    assert.ok(correct >= 1, `Stage ${stage}: no correct chars`);
  }
});

// ─── Summary ───
console.log(`\n${'='.repeat(40)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log(`${'='.repeat(40)}\n`);

await browser.close();
process.exit(failed > 0 ? 1 : 0);
