import { test, expect } from "@playwright/test";
import { login } from "../base/login.js";
import { ssoBind } from "../base/ssoBind.js";
import { getToken } from "../base/getToken.js";
import { getHeader_memberId } from "../base/getHeader_memberId.js";
import { getConfig } from "./cms.config.js";
const config = getConfig();

const testCases = [
    {
        name: 'FB登入',
    },
    {
        name: 'Google登入',
    },
    {
        name: 'LINE登入',
    },
    {
        name: 'APPLE登入',
    },
    {
        name: '3rd解綁',
    }
];
test.describe('官網_3rd登入)', () => {
    for (const tc of testCases) {
        test(tc.name, async ({ page, request }) => {
            if (tc.name === 'FB登入') {
                await page.goto(process.env.WEB_LOGIN);
                await page.getByRole('button').nth(3).click();
                await page.fill('#email', config.mail_account);
                await page.fill('#pass', config.mail_password);
                await page.click('#loginbutton');
                await page.getByRole('button', { name: '以杉肆的身分繼續' }).click();
                await page.getByRole('textbox', { name: '請輸入身分證' }).click();
                await page.getByRole('textbox', { name: '請輸入身分證' }).fill(config.loginId);
                await page.getByRole('button', { name: '下一步' }).click();
                console.log('FB綁定完成&登入成功');
            }
            if (tc.name === 'Google登入') {
                await page.addInitScript(() => {
                    Object.defineProperty(navigator, "webdriver", {
                        get: () => undefined,
                    });
                });
                await page.goto(process.env.WEB_LOGIN);
                await page.getByRole('button').nth(4).click();
                await page.fill('#identifierId', config.mail_account);
                await page.click('#identifierNext');
                await page.fill('input[type="password"]', config.mail_password);
                await page.click('#passwordNext');
                await ssoBind(page);
                console.log('Google綁定完成&登入成功');
            }
            if (tc.name === 'LINE登入') {
                await page.goto(process.env.WEB_LOGIN);
                await page.getByRole('button').nth(5).click();
                await page.getByRole('button', { name: '點擊開啟 line 帳號繼續' }).click();
                //自已點QR code登入
                await ssoBind(page);
                console.log('Line綁定完成&登入成功');
            }
            if (tc.name === 'APPLE登入') {
                await page.goto(process.env.WEB_LOGIN);
                await page.getByRole('button').nth(2).click();
                await page.fill('#account_name_text_field', config.mail_account);
                await page.click('#sign-in');
                await page.fill('#password_text_field', config.mail_password);
                await page.click('#sign-in');
                await page.getByRole('button', { name: 'Trust', exact: true }).click();
                await page.locator("button").filter({ hasText: "Continue" }).click();
                await ssoBind(page);
                console.log('Apple綁定完成&登入成功');
            }
            if (tc.name === '3rd解綁') {
                const token = await getToken(request);
                const systemKind = 'CMS';
                const headers = getHeader_memberId(systemKind, token);
                const baseUrl = `${process.env.INTERNAL_ADMIN_AUTH}//v1/users/social/deleteAccount`;
                const socialTypes = ['line', 'google', 'facebook', 'apple'];
                for (const type of socialTypes) {
                    const data = {
                        "acctId": config.acctId,
                        "corporationEnum": "CARPLUS",
                        "socialType": type
                    };
                    const res = await request.post(baseUrl, { headers: headers, data: data });
                    const body = await res.json();
                    if (body.message === 'OK') {
                        console.log(`刪除${type} 結果:`, await res.json());
                    }
                }
            }
        });
    };
});