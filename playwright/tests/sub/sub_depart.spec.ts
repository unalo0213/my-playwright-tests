import { test, expect, Page } from "@playwright/test";
import { loginSub } from "../base/loginSub.js";
import { loginAdmin } from "../base/loginAdmin.js";
import { getConfig } from "./sub.config.js";
const config = getConfig();

test('SUB訂單出車流程', async ({ page }) => {
  // 登入
  const suburl = (`${process.env.ADMIN_CASHIER_URL}subscribeSearchOrder`)
  await page.goto(suburl);
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

  // tab1-建立契約
  await page1.click("#createCarContractButton");
  await page1.click("#createCarContractConfirmButton");
  await page1.click("#subscribeDepartNextStepOneBtn");

  // tab2-出車資訊
  await page1.click("#setNowTimeButton");
  await page1.waitForTimeout(1000);
  await page1.fill("#departMileageInput", "1");
  const value1 = await page1.locator('div.text-sm.text-right.text-red-system').innerText();
  const match1 = value1.match(/\d+/);
  const Mileage = match1 ? match1[0] : '';
  await page1.fill("#departMileageInput", String(Mileage));
  await page1.click("#dispatchInfoDoneBtn");
  await page1.waitForTimeout(1000);

  // tab2 - 產生sms url
  await page1.click("#generateOrCopyShortUrlButton");
  await page1.click("#specifyPriceInfoConfirmButton");
  await page1.getByRole('button', { name: '複製' }).click();
  const copiedUrl = await page1.evaluate(async () => await navigator.clipboard.readText());
  await page1.goto(copiedUrl);

  // Web-sms pay
  await loginSub(page1);
  await page1.click("#subscribePaymentPaySubmitButton");
  await page1.fill("#pin", config.smsPin);
  await page1.click("#send");
  await page1.waitForTimeout(1000);

  // 回到出車頁面
  await page1.goto(suburl);
  await page1.click("#orderStatusSelect");
  await page1.locator("//li[contains(., '已訂車')]").click();
  await page1.fill("#idNoInput", config.loginId);
  await page1.click("#subscribeSearchOrderSearchBtn");

  // 處理跳轉頁
  const orderurl2 = page1.waitForEvent('popup');
  await page1.click(".cursor-pointer.text-blue-system")
  const page2 = await orderurl2;
  await page2.click("#subscribeDepartNextStepOneBtn");
  await page2.waitForTimeout(500)
  await page2.click("#subscribeDepartNextStepTwoBtn");

  // 開立發票
  await page2.click("#addNewInvoiceButton");
  await page2.click("#invoiceInfoModalConfirmButton");

  // 確認結帳
  await page2.click("#departConfirmPaymentAndInvoiceButton");

  // 電子出車+簽電子合約
  if (process.env.ENV_NAME === "prod") {
    const orderurl3 = page2.waitForEvent('popup');
    await page2.getByText('查看所有合約/訂單資料', { exact: true }).click();
    const page3 = await orderurl3;
    await page3.getByRole('button', { name: '上傳附件' }).click();
    const uploadfile1 = config.uploadfile; // 絕對路徑
    await page3.setInputFiles('input[type="file"][name="file"]', uploadfile1);
    await page3.getByRole('textbox', { name: '請輸入檔案名稱' }).fill(config.note);
    await page3.getByRole('button', { name: '確認上傳' }).click();
    const orderurl4 = page3.waitForEvent('popup');
    await page3.locator('p.text-blue-system.cursor-pointer.hover\\:underline', { hasText: /^M2025/ }).click();
    const page4 = await orderurl4;
    await page4.click("#subscribeDepartNextStepOneBtn")
    await page4.click("#subscribeDepartNextStepTwoBtn")
    await page4.getByRole('button', { name: '開始點車' }).click();
    await page4.click("#electronicRentalFormRadio");
    await page4.click("#chooseRentalFormNextButton");
    await page4.getByRole('button', { name: '關閉視窗' }).click();
  }

  // 紙本出車
  if (process.env.ENV_NAME === "beta") {
    await page2.locator("button").filter({ hasText: "開始點車" }).click();
    await page2.click("#paperRentalFormRadio");
    await page2.click("#chooseRentalFormNextButton");
    // 上傳出租單
    const uploadfile = config.uploadfile; // 絕對路徑
    await page2.setInputFiles('input[type="file"][name="file"]', uploadfile);
    await page2.waitForTimeout(3000);
    await page2.fill("#departMemberSearch", config.memberId);
    await page2.waitForTimeout(6000);
    await page2.click("#uploadRentalFormAndDepartConfirmButton");
    await page2.waitForTimeout(6000);
  }
});