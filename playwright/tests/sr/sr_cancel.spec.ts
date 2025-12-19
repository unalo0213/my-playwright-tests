import { test, expect, Page } from "@playwright/test";
import { loginAdmin } from "../base/loginAdmin.js";
import { getConfig } from "./sr.config.js";
const config = getConfig();

test('SR取消訂單', async ({ page }) => {
  // 登入
  await page.goto(`${process.env.ADMIN_CASHIER_URL}searchOrder`)
  await loginAdmin(page);

  // 查詢訂單
  await page.click("#orderStatusSelect");
  await page.locator("//li[contains(., '未出車')]").click();
  await page.fill("#idNoInput", config.loginId);
  await page.click("#searchOrderFilterSearchBtn");

  // 處理跳轉頁
  const orderurl = page.waitForEvent('popup');
  await page.click("#editBtn_1");
  const page1 = await orderurl;

  // 取消訂單
  await page1.click("#departCancelOrderBtn");
  await page1.click("#departCancelDialogCalculateFeeBtn");
  await page1.fill("#departCancelDialogReasonInput", config.note);
  await page1.click("#departCancelDialogConfirmBtn");
});