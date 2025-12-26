import { Page } from "@playwright/test";

/** 後台登入 */
export async function loginAdmin(page: Page) {
    await page.fill('[name="account"]', process.env.ADMIN_ACCOUNT);
    await page.fill('[name="password"]', process.env.ADMIN_PASSWORD);
    await page.getByRole('button', { name: '登入' }).click();
}