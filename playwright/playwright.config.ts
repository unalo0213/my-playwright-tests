// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface EnvFileMap {
  [key: string]: string;
}

const envFileMap: EnvFileMap = {
  prod: ".env.prod",
  beta: ".env.beta",
  int: ".env.int",
};

const envName: string = process.env.ENV_NAME || "beta"; // default
console.log(`✅ENV_NAME`, process.env.ENV_NAME);
dotenv.config({
  path: path.resolve(__dirname, envFileMap[envName]),
});
/** 如果找不到 .env 檔案則提示使用者 */
if (!process.env.ACCOUNT || !process.env.PASSWORD) {
  console.error("----- 請確認已經執行過 yarn setup 並且設定好 .env ------");
  process.exit(1);
}

if (
  process.env.ACCOUNT === "your_account_here" ||
  process.env.PASSWORD === "your_account_here"
) {
  console.error("----- 請確認已將 .env 帳號調整為自身帳號 ------");
  process.exit(1);
}

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  timeout: 40000,
  testDir: "./tests",
  fullyParallel: true,
  reporter: [
    ["list"], // 終端機看到進度
    ["html", { open: "never" }], // 產出 HTML 報告
  ],

  globalSetup: path.resolve(__dirname, "tests/base/webLoginToken.ts"),
  /* 並行執行所有測試文件 */
  use: {
    baseURL: "https://www.beta.car-plus.cool",
    storageState: "auth.json",
    headless: false,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    permissions: ["clipboard-read", "clipboard-write"],
  },

  /* 配置多個瀏覽器項目 */
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 800 },
        launchOptions: {
          headless: true, // 後台用這個
          //headless: false, // Google OAuth 必須 headful
          args: [
            "--start-maximized",
            "--disable-blink-features=AutomationControlled",
          ],
        },
      },
    },
  ],
});
