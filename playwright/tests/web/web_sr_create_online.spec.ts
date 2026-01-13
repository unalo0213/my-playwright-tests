import { test } from "@playwright/test";
import { login } from "../base/login";
import { getConfig } from "./web.config";
const config = getConfig();
import dayjs from "dayjs";


test("SR建立訂單(官網)", async ({ page }: { page: Page }) => {
  if (process.env.ENV_NAME === "prod") {
    await page.goto(process.env.BASE_URL);

    //選站點
    const pickupStation = page.locator("#pickupStation");
    await pickupStation.click();
    await pickupStation.fill(config.departStation);
    await page.locator("#stationItem-0").click();

    //選日期
    await page.click("#searchInputFromDate");
    await page.locator("#dateCell span", { hasText: "17" }).nth(2).click();
    await page.click("#searchInputToDate");
    await page.locator("#dateCell span", { hasText: "18" }).nth(2).click();
    await page.click("#searchRentalCarConfirm");
    await page
      .locator("button")
      .filter({ hasText: "選擇車型" })
      .first()
      .click();
  }

  if (process.env.ENV_NAME === "beta") {
    await page.goto(`${process.env.BASE_URL}/srental/search`);
    const tomorrow = dayjs().add(1, 'day').format('/MM/DD');
    await page.getByRole("button", { name: tomorrow }).click();
    await page.getByRole("button", { name: "29" }).first().click();
    await page.waitForTimeout(500);
    await page.getByRole("button", { name: "30" }).first().click();
    await page.waitForTimeout(500);
    await page
      .locator("button")
      .filter({ hasText: "選擇車型" })
      .first()
      .click();
  }
  // 登入
  await login(page);

  // 配件頁
  await page.click("#srentalExtraInfoNextButton");

  // 駕駛人頁&同意
  await page.getByRole("button", { name: /我已閱讀並同意/ }).click();
  await page.locator("#srentalDriverInfoNextStep").click();

  // 優惠券頁
  await page.click("#srentalPaymentDetailNextButton");

  // 付款頁
  await page.click("#srentalPaymentPaySubmitButton");

  // 3D驗證
  if (process.env.ENV_NAME === "prod") {
    await page.pause();
  }
  if (process.env.ENV_NAME === "beta") {
    await page.fill("#pin", config.smsPin);
    await page.click("#send");
  }

  //查看訂單
  await page.click("#memberOrderButton");
  await page.getByText("訂單明細").first().click();
  await page.getByText("取消訂單").click();
  await page.getByText("取消訂單").nth(2).click();
  await page.waitForTimeout(1000);
});
