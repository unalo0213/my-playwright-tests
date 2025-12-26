import { Page } from "@playwright/test";
import { getConfig } from "../web/web.config.js";
const config = getConfig();

/** SSO綁定 */
export async function ssoBind(page: Page) {
  await page.getByRole("combobox", { name: "國家代碼" }).click();
  await page.getByRole("option", { name: "台灣 +" }).click();
  await page.getByRole("textbox", { name: "*手機號碼" }).click();
  await page.getByRole("textbox", { name: "*手機號碼" }).fill(config.phone);
  await page.getByRole("button", { name: "取得驗證碼" }).click();
  //await page.getByRole("button", { name: "關聯/建立帳號" }).click();
  await page.getByRole("textbox", { name: "請輸入身分證" }).click();
  await page
    .getByRole("textbox", { name: "請輸入身分證" })
    .fill(config.loginId);
  await page.getByRole("button", { name: "下一步" }).click();
}
