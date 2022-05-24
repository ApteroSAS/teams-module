
//const { test, expect } = require('@playwright/test');
//https://dev.to/anishkny/code-coverage-for-a-nextjs-app-using-playwright-tests-18n7
import { test, expect } from './baseFixtures';

test('get.webgl.org', async ({ page }) => {
    await page.goto('https://get.webgl.org/');
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('load');
    await page.screenshot({ path: './coverage/store/webgl.png' });
});