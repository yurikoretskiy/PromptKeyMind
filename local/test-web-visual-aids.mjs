/**
 * PromptKeyMind web visual-aid regression tests.
 *
 * Run from the repository root with the web version served at WEB_BASE:
 *   WEB_BASE=http://127.0.0.1:8081 node local/test-web-visual-aids.mjs
 */

import { chromium } from 'playwright';
import { strict as assert } from 'assert';

const BASE = process.env.WEB_BASE || 'http://127.0.0.1:8081';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage();

try {
  await page.goto(BASE);

  const labels = await page.locator('.visual-aid-btn').allTextContents();
  assert.deepEqual(labels, ['Focus', 'Hands', 'Keyboard', 'Tutor']);
  console.log('PASS Web version exposes the four visual-aid modes');

  const assets = await page.evaluate(() => ({
    css: document.querySelector('link[href*="css/styles.css"]')?.getAttribute('href'),
    app: document.querySelector('script[src*="js/app.js"]')?.getAttribute('src'),
  }));
  assert.match(assets.css, /\?v=1\.6$/);
  assert.match(assets.app, /\?v=1\.6$/);
  console.log('PASS Web entry point versions its CSS and JavaScript assets');

  const moduleSources = await Promise.all([
    fetch(`${BASE}/js/app.js?v=1.6`).then(response => response.text()),
    fetch(`${BASE}/js/keyboard.js?v=1.6`).then(response => response.text()),
    fetch(`${BASE}/js/stages.js?v=1.6`).then(response => response.text()),
  ]);
  moduleSources.forEach(source => {
    assert.doesNotMatch(source, /from '\.\/[^']+\.js';/);
  });
  console.log('PASS Nested ES-module imports are versioned');

  if (!/^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?/.test(BASE)) {
    const cssResponse = await fetch(`${BASE}/css/styles.css?v=1.6`);
    const cacheControl = cssResponse.headers.get('cache-control') || '';
    assert.match(cacheControl, /no-cache/);
    assert.doesNotMatch(cacheControl, /immutable/);
    console.log('PASS Live CSS and JavaScript assets revalidate');
  }

  await page.getByRole('button', { name: 'Hands', exact: true }).click();
  assert.equal(await page.locator('#keyboard-container').evaluate(el => el.classList.contains('hidden')), true);
  assert.equal(await page.locator('#keyboard-with-hands').evaluate(el => el.classList.contains('hands-only')), true);
  assert.equal(await page.locator('#hand-left').evaluate(el => el.classList.contains('hidden')), false);
  assert.equal(await page.getByRole('button', { name: 'Hands', exact: true }).getAttribute('aria-pressed'), 'true');
  assert.equal(await page.evaluate(() => localStorage.getItem('promptkeymind_visual_aid')), 'hands');

  const expected = await page.locator('#typing-text .char.current').textContent();
  await page.locator('#typing-input').focus();
  await page.keyboard.press(expected === ' ' ? 'Space' : expected);
  assert.equal(await page.locator('.hand .finger.active').count(), 1);
  console.log('PASS Hands mode hides the keyboard and keeps finger guidance active');

  await page.waitForTimeout(400);
  const handsLayout = await page.evaluate(() => {
    const keyboard = document.querySelector('#keyboard-container').getBoundingClientRect();
    const left = document.querySelector('#hand-left').getBoundingClientRect();
    const right = document.querySelector('#hand-right').getBoundingClientRect();
    return {
      keyboardWidth: keyboard.width,
      gap: right.left - left.right,
      pairCenter: (left.left + right.right) / 2,
      viewportCenter: window.innerWidth / 2,
    };
  });
  assert.ok(handsLayout.keyboardWidth <= 1, `Hidden keyboard still occupies ${handsLayout.keyboardWidth}px`);
  assert.ok(handsLayout.gap >= 120 && handsLayout.gap <= 175, `Hands gap is ${handsLayout.gap}px`);
  assert.ok(
    Math.abs(handsLayout.pairCenter - handsLayout.viewportCenter) <= 10,
    `Hands are not centered: pair ${handsLayout.pairCenter}, viewport ${handsLayout.viewportCenter}`
  );
  console.log('PASS Hands mode collapses the keyboard and centers the hands');

  await page.reload();
  assert.equal(await page.getByRole('button', { name: 'Hands', exact: true }).getAttribute('aria-pressed'), 'true');
  assert.equal(await page.locator('#keyboard-container').evaluate(el => el.classList.contains('hidden')), true);
  console.log('PASS Visual-aid preference persists after reload');

  await page.getByRole('button', { name: 'Focus', exact: true }).click();
  assert.equal(await page.locator('#keyboard-with-hands').evaluate(el => el.classList.contains('hidden')), true);

  await page.getByRole('button', { name: 'Keyboard', exact: true }).click();
  assert.equal(await page.locator('#keyboard-container').evaluate(el => el.classList.contains('hidden')), false);
  assert.equal(await page.locator('#hand-left').evaluate(el => el.classList.contains('hidden')), true);

  await page.getByRole('button', { name: 'Tutor', exact: true }).click();
  assert.equal(await page.locator('#keyboard-container').evaluate(el => el.classList.contains('hidden')), false);
  assert.equal(await page.locator('#hand-left').evaluate(el => el.classList.contains('hidden')), false);
  console.log('PASS Focus, Keyboard, and Tutor modes map to the expected visual aids');
} finally {
  await browser.close();
}
