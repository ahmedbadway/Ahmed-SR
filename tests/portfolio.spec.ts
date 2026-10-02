import { test, expect } from '@playwright/test';

// End-to-end coverage for the portfolio. The server (build + vite preview) is
// started automatically by playwright.config.ts, which also serves the app
// under the GitHub-Pages base path, so every test just goes to '/'.

const PROJECT_COUNT = 10;

// Real wheel input, not a raw scrollTo jump: Lenis drives window.scrollY from
// wheel events the same way it does for a visitor.
async function wheelDown(page, steps = 12, delta = 400) {
  await page.mouse.move(200, 200);
  for (let i = 0; i < steps; i++) {
    await page.mouse.wheel(0, delta);
    await page.waitForTimeout(60);
  }
}

test.describe('page shell', () => {
  test('loads with the correct title, meta, and no horizontal overflow', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Ahmed Badway/);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /og\.jpg$/);

    const { doc, win } = await page.evaluate(() => ({
      doc: document.documentElement.scrollWidth,
      win: window.innerWidth,
    }));
    expect(doc).toBeLessThanOrEqual(win + 1);
  });

  test('ships prerendered HTML so content paints before JavaScript', async ({ request }) => {
    const res = await request.get('/');
    const html = await res.text();
    expect(html).toContain('id="work"');
    expect(html).toContain('Selected work');
    expect(html).toMatch(/rel="preload"[^>]+AbSansLatin/);
  });

  test('has no animated background layers and no canvas', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.site-backdrop')).toHaveCount(1);
    await expect(page.locator('.gradient-mesh')).toHaveCount(0);
    await expect(page.locator('canvas')).toHaveCount(0);
  });

  test('every home section exists once', async ({ page }) => {
    await page.goto('/');
    for (const id of ['hero', 'work', 'services', 'about', 'contact']) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
  });

  test('logs no errors while scrolling the whole page', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    await page.goto('/');
    await wheelDown(page, 40);
    expect(errors).toEqual([]);
  });
});

test.describe('hero', () => {
  test('primary CTA opens the Build Your Design studio', async ({ page }) => {
    await page.goto('/');
    await page.locator('#hero').getByRole('button', { name: 'Start a project' }).click();
    await expect(page).toHaveURL(/#\/build$/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Build your');
  });

  test('secondary CTA scrolls to the work grid', async ({ page }) => {
    await page.goto('/');
    await page.locator('#hero').getByRole('button', { name: 'See the work' }).click();
    await expect
      .poll(async () => page.evaluate(() => document.getElementById('work').getBoundingClientRect().top))
      .toBeLessThan(200);
  });
});

test.describe('work grid', () => {
  test('lists every project as a link to its live site', async ({ page }) => {
    await page.goto('/');
    const cards = page.locator('#work ul > li');
    await expect(cards).toHaveCount(PROJECT_COUNT);

    const first = cards.first().getByRole('link');
    await expect(first).toHaveAttribute('href', /^https:\/\//);
    await expect(first).toHaveAttribute('target', '_blank');
    await expect(first).toHaveAttribute('rel', /noopener/);
  });

  test('cards reveal once scrolled into view', async ({ page }) => {
    await page.goto('/');
    const firstCard = page.locator('#work ul > li a').first();
    await firstCard.scrollIntoViewIfNeeded();
    await expect(firstCard).toHaveAttribute('data-in', '');
    await expect(firstCard).toHaveCSS('opacity', '1');
  });

  test('filters narrow the grid and "All" restores it', async ({ page }) => {
    await page.goto('/');
    const filters = page.getByRole('group', { name: /Filter projects/ });
    const cards = page.locator('#work ul > li');

    await filters.getByRole('button', { name: /Clinics/ }).click();
    await expect(cards).toHaveCount(2);
    await expect(filters.getByRole('button', { name: /Clinics/ })).toHaveAttribute('aria-pressed', 'true');

    await filters.getByRole('button', { name: /Studios/ }).click();
    await expect(cards).toHaveCount(4);

    await filters.getByRole('button', { name: /^All/ }).click();
    await expect(cards).toHaveCount(PROJECT_COUNT);
  });

  test('every cover image loads', async ({ page }) => {
    await page.goto('/');
    await wheelDown(page, 30);
    const broken = await page.evaluate(() =>
      [...document.querySelectorAll('#work img')]
        .filter((img) => img.complete && img.naturalWidth === 0)
        .map((img) => img.currentSrc || img.src)
    );
    expect(broken).toEqual([]);
  });
});

test.describe('navigation', () => {
  test('the bar gains its surface once the page scrolls', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Primary' });
    await expect(nav).toHaveClass(/border-transparent/);
    await wheelDown(page, 4);
    await expect(nav).toHaveClass(/bg-surface/);
  });

  test('desktop links mark the section in view', async ({ page, isMobile }) => {
    test.skip(isMobile, 'desktop link row is hidden on phones');
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Primary' });
    await nav.getByRole('button', { name: 'Services' }).click();
    await expect(nav.getByRole('button', { name: 'Services' })).toHaveAttribute('aria-current', 'location');
  });

  test('mobile menu opens, links, and closes', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'the sheet only exists below md');
    await page.goto('/');
    const toggle = page.getByRole('button', { name: 'Open menu' });
    await toggle.click();
    const sheet = page.locator('#mobile-menu');
    await expect(sheet).toHaveAttribute('aria-hidden', 'false');
    await sheet.getByRole('button', { name: 'Contact' }).click();
    await expect(sheet).toHaveAttribute('aria-hidden', 'true');
    await expect
      .poll(async () => page.evaluate(() => document.getElementById('contact').getBoundingClientRect().top))
      .toBeLessThan(200);
  });
});

test.describe('language', () => {
  test('switches to Arabic with RTL and persists across reloads', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'العربية' }).first().click();
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
    await expect(page.locator('#work h2')).toHaveText('أعمال مختارة');

    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.locator('#work h2')).toHaveText('أعمال مختارة');
    await expect(page.locator('html')).not.toHaveClass(/pre-ar/);
  });
});

test.describe('contact', () => {
  test('offers WhatsApp plus direct channels', async ({ page }) => {
    await page.goto('/');
    const section = page.locator('#contact');
    await expect(section.getByRole('link', { name: 'Message on WhatsApp' })).toHaveAttribute(
      'href',
      /^https:\/\/wa\.me\/\d+$/
    );
    await expect(section.locator('a[href^="tel:"]')).toHaveCount(1);
    await expect(section.locator('a[href^="mailto:"]')).toHaveCount(1);
  });
});

test.describe('build your design studio', () => {
  test('progress and WhatsApp brief reflect the chosen options', async ({ page }) => {
    await page.goto('/#/build');
    // Capture the URL instead of letting the test leave for wa.me.
    await page.evaluate(() => {
      window.open = (url) => {
        window.__openedUrl = url;
        return null;
      };
    });
    await page.getByRole('button', { name: /Clinic \/ Medical/ }).click();
    await page.getByRole('button', { name: 'Luxury' }).click();
    await expect(page.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow', '0');

    await page.getByLabel('Your name').fill('Mona Fathy');
    await page.getByRole('button', { name: 'Send brief on WhatsApp' }).click();
    const url = decodeURIComponent(await page.evaluate(() => window.__openedUrl));
    expect(url).toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
    expect(url).toContain('Clinic / Medical');
    expect(url).toContain('Luxury');
    expect(url).toContain('Mona Fathy');
  });

  test('page-count stepper respects its bounds', async ({ page }) => {
    await page.goto('/#/build');
    const less = page.getByRole('button', { name: 'Fewer pages' });
    for (let i = 0; i < 6; i++) await less.click({ force: true });
    await expect(less).toBeDisabled();
  });
});
