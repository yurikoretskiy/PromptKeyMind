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
