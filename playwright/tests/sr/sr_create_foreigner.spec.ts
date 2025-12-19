import { test, expect, Page } from "@playwright/test";
import { loginAdmin } from "../base/loginAdmin.js";
import { getConfig } from "./sr.config.js";
const config = getConfig();
import dayjs from "dayjs";

test('SR建立訂單(外國人)', async ({ page }) => {

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
  await page.locator('.MuiSelect-select').nth(3).click();
  await page.getByRole('option', { name: '否' }).click();
  await page.waitForTimeout(1000);
  await page.getByRole('combobox', { name: '請選擇護照國籍' }).click();
  await page.getByRole('option', { name: '美國' }).click();
  // 護照id
  const id = dayjs().format('YYYYMMDDHH');
  await page.locator('.MuiInputBase-input.MuiOutlinedInput-input').nth(18).fill(id);
  // 姓名
  await page.locator('.MuiInputBase-input.MuiOutlinedInput-input').nth(19).fill(`外國${id}`);
  // 性別
  await page.locator('.MuiInputBase-input.MuiOutlinedInput-input').nth(20).click();
  await page.getByRole('option', { name: '女' }).click();
  await page.getByText('選擇年').first().click();
  await page.getByRole('option', { name: '1984-民國(73)年' }).click();
  await page.getByText('月').first().click();
  await page.getByRole('option', { name: '02' }).click();
  await page.getByText('日').nth(1).click();
  await page.getByRole('option', { name: '15' }).click();
  await page.locator('.MuiInputBase-input.MuiOutlinedInput-input').nth(24).fill(`${id}@gmail.com`);
  await page.getByRole('checkbox', { name: '訂車人同駕駛人' }).check();
  await page.locator('rect').nth(0).click();
  await page.locator('rect').nth(1).click();

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

  // 處理跳轉頁
  const orderurl = page.waitForEvent('popup');
  await page.locator("button").filter({ hasText: "取消訂單" }).click();
  const page1 = await orderurl;

  // 取消訂單
  await page1.click("#departCancelOrderBtn");
  await page1.click("#departCancelDialogCalculateFeeBtn");
  await page1.fill("#departCancelDialogReasonInput", config.note);
  await page1.click("#departCancelDialogConfirmBtn");

  // 去CMS刪除帳號
  await page1.goto(`${process.env.ADMIN_CMS_URL}user/carPlus`)
  await page1.click('#idType');
  await page1.locator("//li[contains(., '護照')]").click();
  await page1.fill('#loginId', id);
  await page1.getByRole('button', { name: '立即搜尋' }).click();
  await page1.getByRole('button', { name: 'btn-menu-dot' }).click();
  await page1.getByText('會員明細').click();
  await page1.getByRole('tab', { name: '黑名單管理' }).click();

  // 先拉黑
  await page1.getByRole('button', { name: '加入黑名單' }).click();
  await page1.locator('#addReason').fill(config.note);
  await page1.getByRole('button', { name: '確認' }).click();

  // 刪帳號+略過180天
  await page1.getByRole('button', { name: '刪除黑名單帳號' }).click();
  await page1.fill('#reason', config.note);
  await page1.click('#syncFace');
  await page1.getByRole('button', { name: '確認' }).click();
  await page1.waitForTimeout(500);
});