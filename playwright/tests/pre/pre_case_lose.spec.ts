import { test, expect, Page } from "@playwright/test";
import { loginAdminPre } from "@tests/base/loginAdminPre";
import { getConfig } from "@tests/pre/pre.config.js";
const config = getConfig();

test('Pre-案件戰敗', async ({ page }) => {
    await page.goto(`${process.env.ADMIN_PRE_URL}performance/inquiry`)
    await loginAdminPre(page);

    //案件
    await page.locator('svg.cursor-pointer').click();

    await page.getByRole('textbox', { name: '請輸入自然人客戶手機' }).click();
    await page.getByRole('textbox', { name: '請輸入自然人客戶手機' }).fill(config.phone);
    await page.getByRole('button', { name: '搜尋' }).click();
    await page.locator('.duration-300 > .w-6 > svg').first().click();
    await page.getByText('戰敗').click();
    await page.getByRole('combobox', { name: '請選擇' }).click();
    await page.getByRole('option', { name: '客戶取消' }).click();
    await page.getByRole('button', { name: '確認' }).click();
});