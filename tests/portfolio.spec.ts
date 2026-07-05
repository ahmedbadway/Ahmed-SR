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
    test.skip(!(await canHover(page)), 'no hover pointer — card uses the stacked layout');

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

  test('show the full stacked card with details up front (touch devices)', async ({ page }) => {
    await page.goto('/');
    test.skip(await canHover(page), 'hover pointer — card uses the flip layout');

    const card = page.locator('#projects article').first();
    await card.scrollIntoViewIfNeeded();

    // No flip on touch: the Live link and tech tags are visible with no tap.
    await expect(card.getByRole('link').first()).toBeVisible();
    await expect(card.locator('ul li').first()).toBeVisible();
  });
});
