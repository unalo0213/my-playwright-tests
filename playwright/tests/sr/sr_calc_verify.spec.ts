import { test, expect } from '@playwright/test';
import { login } from "../base/login.js";

import fs from 'fs';
import path from 'path';
import { getConfig } from "./sr.config.js";
const config = getConfig();

const testCases = [
    {
        name: 'VipOff',
    },
    {
        name: 'periodOff',
    },
];
test.describe('SR計價驗證Case)', () => {
    for (const tc of testCases) {
        test(tc.name, async ({ page, request }) => {
            // auth.json 路徑
            const authPath = path.resolve('auth.json');  // 根據你的實際路徑調整

            // 讀檔
            const authRaw = fs.readFileSync(authPath, 'utf-8');
            const authJson = JSON.parse(authRaw);

            // 取得 token
            const tokenStr = authJson.origins[0].localStorage[0].value;
            const tokenObj = JSON.parse(tokenStr);
            const c_Token = tokenObj.state.token;

            console.log('取得 token:', c_Token);

            if (tc.name === 'VipOff') {
                // 定義你所有 VIP 等級的 Rate
                const vipRateTable = {
                    VIP0: { weekday: 10, holiday: 15, festival: 20 },
                    VIP1: { weekday: 26.5536723, holiday: 35.9605911, festival: 50.0 },//rentLevel4
                    VIP2: { weekday: 30, holiday: 40, festival: 60 },
                    GOLD: { weekday: 35, holiday: 45, festival: 65 }
                };
                // 一次跑所有 VIP level
                for (const vipLevel of Object.keys(vipRateTable)) {
                    const vipRate = vipRateTable[vipLevel];
                    console.log(`\n========== 測試 VIP 等級：${vipLevel} ==========`);

                    // 呼叫 API（如需要可改成每次變更參數）                                
                    const res = await request.post(`${process.env.COMMON_SRENTAL}/v1/order/calculation`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'x-authorization': c_Token,
                            'x-paltform': 'WEB',
                            'x-system-kind': 'OFFICIAL'
                        },
                        data: {
                            "from": 1771741800000,
                            "to": 1772346600000,
                            "fromStationCode": "217",
                            "toStationCode": "821",
                            "carModelCode": "A0001",
                            "couponSequenceId": null,
                            "accessories": [
                                { "code": "A01", "qty": 1 },
                                { "code": "A02", "qty": 3 },
                                { "code": "A03", "qty": 3 },
                                { "code": "A04", "qty": 1 },
                                { "code": "A05", "qty": 1 }
                            ],
                            "noDuty": [2],
                            "premiumNoDuty": false,
                            "notTwIpLang": false,
                            "isRocDriverLicense": true
                        }
                    });
                    expect(res.status()).toBe(200);
                    const data = (await res.json()).data;

                    // calendarType → rate mapping
                    const rateMap = {
                        WEEKDAY: vipRate.weekday,
                        HOLIDAY: vipRate.holiday,
                        FESTIVAL: vipRate.festival,
                    };

                    let calcTotal = 0;

                    for (const day of data.priceDateList) {
                        const type = day.calendarType;
                        const original = day.originalPrice;
                        const apiFee = day.vipOffFee;
                        const rate = rateMap[type];

                        if (rate === undefined) {
                            throw new Error(`未定義 calendarType=${type} 在 VIP=${vipLevel} 的 rate`);
                        }

                        const expected = Math.round(original * (rate / 100));

                        if (expected !== apiFee) {
                            console.error(`
❌ VIP Fee 不一致（${vipLevel} / ${day.date}）
- CalendarType：${type}
- OriginalPrice：${original}
- Rate：${rate}
- 計算值：${expected}
- API 回傳值：${apiFee}
`);
                        } else {
                            console.log(`✅ ${vipLevel} / ${day.date} 正確：${apiFee}`);
                        }

                        calcTotal += apiFee;
                    }

                    // 最後驗證 VIP 總折扣
                    const apiTotal = data.vipOff.discount;
                    if (calcTotal !== apiTotal) {
                        throw new Error(`
❌ VIP 總折扣錯誤（VIP=${vipLevel}）
計算總額：${calcTotal}
API 回傳值：${apiTotal}
`);
                    }

                    console.log(`🎉 VIP=${vipLevel} 全部通過！折扣總額：${apiTotal}`);
                };
            };
        });
    };
});