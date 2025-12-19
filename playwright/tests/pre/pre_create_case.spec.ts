import { test, expect, Page } from "@playwright/test";
import { loginAdminPre } from "@tests/base/loginAdminPre";
import { getConfig } from "@tests/pre/pre.config.js";
const config = getConfig();
import dayjs from "dayjs";


test('Pre新增案件', async ({ page }) => {
    await page.goto(`${process.env.ADMIN_PRE_URL}performance/inquiry`)
    await loginAdminPre(page);

    //新增案件
    await page.locator('svg.cursor-pointer').click();
    await page.getByRole('button', { name: '新增案件' }).click();
    await page.getByRole('button', { name: '查詢' }).click();
    await page.getByRole('textbox', { name: '請輸入手機號碼' }).fill(config.phone);
    await page.getByRole('button', { name: '搜尋' }).click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: '帶入' }).click();
    await page.getByRole('combobox', { name: '請輸入車牌號碼' }).fill(config.plateNo);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await page.getByRole('button', { name: '確認' }).click();
    await page.waitForTimeout(2000);
    await page.locator('.duration-300 > .w-6 > svg').first().click();
    await page.getByText('收訂', { exact: true }).click();
    const price = await page.locator('#reservedPrice').evaluate(el => el.value.replace(/,/g, ''));
    await page.getByRole('textbox', { name: '請輸入報價金額' }).fill(price);
    await page.getByRole('textbox', { name: '請輸入成交車價' }).fill(price);
    await page.getByRole('textbox', { name: '請輸入訂金金額' }).fill(price);
    await page.getByRole('textbox', { name: 'YYYY/MM/DD' }).nth(1).fill(dayjs().format('YYYY/MM/DD'));
    await page.getByRole('button', { name: '確認' }).click();
});