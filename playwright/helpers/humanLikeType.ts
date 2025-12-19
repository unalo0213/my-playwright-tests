import { Page } from "@playwright/test";

/** 創建模擬人類輸入的輔助函數 */
export async function humanLikeType(
  page: Page,
  selector: string,
  text: string
) {
  await page.locator(selector).click();
  await page.waitForTimeout(100 + Math.random() * 200); // 隨機等待

  // 逐字輸入，模擬真實打字速度
  for (const char of text) {
    await page
      .locator(selector)
      .type(char, { delay: 80 + Math.random() * 120 });
  }
}
