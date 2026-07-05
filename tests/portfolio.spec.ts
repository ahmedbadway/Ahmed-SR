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

  test('renders the GradientMesh background and no leftover canvas', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.gradient-mesh')).toHaveCount(1);
    // The old ParticleField canvas background was removed.
    await expect(page.locator('canvas')).toHaveCount(0);
  });

  test('primary navigation reaches every section', async ({ page }) => {
    await page.goto('/');
    for (const id of ['about', 'projects', 'skills', 'contact']) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
  });
});

test.describe('project cards', () => {
  test('flip to reveal details on hover (hover-capable devices)', async ({ page }) => {
    await page.goto('/');
    test.skip(!(await canHover(page)), 'no hover pointer — card flips on tap instead');

    const card = page.locator('#projects article').first();
    await card.scrollIntoViewIfNeeded();

    const inner = card.locator('> div');
    const before = await inner.evaluate((el) => getComputedStyle(el).transform);
    await card.hover();
    // Wait for the 0.6s flip transition to move the transform off identity.
    await expect
      .poll(async () => inner.evaluate((el) => getComputedStyle(el).transform))
      .not.toBe(before);
  });

  test('flip to reveal details on tap (touch devices)', async ({ page }) => {
    await page.goto('/');
    test.skip(await canHover(page), 'hover pointer — card flips on hover instead');

    const card = page.locator('#projects article').first();
    await card.scrollIntoViewIfNeeded();

    const inner = card.locator('> div');
    const before = await inner.evaluate((el) => getComputedStyle(el).transform);
    await card.tap();
    // Wait for the 0.6s flip transition to finish and settle on the fully
    // rotated matrix (poll until two consecutive reads agree).
    await expect
      .poll(async () => inner.evaluate((el) => getComputedStyle(el).transform))
      .not.toBe(before);
    await page.waitForTimeout(700);
    const after = await inner.evaluate((el) => getComputedStyle(el).transform);

    // Tapping the Live Site link on the flipped-open back face must not
    // toggle the flip back — it should only follow the link.
    await card.getByRole('link').first().tap({ trial: true });
    expect(await inner.evaluate((el) => getComputedStyle(el).transform)).toBe(after);
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
