import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { chromium } from "@playwright/test";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function webLoginToken() {
    const authFilePath = path.resolve(__dirname, "../../auth.json");

    if (fs.existsSync(authFilePath)) {
        console.log("✅ auth.json 已存在，跳過 webLoginToken");
        return;
    }

    console.log("auth.json 不存在，開始自動登入抓 webToken...");

    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(process.env.WEB_LOGIN);
    await page.fill('input[name="account"]', process.env.ACCOUNT);
    await page.click('#formLoginSubmit');
    await page.fill('input[name="password"]', process.env.PASSWORD);
    await page.locator("button", { hasText: "下一步" }).click();

    // 等待前端真正完成登入：通常會呼叫 /users/profile 或 /me
    await page.waitForResponse(resp =>
        resp.url().includes("/users/profile") && resp.status() === 200
    );

    // 儲存「完整 storageState」（含 cookies / localStorage）
    await context.storageState({ path: authFilePath });

    console.log("✅ webLoginToken 完成，auth.json 已建立");
    await browser.close();
}
