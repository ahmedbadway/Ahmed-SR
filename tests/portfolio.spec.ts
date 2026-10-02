import { test, expect } from '@playwright/test';

// Whether the current project's device advertises a hover-capable pointer.
// The card interaction branches on exactly this, so the tests do too — the
// desktop projects satisfy it, the Mobile Chrome project does not.
const canHover = (page) =>
  page.evaluate(() => window.matchMedia('(hover: hover) and (pointer: fine)').matches);

// End-to-end coverage for the portfolio. The dev server (vite preview) is
// started automatically by playwright.config.ts, which also serves the app
// under the GitHub-Pages base path, so every test just goes to '/'.

test.describe('page shell', () => {
  test('loads with the correct title and no horizontal overflow', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Ahmed Badway/);

    const { doc, win } = await page.evaluate(() => ({
      doc: document.documentElement.scrollWidth,
      win: window.innerWidth,
    }));
    expect(doc).toBeLessThanOrEqual(win + 1);
  });

  test('has no animated background layers and no canvas', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.gradient-mesh')).toHaveCount(0);
    await expect(page.locator('canvas')).toHaveCount(0);
  });

  test('primary navigation reaches every section', async ({ page }) => {
    await page.goto('/');
    for (const id of ['about', 'projects', 'skills', 'contact']) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
  });
});

test.describe('project fan carousel', () => {
  test('renders every project card and a details panel for the centered one', async ({ page }) => {
    await page.goto('/');
    const section = page.locator('#projects');
    await section.scrollIntoViewIfNeeded();

    await expect(section.locator('.fan-card')).toHaveCount(10);
    await expect(section.locator('h3').first()).toBeVisible();
    await expect(section.getByRole('link', { name: /Live Site/i })).toBeVisible();
  });

  test('the Next arrow advances the fan (hover-capable devices)', async ({ page }) => {
    await page.goto('/');
    test.skip(!(await canHover(page)), 'no hover pointer — fan swipes instead of arrows');

    const section = page.locator('#projects');
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2200); // let the entry animation settle (worst case ~1.76s)

    const nameBefore = await section.locator('h3').first().textContent();
    await section.getByRole('button', { name: 'Next' }).click();
    await expect
      .poll(async () => section.locator('h3').first().textContent())
      .not.toBe(nameBefore);
  });

  test('the Previous arrow cycles the fan backwards (hover-capable devices)', async ({ page }) => {
    await page.goto('/');
    test.skip(!(await canHover(page)), 'no hover pointer — fan swipes instead of arrows');

    const section = page.locator('#projects');
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2200);

    const nameBefore = await section.locator('h3').first().textContent();
    await section.getByRole('button', { name: 'Previous' }).click();
    await expect
      .poll(async () => section.locator('h3').first().textContent())
      .not.toBe(nameBefore);
  });

  test('shows no arrow buttons on touch devices', async ({ page }) => {
    await page.goto('/');
    test.skip(await canHover(page), 'hover pointer — fan uses arrow buttons instead');

    const section = page.locator('#projects');
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2200);

    await expect(section.getByRole('button', { name: /Previous|Next/ })).toHaveCount(0);
  });

  test('a swipe gesture advances the fan (touch devices)', async ({ page }) => {
    await page.goto('/');
    test.skip(await canHover(page), 'hover pointer — fan uses arrow buttons instead');

    const section = page.locator('#projects');
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2200);

    const nameBefore = await section.locator('h3').first().textContent();
    // Dispatch touch-typed PointerEvents directly rather than page.mouse
    // (which emulates an actual mouse and would itself flip Chromium's
    // dynamic hover-capability detection — not something a real touch-only
    // visitor's browser would ever do).
    await page.evaluate(() => {
      const el = document.querySelector('.fan-layout');
      const rect = el.getBoundingClientRect();
      const midY = rect.top + rect.height / 2;
      const startX = rect.left + rect.width * 0.75;
      const endX = rect.left + rect.width * 0.25;
      const fire = (type, x, y) =>
        el.dispatchEvent(
          new PointerEvent(type, {
            bubbles: true,
            cancelable: true,
            pointerId: 1,
            pointerType: 'touch',
            clientX: x,
            clientY: y,
            isPrimary: true,
          })
        );
      fire('pointerdown', startX, midY);
      for (let i = 1; i <= 6; i++) fire('pointermove', startX + ((endX - startX) * i) / 6, midY);
      fire('pointerup', endX, midY);
    });

    await expect
      .poll(async () => section.locator('h3').first().textContent())
      .not.toBe(nameBefore);
  });
});

test.describe('floating build CTA', () => {
  const cta = (page) => page.locator('.fixed.bottom-6.end-6 button');

  test('is hidden at the top of the Hero, then appears past it', async ({ page }) => {
    await page.goto('/');
    await expect(cta(page)).toBeHidden();

    // Real wheel input, not a raw scrollTo jump — Lenis's smooth-scroll rAF
    // loop drives window.scrollY the same way a real visitor's scroll would.
    for (let i = 0; i < 12; i++) {
      await page.mouse.wheel(0, 400);
      await page.waitForTimeout(80);
    }
    await expect(cta(page)).toBeVisible();
  });

  test('navigates to the Build Your Design studio and then hides itself', async ({ page }) => {
    await page.goto('/');
    for (let i = 0; i < 12; i++) {
      await page.mouse.wheel(0, 400);
      await page.waitForTimeout(80);
    }
    await cta(page).click();
    await expect(page).toHaveURL(/#\/build$/);
    await expect(cta(page)).toBeHidden();
  });

  test('expands to a text pill on hover (hover-capable devices)', async ({ page }) => {
    await page.goto('/');
    test.skip(!(await canHover(page)), 'no hover pointer — CTA stays a compact circle');

    for (let i = 0; i < 12; i++) {
      await page.mouse.wheel(0, 400);
      await page.waitForTimeout(80);
    }
    const button = cta(page);
    const before = await button.boundingBox();
    await button.hover();
    await expect
      .poll(async () => (await button.boundingBox()).width)
      .toBeGreaterThan(before.width + 20);
  });

  test('stays a compact icon with no text pill on touch devices', async ({ page }) => {
    await page.goto('/');
    test.skip(await canHover(page), 'hover pointer — CTA expands on hover');

    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.2));
    const box = await cta(page).boundingBox();
    expect(box.width).toBeLessThan(70);
  });
});
