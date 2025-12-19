import { test, expect, Page } from "@playwright/test";
import { loginAdminPre } from "@tests/base/loginAdminPre";
import { getConfig } from "@tests/pre/pre.config.js";
const config = getConfig();

test('Pre-出售退訂', async ({ page }) => {
    //新增案件
    await page.goto(`${process.env.ADMIN_PRE_URL}performance/sales`)
    await loginAdminPre(page); await page.locator('.cursor-pointer > path:nth-child(2)').click();

    await page.locator('svg.cursor-pointer').click();
    await page.locator('.w-6.h-6.flex.justify-center.items-center.cursor-pointer').first().click();
    await page.fill("#cancelReason", config.note);
    await page.getByRole('button', { name: '退訂' }).click();
});