import { test, expect, Page } from "@playwright/test";
import { loginAdmin } from "../base/loginAdmin.js";
import { getConfig } from "./sub.config.js";
const config = getConfig();
import dayjs from "dayjs";

test('SUB訂單還車流程', async ({ page }) => {
    // 登入
    await page.goto(`${process.env.ADMIN_CASHIER_URL}subscribeSearchOrder`)
    await loginAdmin(page);

    // 查詢訂單
    await page.click("#orderStatusSelect");
    await page.locator("//li[contains(., '已出車未還車')]").click();
    await page.fill("#idNoInput", config.loginId);
    await page.click("#subscribeSearchOrderSearchBtn");

    // 處理跳轉頁
    const orderurl = page.waitForEvent('popup');
    await page.click(".cursor-pointer.text-blue-system")
    const page1 = await orderurl;

    // tab1-訂單資訊
    await page1.click("#subscribeReturnTab1_RightBtn");

    // 電子
    if (process.env.ENV_NAME === "prod") {
        await page1.click("#startReturnTaskBtn");
        await page1.reload();
        await page1.click("#subscribeReturnTab1_RightBtn");
        await page1.click("#subscribeReturnTab2_RightBtn");
    }
    // 紙本
    if (process.env.ENV_NAME === "beta") {
        await page1.click("#returnCarInfoWarningModalConfirmButton");
        const date = dayjs().format('YYYY/MM/DD');
        const hours = dayjs().add(24, 'hour').format('HH');
        const minutes = dayjs().format('mm');
        await page1.fill("#returnDatePicker", date);
        await page1.click("#returnTimePicker");
        await page1.fill("#returnTimePicker-hours", hours);
        await page1.fill("#returnTimePicker-minutes", minutes);
        await page1.click("#timePickerConfirmButton");
        const Mileage = await page1.locator('div.align-middle.inline-block').nth(7).innerText();
        await page1.fill("#returnMileageInput", Mileage);
        await page1.click('#returnInfoDoneBtn');
        await page1.waitForTimeout(500);
    }

    // etag free
    await page1.click("#subscribePriceInfoDetailButton");
    await page1.locator('.flex-1.text-center', { hasText: '第一期' }).click();
    await page1.click("#onBehalfOfIncomeGroupByCategoryETag_1");
    await page1.click("#extraFeeModalMenuItem_onBehalfOfIncomeGroupByCategoryETag_1");
    await page1.fill("#noPaymentReason", '請忽略-內部員工測試用');
    await page1.click("#patchETagDialogConfirmButton");
    await page1.locator("button").filter({ hasText: "關閉" }).click();
    await page1.click("#subscribeReturnTab2_RightBtn");

    // 開始還車
    await page1.click("#subscribeReturnTab3_RightBtn");
    await page1.fill("#returnMemberId", config.memberId);
    await page1.waitForTimeout(1500);
    await page1.click("#returnPrintModalConfirmButton");
    await page1.waitForTimeout(500);
});