import { test, expect, Page } from "@playwright/test";
import { loginAdminPre } from "@tests/base/loginAdminPre";
import { getConfig } from "@tests/pre/pre.config.js";
const config = getConfig();
import dayjs from "dayjs";

test('Pre-新增出售', async ({ page }) => {
    await page.goto(`${process.env.ADMIN_PRE_URL}performance/sales`)
    await loginAdminPre(page);

    //新增出售
    await page.locator('svg.cursor-pointer').click();
    await page.getByRole('button', { name: '新增' }).click();
    await page.getByRole('button', { name: '查詢' }).click();
    await page.getByRole('textbox', { name: '請輸入自然人客戶手機' }).fill(config.phone);
    await page.getByRole('button', { name: '搜尋' }).click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: '帶入' }).first().click();

    //輸入里程
    const Mileage = await page.locator('#car\\.currentMileage').evaluate(el => el.value.replace(/,/g, ''));
    await page.getByRole('textbox', { name: '請輸入出售里程' }).fill(Mileage);
    await page.click("#estimatedDeliveryDate");
    const Date1 = dayjs().format('YYYY/MM/DD');
    await page.locator("#estimatedDeliveryDate").fill(Date1);
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: '儲存' }).click();
    await page.waitForTimeout(1000);

    //新增付款
    await page.getByRole('button', { name: '新增付款資訊' }).click();
    const price = await page.locator('#inquiry\\.contractPrice').evaluate(el => el.value.replace(/,/g, ''));
    await page.getByRole('textbox', { name: '請輸入刷卡金額' }).fill(price);
    const Date = dayjs().format('YYYY/MM/DD');
    await page.getByRole('textbox', { name: 'YYYY/MM/DD' }).fill(Date);
    await page.getByRole('textbox', { name: '請輸入信用卡號(末四碼)' }).fill(dayjs().format('MMDD'));
    await page.getByRole('textbox', { name: '請輸入銀行授權碼' }).fill(dayjs().format('YYYYMMDD'));
    await page.getByRole('textbox', { name: '請輸入批次號碼' }).fill(dayjs().format('MMDD'));
    await page.getByText('檔案上傳').click();
    const uploadfile = '/Users/K2108/Desktop/圖/4.png'; // 絕對路徑
    await page.setInputFiles('input[type="file"]', uploadfile);
    await page.getByRole('button', { name: '新增' }).click();
    await page.waitForTimeout(1000);

    // 送審
    await page.getByRole('button', { name: '送審' }).click();
    await page.waitForTimeout(500);
});