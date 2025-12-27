import { test } from "./base/webAuth";
import { getConfig } from "./web/web.config";
const config = getConfig();

test.describe("官網_中古車預約Seed)", () => {
  //需要keep登入的，就用authPage，不用的就用page即可
  test("PRE_FE+BE", async ({ authPage }) => {
    await authPage.goto(`${process.env.BASE_URL}/preowned/list`);
    await authPage
      .locator("div")
      .filter({ hasText: /^中和營業所$/ })
      .nth(2)
      .click();
    await authPage.getByText("預約賞車").nth(1).click();
    await authPage.fill('input[name="account"]', process.env.ACCOUNT);
    await authPage.click("#formLoginSubmit");
    await authPage.fill('input[name="password"]', process.env.PASSWORD);
    // 避免登入太快
    await authPage.waitForTimeout(800 + Math.random() * 1200);
    await authPage.locator("button").filter({ hasText: "下一步" }).click();
    await authPage.getByRole("button", { name: "下一步" }).click();
    await authPage.getByRole("button", { name: "確定" }).click();
  });
});
