import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { colors } from '../src/theme/colors.js';

const home = await readFile(new URL('../src/assets/css/main.css', import.meta.url), 'utf8');
const palette = await readFile(new URL('../src/theme/home-palette.css', import.meta.url), 'utf8');
const declarations = (css) => Object.fromEntries([...css.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map(([, key, value]) => [key, value.trim()]));
const base = { ...declarations(home.match(/:root\s*\{([^}]+)\}/)[1]), ...declarations(palette.match(/:root\s*\{([^}]+)\}/)[1]) };
const dark = { ...base, ...declarations(palette.match(/\[data-theme='dark'\]\s*\{([^}]+)\}/)[1]) };
const resolve = (value, tokens = base, seen = new Set()) => value.replace(/var\((--[\w-]+)\)/g, (_, key) => {
  assert.ok(tokens[key], `Undefined theme token: ${key}`);
  assert.ok(!seen.has(key), `Circular theme token: ${key}`);
  return resolve(tokens[key], tokens, new Set([...seen, key]));
});
function luminance(hex) {
  let value = hex.trim().slice(1);
  if (value.length === 3) value = value.split('').map((c) => c + c).join('');
  const linear = [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16) / 255).map((c) => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return linear.reduce((sum, c, i) => sum + c * [0.2126, 0.7152, 0.0722][i], 0);
}
function contrast(a, b, tokens) {
  const first = luminance(resolve(`var(${a})`, tokens));
  const second = luminance(resolve(`var(${b})`, tokens));
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

test('shared theme keeps the established Home brand values', () => {
  assert.equal(base['--theme-color'].toLowerCase(), '#6754e9');
  assert.equal(base['--theme-color-2'].toLowerCase(), '#f15f25');
  assert.equal(base['--home-pink'].toLowerCase(), '#ffdee4');
  assert.equal(base['--home-indigo'].toLowerCase(), '#e3e8ff');
  assert.equal(base['--home-mint'].toLowerCase(), '#dbfff9');
  for (const value of Object.values(colors)) resolve(value);
});

test('normal text, buttons, soft selections and statuses meet 4.5:1 in both themes', () => {
  const pairs = [
    ['--color-ink', '--color-page'], ['--color-text', '--color-page'],
    ['--color-text', '--color-surface'], ['--color-text', '--color-surface-soft'],
    ['--color-on-soft', '--color-primary-soft'], ['--color-link', '--color-page'],
    ['--color-on-primary', '--color-primary'], ['--color-on-accent', '--color-accent'],
    ['--color-success-text', '--color-success-soft'], ['--color-error-text', '--color-error-soft'],
    ['--color-warning-text', '--color-warning-soft'],
  ];
  for (const tokens of [base, dark]) for (const [text, background] of pairs) {
    const ratio = contrast(text, background, tokens);
    assert.ok(ratio >= 4.5, `${text} on ${background}: ${ratio.toFixed(2)}:1`);
  }
});

test('focus indicators contrast with their component surfaces', () => {
  for (const tokens of [base, dark]) for (const background of ['--color-page', '--color-surface', '--color-primary-soft']) {
    assert.ok(contrast('--color-focus', background, tokens) >= 3);
  }
});

test('component-owned styles do not introduce literal color palettes', async () => {
  async function scan(directory) {
    const files = [];
    for (const item of await readdir(directory, { withFileTypes: true })) {
      const path = new URL(item.name + (item.isDirectory() ? '/' : ''), directory);
      if (item.isDirectory()) files.push(...await scan(path));
      else if (/\.(jsx?|css)$/.test(item.name)) files.push(path);
    }
    return files;
  }
  const files = await scan(new URL('../src/component/', import.meta.url));
  files.push(new URL('../src/assets/Hooks/Authstyles.js', import.meta.url), new URL('../src/assets/css/QuizRunner.css', import.meta.url));
  for (const file of files) {
    const source = await readFile(file, 'utf8');
    assert.doesNotMatch(source, /#[\da-f]{3,8}\b/i, `Literal color in ${file.pathname}`);
    assert.doesNotMatch(source, /linear-gradient\(/, `Independent gradient in ${file.pathname}`);
  }
});
