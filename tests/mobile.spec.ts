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
    await page.getByRole('link', {name:'Explore auctions'}).click();
    await page.getByRole('button',{name:'Campus',exact:true}).click();
    await expect(page.locator('.ticket-card')).toHaveCount(1);
    await page.getByRole('button',{name:'Enter bidding arena for Campus Culture Night'}).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('heading',{name:'Campus Culture Night'})).toBeVisible();
    await expect(dialog.locator('.arena-current-number')).toHaveText('₹699');
    await expect(dialog.getByTestId('arena-timer')).toContainText(':');
    await assertNoOverflow(page,'bid arena open',width);
    await dialog.getByRole('button',{name:'₹799'}).click();
    await expect(dialog.getByLabel('Or enter your own amount')).toHaveValue('799');
    await dialog.getByRole('button',{name:/Place bid/}).click();
    await expect(dialog.locator('.arena-current-number')).toHaveText('₹799');
    await expect(dialog.getByRole('status')).toContainText('now leading');
    await expect(dialog.getByText('Campus Member · You')).toBeVisible();
    await dialog.getByLabel('Or enter your own amount').fill('1');
    await dialog.getByRole('button',{name:/Place bid/}).click();
    await expect(dialog.getByRole('status')).toContainText('Enter a whole-rupee amount');
    await dialog.getByRole('button',{name:/Reset simulation/}).click();
    await expect(dialog.locator('.arena-current-number')).toHaveText('₹699');
    await dialog.getByRole('button',{name:'Close bidding arena'}).click();
    await expect(dialog).toBeHidden();
    await assertNoOverflow(page,'bid arena closed',width);

    await expect(page.getByRole('button',{name:'Flights',exact:true})).toHaveCount(0);
    await expect(page.getByRole('button',{name:'Buses',exact:true})).toHaveCount(0);
    await page.getByRole('button',{name:'Campus Member',exact:true}).click();
    await expect(page.getByRole('heading',{name:'Welcome back, Campus Member'})).toBeVisible();
    await page.getByRole('button',{name:'Sign out'}).click();
    await page.getByLabel('Display name').fill('Test');
    await page.getByLabel('Sample password').fill('1234');
    await page.getByRole('dialog').getByRole('button',{name:'Sign in',exact:true}).click();
    await expect(page.getByRole('alert')).toContainText('at least five letters');
    await page.getByLabel('Display name').fill('Tester');
    await page.getByLabel('Sample password').fill('12345');
    await page.getByRole('dialog').getByRole('button',{name:'Sign in',exact:true}).click();
    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(page.getByRole('button',{name:'Tester',exact:true})).toBeVisible();
    expect(errors).toEqual([]);
  });
}
