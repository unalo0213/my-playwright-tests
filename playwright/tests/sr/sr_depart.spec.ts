import { test, expect, Page } from "@playwright/test";
import { loginAdmin } from "../base/loginAdmin.js";
import { getConfig } from "./sr.config.js";
const config = getConfig();
import dayjs from "dayjs";

test('SR訂單出車', async ({ page }) => {
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

  // tab1-去tab2
  await page1.click("#departNextStepOneBtn");

  // tab2-出車資訊 
  await page1.click("#departConfirmTabsClearOrUpdateNowButton");

  // 自動排車
  if (process.env.ENV_NAME === "prod") {
    const autoNo = await page1.locator('span.text-xl.text-red-system').textContent();
    await page1.locator('#departConfirmTabsPlateNo').fill(autoNo.trim());
    await page1.click("#EditGroupActionDone");
  }
  // 人工排車
  if (process.env.ENV_NAME === "beta") {
    await page1.locator('#departConfirmTabsPlateNo').fill(config.plateNo);
    await page1.waitForTimeout(500);
    await page1.click("#EditGroupActionDone");
    await page1.fill("#carPlanUseDiffDesc", config.note);
    await page1.click("#orderCarInfoMismatchConfirmBtn");
  }

  // tab2-去tab3
  await page1.click("#departNextStepTwoBtn");

  // 電子
  if (process.env.ENV_NAME === "beta") {
    await page1.click("#departConfirmButton");
    await page1.click("#electronicRentalFormRadio");
    await page1.click("#rentTypeSelectionModalConfirmButton");
    await page1.getByRole('button', { name: '關閉' }).first().click();
    await page1.waitForTimeout(500);
  }
  // 紙本
  if (process.env.ENV_NAME === "prod") {
    await page1.click("#departConfirmButton");
    await page1.click("#paperRentalFormRadio");
    await page1.click("#rentTypeSelectionModalConfirmButton");
    // 輸入出租單號
    const Date = dayjs().format('YYYY/MM/DD');
    await page1.locator("#rentalFormNoInput").fill(Date);
    // 上傳出租單
    const uploadfile = config.uploadfile; // 絕對路徑
    await page1.setInputFiles('input[type="file"][name="file"]', uploadfile);
    await page1.click("#rentTypeSelectionModalConfirmButton");
    await page1.waitForTimeout(500);
    // 出車成功
    await page1.click('#etagInfoModalConfirmButton');
  }
});