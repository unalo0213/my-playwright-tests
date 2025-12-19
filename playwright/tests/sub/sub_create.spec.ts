import { test, expect, Page } from "@playwright/test";
import { loginSub } from "../base/loginSub.js";
import { loginAdmin } from "../base/loginAdmin.js";
import { getConfig } from "./sub.config.js";
const config = getConfig();

test('SUB建立訂單流程', async ({ page }) => {
  // 登入
  await page.goto(`${process.env.ADMIN_CASHIER_URL}subscribeCreate`);
  await loginAdmin(page);

  // 訂車人資訊
  await page.fill("#subscribeCreateOrderCustomerLoginId", config.loginId);
  await page.waitForTimeout(1000);
  await page.click("#subscribeCreateOrderCustomerSubmit");
  await page.waitForTimeout(1000);

  // 訂車資訊
  await page.fill("#subscribeCreateOrderExpectDepartStation", config.departStation);
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(500);
  await page.fill("#subscribeCreateOrderExpectReturnStation", config.returnStation);
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(500);
  await page.fill("#subscribeCreateOrderPlateNo", config.plateNo);
  await page.waitForTimeout(1500);
  // await page.click("#mui-component-select-needAutoCredit");
  // await page.locator("//li[contains(., '否')]").click();
  // await page.fill('[name="autoCreditBypassReason"]', config.note);
  await page.click("#subscribeCreateOrderCarSubmit");
  await page.waitForTimeout(500);

  // 建立訂單
  await page.click("#subscribeCreateOrderSubmit");
  await page.click("#confirmDialogConfirmButton");
  await page.waitForTimeout(3000);

  // 開分頁官網付保證金
  await page.goto(`${process.env.BASE_URL}member/order?tabStatus=sub&searchType=OPEN`);
  await page.waitForTimeout(500);
  await loginSub(page);

  // 點擊前往繳款
  await page.waitForTimeout(500);
  await page.locator("#subscribeOrderPayFeeButton").click();

  // 立即付款
  await page.click("#subscribePaymentPaySubmitButton");

  // 輸入OTP
  await page.fill("#pin", config.smsPin);
  await page.waitForTimeout(1000 + Math.random() * 6000); // 隨機暫停等待手動輸入驗證碼
  await page.click("#send");
  await page.waitForTimeout(500);

  // 印出訂單編號
  // const metaUrl = await page.getAttribute('meta[property="og:url"]', 'content');
  // const orderNo = new URL(metaUrl).searchParams.get('orderNo');
});