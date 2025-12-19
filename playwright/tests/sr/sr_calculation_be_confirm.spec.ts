import { test, expect } from "@playwright/test";
import { login } from "../base/login.js";
import { getConfig } from "./sr.config.js";
const config = getConfig();

const testCases = [
    {
        name: '登入取toCtoken',
    },
    {
        name: '驗證periodOff公式',
    },
    {
        name: '驗證vipOff公式',
    },
];
test.describe('SR計價驗證Case)', () => {
    for (const tc of testCases) {
        test(tc.name, async ({ page, request }) => {
            if (tc.name === '登入取toCtoken') {
                await page.goto(process.env.WEB_LOGIN);
                await login(page);
                const res = await page.waitForResponse((resp) =>
                    resp.url().includes("/common/auth/v3/users/login")
                );
                const c_Headers = res.headers();
                c_Token = c_Headers["x-authorization"]; //指定給外層變數
                //console.log(`token`, Token);
            }

            if (tc.name === '驗證Calculation公式') {
                const srUrl = `${process.env.COMMON_SRENTAL}/v1/order/calculation`;
                const srHeaders = {
                    'Content-Type': 'application/json',
                    'x-authorization': c_Token,
                    'x-paltform': 'WEB',
                    'x-system-kind': 'OFFICIAL',
                }
                // timestamp 13碼
                const bookingDay = 10;
                const now = Date.now();
                const oneDayMs = 24 * 60 * 60 * 1000;
                const from = now + (bookingDay * oneDayMs);
                const to = from + (bookingDay * oneDayMs);
                const fromDay = from.toString();
                const toDay = to.toString();
                const fromStList = ['217', '201'];
                const toStList = ['217', '201'];
                const carModelList = ['D0001'];
                const qtyList = ['1', '2', '3', '4'];
                for (const fromStation of fromStList) {
                    for (const toStation of toStList) {
                        for (const carModel of carModelList) {
                            for (const qty of qtyList) {
                                const srData = {
                                    "from": fromDay,
                                    "to": toDay,
                                    "fromStationCode": fromStation,
                                    "toStationCode": toStation,
                                    "carModelCode": carModel,
                                    "couponSequenceId": null,
                                    "accessories": [
                                        { "code": "A01", "qty": qty },
                                        { "code": "A02", "qty": qty },
                                        { "code": "A03", "qty": qty },
                                        { "code": "A04", "qty": qty },
                                        { "code": "A05", "qty": qty }
                                    ],
                                    "noDuty": [2],
                                    "premiumNoDuty": false,
                                    "notTwIpLang": false,
                                    "isRocDriverLicense": true
                                };
                                const srRes = await request.post(srUrl, { headers: srHeaders, data: srData });
                                const srBody = await srRes.json();
                                const vipDiscount = srBody.data?.vipOff?.discount;
                                expect(srRes.ok()).toBeTruthy();
                                if (srBody.message === 'OK') {
                                    console.log(`✅去：${fromStation},回:${toStation},配件量:${qty},vip優惠：${vipDiscount}`);
                                }
                                else {
                                    console.log(`❌Fail: ${srBody.message}`);
                                }
                            }
                        }
                    }
                }
            }
        });
    };
});