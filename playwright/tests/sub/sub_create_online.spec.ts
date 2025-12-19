import { test, expect, Page } from "@playwright/test";
import { login } from "../base/login.js";
import { getConfig } from "./sub.config.js";
const config = getConfig();

test('SUB建立訂單(官網)', async ({ page }) => {
  // 車型頁
  await page.goto(`${process.env.BASE_URL}subscription/list`);
  await page.waitForTimeout(800 + Math.random() * 1200);
  const carCard = page.locator('[id^="subscribeCarListCard-"]').first();
  await carCard.click();

  // 訂閱資訊
  await page.click("#subscribeFormMonthSelect");
  await page.getByRole('option', { name: '3個月' }).click();

  // 選擇取車站點 - 台北土城站
  await page.click("#subscribeFormDepartStationSelect");
  await page.locator('[role="option"]').filter({ hasText: config.departStation }).click();

  // 選擇取車日期
  await page.click("#subscribeFormPickUpDateButton");
  await page.waitForTimeout(500);
  await page.waitForSelector(".MuiBadge-root", { state: "visible" });

  // 最後一個可選日期
  await page.locator("button.MuiPickersDay-root:not(.Mui-disabled)").last().click();

  // 選擇取車時間
  await page.click("#subscribeFormPickUpTimeButton");
  await page.locator("button").filter({ hasText: "13:00" }).click();
  await page.click("#subscribeCarDetailSubmitButton");

  // 登入
  await login(page);

  // 滾動到條款區塊底部
  await page.fill("#subscribeCustRemark", config.note);
  const agreementAreaLocator = page.locator(".overflow-y-scroll.leading-8.border");
  await agreementAreaLocator.scrollIntoViewIfNeeded();
  await agreementAreaLocator.evaluate((element) => { element.scrollTop = element.scrollHeight; });

  // 勾選同意條款
  await page.click("#subscribeAgreementButton");

  // 點擊前往付款
  await page.click("#subscribePaymentDetailSubmitButton");

  // 通過審核後前往付款
  await page.click("#subscribePaymentPayButton");
  await page.waitForTimeout(30000);

  // 立即付款
  await page.click("#subscribePaymentPaySubmitButton");

  // 3D驗證
  if (process.env.ENV_NAME === "prod") {
    await page.pause();
  }
  if (process.env.ENV_NAME === "beta") {
    await page.fill("#pin", config.smsPin);
    await page.click("#send");
  }
});