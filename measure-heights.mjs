import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3002');
  await page.waitForTimeout(2000);

  // Measure horizontal mode
  const horizontalHeight = await page.evaluate(() => {
    const pill = document.querySelector('.liquid-pill');
    return pill ? pill.getBoundingClientRect().height : 0;
  });

  // Switch to vertical mode
  await page.click('[title="Vertical Timeline"]');
  await page.waitForTimeout(1000);

  // Measure vertical mode
  const verticalHeight = await page.evaluate(() => {
    const pill = document.querySelector('.liquid-pill');
    return pill ? pill.getBoundingClientRect().height : 0;
  });

  console.log('Horizontal mode height:', horizontalHeight + 'px');
  console.log('Vertical mode height:', verticalHeight + 'px');
  console.log('Difference:', Math.abs(horizontalHeight - verticalHeight) + 'px');
  console.log('Are they equal?', horizontalHeight === verticalHeight);

  await browser.close();
})();
