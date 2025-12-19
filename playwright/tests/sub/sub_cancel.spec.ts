import { test, expect, Page } from "@playwright/test";
import { loginAdmin } from "../base/loginAdmin.js";
import { getConfig } from "./sub.config.js";
const config = getConfig();

test('SUB取消訂單流程', async ({ page }) => {
  // 登入
  await page.goto(`${process.env.ADMIN_CASHIER_URL}subscribeSearchOrder`);
  await loginAdmin(page);

  // 查詢訂單
  await page.click("#orderStatusSelect");
  await page.locator("//li[contains(., '已訂車')]").click();
  await page.fill("#idNoInput", config.loginId);
  await page.click("#subscribeSearchOrderSearchBtn");

  // 處理跳轉頁
  const orderurl = page.waitForEvent('popup');
  await page.click(".cursor-pointer.text-blue-system")
  const page1 = await orderurl;

  // 取消訂單
  await page1.locator("#subscribeDepartCancelOrderBtn").click();
  await page1.fill('[name="remark"]', config.note);
  await page1.getByRole("button", { name: "完成退訂" }).click();
  await page1.waitForTimeout(500);
});







