import { test, request, expect } from "@playwright/test";
import { getConfig } from "./sr.config.js";
import webLoginToken from "@tests/base/webLoginToken.js";
const config = getConfig();


test.describe('SR計價驗證Case)', () => {
    test('SR-FE+BE', async ({ page, request }) => {
        await webLoginToken(page)
        await page.goto('https://www.beta.car-plus.cool/srental/search');
        await page.getByRole('checkbox', { name: '甲租乙還' }).check();
        await page.getByRole('textbox', { name: '請選擇站點' }).nth(1).click();
        await page.getByText('桃園市').nth(1).click();
        await page.locator('span').filter({ hasText: '桃園高鐵站' }).click();
        await page.waitForTimeout(500);
        await page.locator('button.MuiButton-root.MuiButton-text').nth(2).click();
        await page.getByRole('button', { name: '29' }).first().click();
        await page.waitForTimeout(500);
        await page.getByRole('button', { name: '30' }).first().click();

        //選車型
        await page.locator("button").filter({ hasText: "選擇車型" }).first().click();

        //選配件
        await page.locator('#srentalAccessoryItem-A01 #cpCounterMinus').click();
        await page.locator('#srentalAccessoryItem-A02 #cpCounterMinus').click();
        await page.locator('#srentalAccessoryItem-A03 #cpCounterMinus').click();
        await page.locator('#srentalAccessoryItem-A04 #cpCounterMinus').click();
        await page.locator('#srentalAccessoryItem-A05 #cpCounterMinus').click();
        await page.click('#srentalExtraInfoNextButton');

        // // 加駕駛人 (需要驗證時在打開)
        // await page.click('#srentalAddDriverButton');
        // await page.fill('#driverFormFullName', '哈囉');
        // await page.click('#driverFormBirthday_year');
        // await page.getByRole('option', { name: '2002' }).click();
        // await page.click('#driverFormBirthday_month');
        // await page.getByRole('option', { name: '01' }).click();
        // await page.click('#driverFormBirthday_day');
        // await page.getByRole('option', { name: '01' }).click();
        // await page.fill('#driverFormPhone', '0944213085');
        // await page.fill('#driverFormEmail', '085@g.com');
        // await page.fill('#driverFormAddress', '085');
        // await page.fill('#driverFormLoginId1', 'A181717152');
        // await page.fill('#driverForEmergencyContactName', '囉哈');
        // await page.fill('#srentalDriverFormEcCell', '0944213344');
        // await page.fill('#driverFormFullName', '哈囉');
        // await page.click('#emergencyContactDesc');
        // await page.getByRole('option', { name: '姊姊' }).click();
        // await page.click('#srentalDriverFormSubmit');

        // 換安免
        //await page.getByRole('checkbox', { name: '尊榮方案' }).click();

        // 我同意
        await page.click('#srentalAgreeNoticeCheckbox');
        await page.click('#srentalDriverInfoNextStep');

        // 選優惠券&租車券
        await page.waitForTimeout(500);
        await page.getByText('請選擇').click();
        await page.getByRole('img').nth(1).click();
        await page.locator('button:enabled', { hasText: '兌換' }).click();
        await page.click('#invoiceCategoryPaperCheckbox');

        const items = [
            { key: 'diffRegionPrice', label: '甲租乙還' },
            { key: 'noDuty', label: '安心免責' },
            { key: 'periodOff', label: '早鳥優惠' },
            { key: 'vipOff', label: 'VIP優惠' },
            { key: 'accessoryA01', label: 'GPS' },
            { key: 'accessoryA02', label: '安全座椅' },
            { key: 'accessoryA03', label: '增高墊' },
            { key: 'accessoryA04', label: '行車紀錄器' },
            { key: 'accessoryA05', label: '活氧殺菌清淨機' },
            { key: 'couponOff', label: '優惠券' },
            { key: 'rentalCouponList', label: '租車券' },
            { key: 'cashDiscountable', label: '門市付款' },
            { key: 'rentalAmt', label: '總金額' }
        ];

        const apiMap = {
            diffRegionPrice: api => api.data.diffRegionPrice,
            noDuty: api => api.data.noDuty.totalFee,
            periodOff: api => api.data.periodOff.discount,
            vipOff: api => api.data.vipOff.discount,
            rentalAmt: api => api.data.rentalAmt,
            accessory: (api, key) => {
                const code = key.replace('accessory', '');
                return api.data.accessory.accessories
                    .find(x => x.code.trim() === code)?.price;
            },
            cashDiscountable: api => api.data.accessory?.totalPrice,
            couponOff: api => api.data.couponOff?.discount,
            rentalCouponList: api => api.data.rentalCouponInfo?.totalDiscount,
        };

        const [apiRes] = await Promise.all([page.waitForResponse(
            r => r.url().includes("/common/srental/v1/order/calculation") && r.status() === 200),
        page.reload()
        ]);
        const apiBody = await apiRes.json();

        await page.reload();

        for (const item of items) {
            let priceLocator;
            if (item.key === 'rentalAmt') {
                priceLocator = page.getByText(item.label).locator('..').locator('strong')
                //priceLocator = page.locator(`xpath=//p[normalize-space(.)='${item.label}']/following-sibling::strong`);

            } else if (item.key === 'cashDiscountable') {
                priceLocator = page.locator(`xpath=//p[normalize-space(.)='${item.label}']/ancestor::div[2]//span[contains(@class,'font-semibold')]`);

            } else if (item.key === 'couponOff') {
                priceLocator = page.locator(`xpath=//p[normalize-space(.)='${item.label}']/ancestor::div[1]//span[contains(@class,'text-red-system')]`);

            } else {
                priceLocator = page.locator(`xpath=//span[contains(normalize-space(.),'${item.label}')]/following-sibling::span[contains(@class,'block')]`);
            }

            // 如果沒有這個 item 就跳過
            if (await priceLocator.count() === 0) {
                console.log(`⚠️ 無此欄位：${item.label}`);
                continue; // 跳過本次迴圈
            }

            const raw = await priceLocator.first().textContent();
            const webFee = Number(raw.replace(/[^\d]/g, ''));
            let apiFee;

            if (item.key.startsWith('accessory')) {
                // 這裡呼叫通用 accessory handler
                apiFee = apiMap.accessory(apiBody, item.key) || 0;
            } else {
                apiFee = apiMap[item.key](apiBody) || 0;
            }

            // console.log(item.label, webFee, apiFee);

            if (webFee === apiFee) {
                console.log(`✅ PASS：${item.label} 一致 Web=${webFee} API=${apiFee}`);
            } else {
                console.error(`❌ FAIL：${item.label} 不一致 Web=${webFee} API=${apiFee}`);
            }
        }
    });
}); 