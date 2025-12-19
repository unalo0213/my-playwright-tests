import { Page } from "@playwright/test";

/** 前台登入 */
export async function login(page: Page) {
    await page.fill('input[name="account"]', process.env.ACCOUNT);
    await page.click('#formLoginSubmit');
    await page.fill('input[name="password"]', process.env.PASSWORD);
    // 避免登入太快
    await page.waitForTimeout(800 + Math.random() * 1200);
    await page.locator("button").filter({ hasText: "下一步" }).click();
}