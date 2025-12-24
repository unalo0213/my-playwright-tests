import { test, Page } from "@playwright/test";
import { loginAdmin } from "../base/loginAdmin.js";
import { getConfig } from "./2g.config.js";
const config = getConfig();

test('2G-特殊還車', async ({ page }) => {
    // 登入
    await page.goto(`${process.env.ADMIN_2G_URL}/order`)
    await loginAdmin(page);

    //訂單查詢
    await page.locator("#react-select-instanceId-undefined-placeholder").click;
    await page.keyboard.type("出租中");
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await page.getByRole('searchbox', { name: '承租人或手機號碼' }).fill(config.phone);
    await page.getByRole('button', { name: '搜尋' }).click();
    const page1Promise = page.waitForEvent('popup');
    await page.locator('button.p-1.rounded-lg.flex.justify-center.items-center.text-white.bg-teal-default').first().click();
    const page1 = await page1Promise;
    await page1.getByRole('link', { name: '特殊還車' }).click();
    await page1.locator('div:nth-child(3) > div:nth-child(2) > div > .flex-1 > div:nth-child(2) > .w-full.relative > .px-4').click();
    await page1.getByRole('button', { name: '現在時間' }).click();
    await page1.locator('div:nth-child(5) > div > div:nth-child(2) > .w-full.relative > .px-4').first().click();
    const value = await page1.locator('p').filter({ hasText: '車機里程：' }).textContent();
    const Mileage = value.replace(/\D/g, ''); // 只取數字 "4200"
    await page1.locator('div:nth-child(5) > div > div:nth-child(2) > .w-full.relative > .px-4').first().fill(String(Mileage));
    await page1.locator('div:nth-child(6) > div:nth-child(2) > .relative > #id-undefined > .css-n73go2-control > .css-hlgwow > .css-19bb58m').click();
    await page1.getByRole('option', { name: '車輛無法定位' }).click();
    await page1.getByRole('button', { name: '特殊還車' }).click();
    await page1.getByRole('button', { name: '確定' }).click();
});