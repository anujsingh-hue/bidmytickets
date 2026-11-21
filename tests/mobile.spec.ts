import { expect, test, type Page } from '@playwright/test';

async function assertNoOverflow(page: Page, section: string, width: number) {
  const overflow = await page.evaluate(() =>
    Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth
  );
  expect(overflow, section + ' overflow at ' + width).toBeLessThanOrEqual(1);
}

for (const width of [320, 375, 390, 768, 1024, 1280]) {
  test('responsive concept site at ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({width, height: 850});
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto('/');
    await expect(page.getByRole('heading', {level:1})).toContainText('Every ticket');
    await expect(page.getByText('NO SIGN-UP. NO REAL TICKETS. JUST THE IDEA.')).toBeVisible();
    await assertNoOverflow(page,'hero',width);

    if (width <= 700) {
      await page.getByRole('button', {name:'Open menu'}).click();
      await expect(page.getByRole('navigation', {name:'Main navigation'}).getByRole('link',{name:'How it works'})).toBeVisible();
      await page.getByRole('button', {name:'Close menu'}).click();
    }
    await page.getByRole('link', {name:'Explore the demo'}).click();
    await expect(page.getByRole('heading', {level:2}).first()).toContainText('Find your');
    await assertNoOverflow(page,'marketplace',width);

    await page.getByRole('button',{name:'Buses',exact:true}).click();
    await expect(page.locator('.ticket-card')).toHaveCount(1);
    await page.getByRole('button',{name:/Preview Bhopal to Indore Sleeper/}).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText('₹1,039')).toBeVisible();
    await dialog.getByRole('button',{name:/Try a sample bid/}).click();
    await expect(dialog.getByText('₹1,089')).toBeVisible();
    await dialog.getByRole('button',{name:'Close preview'}).click();
    await expect(dialog).toBeHidden();
    await assertNoOverflow(page,'dialog closed',width);
    expect(errors).toEqual([]);
  });
}
