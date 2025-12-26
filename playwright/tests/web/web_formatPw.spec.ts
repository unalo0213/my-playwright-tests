import { test } from "@playwright/test";
import { getConfig } from "./cms.config.js";
const config = getConfig();

test("SR_忘記+修改密碼", async ({ page }) => {
  await page.goto(process.env.WEB_LOGIN);
  await page.fill('input[name="account"]', config.phone);
  await page.click("#formLoginSubmit");
  await page.getByRole("button", { name: "忘記密碼" }).click();
  await page.getByRole("button", { name: "接收驗證碼" }).click();
  await page.getByRole("button", { name: "下一步" }).click();
  await page.getByRole("textbox", { name: "請輸入身分證" }).click();
  await page
    .getByRole("textbox", { name: "請輸入身分證" })
    .fill(config.loginId);
  await page.getByRole("button", { name: "下一步" }).click();
  await page.locator('input[name="password"]').click();
  await page.locator('input[name="password"]').fill(config.resetPassword);
  await page.locator('input[name="confirmPassword"]').click();
  await page
    .locator('input[name="confirmPassword"]')
    .fill(config.resetPassword);
  await page.getByRole("button", { name: "下一步" }).click();
  await page.getByRole("button", { name: "開啟新旅程" }).click();
});
