import { test, expect } from '@playwright/test';

test('landing page has correct title', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await expect(page).toHaveTitle(/HazyProductions/);
});

test('shop page loads products', async ({ page }) => {
    await page.goto('http://localhost:3000/shop');
    await expect(page.getByRole('heading', { name: 'CATALOG' })).toBeVisible();
});
