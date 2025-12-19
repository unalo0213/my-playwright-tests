import { test, expect, Page } from "@playwright/test";
import { loginAdmin } from "../base/loginAdmin.js";
import { getConfig } from "./sr.config.js";
const config = getConfig();

test('SR訂單還車', async ({ page }) => {
  // 登入
  await page.goto(`${process.env.ADMIN_CASHIER_URL}searchOrder`)
  await loginAdmin(page);

  // 查詢訂單
  await page.click("#orderStatusSelect");
  await page.locator("//li[contains(., '已出車未還車')]").click();
  await page.fill("#idNoInput", config.loginId);
  await page.click("#searchOrderFilterSearchBtn");

  // 處理跳轉頁
  const orderurl = page.waitForEvent('popup');
  await page.click("#editBtn_1");
  const page1 = await orderurl;

  // tab1-去tab2
  await page1.click("#returnConfirmButton");

  // 電子
  if (process.env.ENV_NAME === "beta") {
    // etag
    await page1.click("#paymentLinkButton");
    await page1.click("#eTagPaymentSelect");
    await page1.locator("//li[normalize-space()='不收款']").click();
    await page1.click("#etagPaymentModalConfirmButton");
    // 完成收款
    await page1.click("#returnConfirmButton");
    await page1.click("#returnConfirmButton");
    await page1.click("#returnPrintModalConfirmButton");
    await page1.waitForTimeout(500);
  }
  // 紙本
  if (process.env.ENV_NAME === "prod") {
    //await page1.locator('button:has(svg)').nth(1).click();
    const mileage = await page1.locator('div.align-middle.inline-block').nth(7).textContent();
    await page1.locator('#returnMileageInput').fill(mileage.trim());
    await page1.click("#returnCarNowButton");
    await page1.click("#returnCarDoneButton");
    await page1.click("#returnCarConfirmButton");
    // tab2-去tab3
    await page1.getByRole('button', { name: '好的' }).click();
    await page1.click("#returnConfirmButton");
    // etag
    await page1.click("#paymentLinkButton");
    await page1.click("#eTagPaymentSelect");
    await page1.locator("//li[normalize-space()='不收款']").click();
    await page1.click("#etagPaymentModalConfirmButton");
    // 完成收款
    await page1.click("#returnConfirmButton");
    await page1.click("#returnPrintModalConfirmButton");
    // 上傳出租單
    const uploadfile = config.uploadfile; // 絕對路徑
    await page1.setInputFiles('input[type="file"][name="file"]', uploadfile);
    await page1.waitForTimeout(1000);
    await page1.click("#returnPrintModalConfirmButton");
    await page1.waitForTimeout(1000);
    // 還車成功
    await page1.click('#returnPrintModalConfirmButton');
  }
});