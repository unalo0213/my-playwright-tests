import { test, expect, Page } from "@playwright/test";
import { loginAdmin } from "../base/loginAdmin.js";
import { getConfig } from "./sr.config.js";
const config = getConfig();
import dayjs from "dayjs";

test('SR建立訂單(本國人)', async ({ page }) => {
  // 登入
  await page.goto(`${process.env.ADMIN_CASHIER_URL}createOrder`)
  await loginAdmin(page);

  // 溫馨提醒
  await page.locator("button").filter({ hasText: "確認" }).click();

  // 訂單來源
  await page.click("#createOrder_Source");
  await page.locator("//li[contains(., '預約-臨櫃門市')]").click();

  // 訂車資訊
  const departTime = dayjs().add(20, "day").format('YYYY/MM/DD 12:00')
  await page.fill("#createOrder_departDate_inputPicker", departTime);
  await page.click('.createOrder_departStation');
  await page.keyboard.type(config.departStation);
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1000);

  const returnTime = dayjs().add(21, "day").format('YYYY/MM/DD 12:00')
  await page.fill("#createOrder_returnDate_inputPicker", returnTime);
  await page.click("#createOrder_returnStation");
  await page.keyboard.type(config.returnStation);
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1000);

  // 歸屬類別 
  await page.click("#createOrder_carLevel");
  await page.locator("//li[contains(., 'A-魅力都會小型車')]").click();

  // 訂車資訊 儲存綠色勾勾
  await page.click('.createOrder_carInfo_editButton');

  //  關閉
  await page.locator("button").filter({ hasText: "關閉" }).click();

  // 訂車人資訊
  await page.fill("#createOrder_CustomerInfo_id", config.loginId);
  await page.waitForTimeout(2000);
  await page.click("#EditGroupActionDone");
  await page.waitForTimeout(4000);

  // 承租人!=駕駛人
  await page.locator("#createOrder_Driver_Id_0").click();
  await page.locator("#createOrder_Driver_Id_0").fill(config.loginId);
  await page.waitForTimeout(2000);
  await page.click("#EditGroupActionDone");
  await page.waitForTimeout(4000);

  // 新增活動折扣 addSpecialFeeButton
  await page.click("#addSpecialFeeButton");

  // 活動種類 specialFeeReasonSelect
  await page.click("#specialFeeReasonSelect");
  await page.locator("//li[normalize-space(text())='其他-0元租金']").click();

  // 備註 
  await page.fill("#specialFeeOtherReasonInput", config.note);

  // 確認 specialFeeModalConfirmButton
  await page.click("#specialFeeModalConfirmButton");

  // 新增訂單
  await page.click('.createOrder_submit_button');
  await page.locator("button").filter({ hasText: "是" }).click();
  await page.waitForTimeout(1500);
});