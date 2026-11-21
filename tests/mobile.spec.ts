import { expect, test, type Page } from '@playwright/test';

async function assertNoOverflow(page: Page, section: string, width: number) {
  const overflow = await page.evaluate(() =>
    Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth
  );
  expect(overflow, section + ' overflow at ' + width).toBeLessThanOrEqual(1);
}

for (const width of [320, 375, 390, 768, 1024, 1280]) {
  test('premium bidding arena at ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({width, height: 850});
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto('/');
    await expect(page.getByRole('heading', {level:1})).toContainText('Every ticket');
    await assertNoOverflow(page,'hero',width);
    if (width <= 700) {
      await page.getByRole('button', {name:'Open menu'}).click();
      await expect(page.getByRole('navigation', {name:'Main navigation'}).getByRole('link',{name:'How it works'})).toBeVisible();
      await page.getByRole('button', {name:'Close menu'}).click();
    }
    await page.getByRole('link', {name:'Explore the demo'}).click();
    await page.getByRole('button',{name:'Buses',exact:true}).click();
    await expect(page.locator('.ticket-card')).toHaveCount(1);
    await page.getByRole('button',{name:'Enter bidding arena for Bhopal to Indore Sleeper'}).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('heading',{name:'Bhopal to Indore Sleeper'})).toBeVisible();
    await expect(dialog.getByText('₹1,039')).toBeVisible();
    await expect(dialog.getByTestId('arena-timer')).toContainText(':');
    await assertNoOverflow(page,'bid arena open',width);
    await dialog.getByRole('button',{name:'₹1,139'}).click();
    await expect(dialog.getByLabel('Or enter your own amount')).toHaveValue('1139');
    await dialog.getByRole('button',{name:/Place demo bid/}).click();
    await expect(dialog.getByText('₹1,139').first()).toBeVisible();
    await expect(dialog.getByRole('status')).toContainText('now leading');
    await expect(dialog.getByText('You · demo visitor')).toBeVisible();
    await dialog.getByLabel('Or enter your own amount').fill('1');
    await dialog.getByRole('button',{name:/Place demo bid/}).click();
    await expect(dialog.getByRole('status')).toContainText('Enter a whole-rupee amount');
    await dialog.getByRole('button',{name:/Reset simulation/}).click();
    await expect(dialog.getByText('₹1,039')).toBeVisible();
    await dialog.getByRole('button',{name:'Close bidding arena'}).click();
    await expect(dialog).toBeHidden();
    await assertNoOverflow(page,'bid arena closed',width);

    await page.getByRole('button',{name:'Flights',exact:true}).click();
    await page.getByRole('button',{name:/Preview Delhi to Bengaluru/}).click();
    await expect(page.getByRole('dialog').getByText('This is a visual-only ticket category.')).toBeVisible();
    await expect(page.getByRole('dialog').getByRole('button',{name:/Place demo bid/})).toHaveCount(0);
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toBeHidden();
    expect(errors).toEqual([]);
  });
}
