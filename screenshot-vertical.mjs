import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3002');
  await page.waitForTimeout(2000);

  // Click the vertical button
  await page.click('[title="Vertical Timeline"]');
  await page.waitForTimeout(1000);

  await page.screenshot({ path: 'screenshot-vertical.png', fullPage: true });
  await browser.close();
  console.log('Screenshot saved to screenshot-vertical.png');
})();
