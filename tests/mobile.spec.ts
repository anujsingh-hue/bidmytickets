import { expect, test, type Page } from '@playwright/test';

async function assertNoHorizontalOverflow(page: Page, section: string, width: number) {
  const overflow = await page.evaluate(() =>
    Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth
  );
  expect(overflow, `${section}: unexpected horizontal overflow at ${width}px`).toBeLessThanOrEqual(1);
}

for (const width of [320, 375, 390, 768, 1024, 1280]) {
  test(`responsive demo flows at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 860 });
    const runtimeErrors: string[] = [];
    page.on('pageerror', err => runtimeErrors.push(err.message));

    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Your Ticket.');
    await assertNoHorizontalOverflow(page, 'home', width);

    await page.getByRole('button', { name: 'Explore Auctions' }).last().click();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Explore');
    await assertNoHorizontalOverflow(page, 'explore', width);

    await page.getByRole('button', { name: /View Ticket/ }).first().click();
    await expect(page.getByRole('button', { name: /Place Demo Bid/ })).toBeVisible();
    await assertNoHorizontalOverflow(page, 'ticket details', width);

    await page.getByRole('button', { name: /List Ticket/ }).first().click();
    await expect(page.getByRole('button', { name: /Save Demo Listing/ })).toBeVisible();
    await assertNoHorizontalOverflow(page, 'sell ticket form', width);

    await page.getByRole('button', { name: 'Dashboard', exact: true }).click();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Dashboard');
    await assertNoHorizontalOverflow(page, 'dashboard', width);

    expect(runtimeErrors, 'Uncaught browser errors').toEqual([]);
  });
}
