import { test, expect } from "@playwright/test";
import { getToken } from "../base/getToken.js";
import { getHeader_memberId } from "../base/getHeader_memberId.js";
import { getOtherPhone } from "../base/getOtherPhone.js";
import { getConfig } from "./cms.config.js";
import { getPhone } from "../base/getPhone.js";
const config = getConfig();
const systemKind = 'CASHIER';

test.describe('SR_修改會員電話Case', () => {
    test('修改門號', async ({ request }) => {
        console.log("Step1:取得當前門號");
        const token = await getToken(request);
        const headers = getHeader_memberId(systemKind, token);
        const currentPhone = await getPhone(request, headers, config);
        console.log('✅當前門號：', currentPhone);

        console.log("Step2:輸入修改門號");
        const targetPhone = getOtherPhone(currentPhone);
        const query2Url = `${process.env.INTERNAL_ADMIN_AUTH}/v1/users/query?mainCell=${targetPhone}&nationalCode=${config.nationalCode}`;
        const query2Res = await request.post(query2Url, { headers });
        const query2ResBody = await query2Res.json();
        expect(query2Res.ok()).toBeTruthy();
        console.log('✅修改門號：', targetPhone);

        console.log("Step3:發送驗證碼");
        const sendUrl = `${process.env.INTERNAL_ADMIN_AUTH}/v1/users/mainCell/sendVerifyCode`;
        const sendData = {
            "nationalCode": config.nationalCode,
            "mainCell": targetPhone,
            "smsType": "master"
        }
        const sendRes = await request.post(sendUrl, { headers, data: sendData });
        expect(sendRes.ok()).toBeTruthy();
        const sendResBody = await sendRes.json();
        console.log(`✅驗證碼已發送至:`, targetPhone);

        console.log("Step4:取得驗證碼");
        const verifyUrl = `${process.env.INTERNAL_ADMIN_AUTH}/v1/users/currentVerifyCode?mainCell=${targetPhone}&nationalCode=${config.nationalCode}`;
        const verifyRes = await request.get(verifyUrl, { headers });
        expect(verifyRes.ok()).toBeTruthy();
        const verifyResBody = await verifyRes.json();
        const verifyCode = verifyResBody.data.code;
        if (verifyResBody.message === 'OK') {
            console.log(`✅驗證碼為:${verifyResBody.data.code} `);
        }

        console.log("Step5:送出修改門號");
        const resetUrl = `${process.env.INTERNAL_ADMIN_AUTH}/v1/users/${config.acctId}/mainCell/change`;
        const resetData = {
            "nationalCode": config.nationalCode,
            "mainCell": targetPhone,
            "code": verifyCode,
        }
        const resetRes = await request.post(resetUrl, { headers, data: resetData });
        expect(resetRes.ok()).toBeTruthy();
        const resetResBody = await resetRes.json();

        if (resetResBody.message === 'OK') {
            console.log(`✅門號修已變更: ${targetPhone}`);
        }
        else {
            throw new Error(`❌門號修改失敗: ${resetResBody.message}`);
        }
    });
});
