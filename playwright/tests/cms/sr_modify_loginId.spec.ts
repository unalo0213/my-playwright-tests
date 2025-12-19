import { test, expect } from "@playwright/test";
import { getToken } from "@tests/base/getToken.js";
import { getHeader_memberId } from "@tests/base/getHeader_memberId.js";
import { getOtherLoginId } from "@tests/base/getOtherLoginId.js";
import { getConfig } from "./cms.config.js";
import { getLoginId } from "@tests/base/getLoginId.js";
const config = getConfig();
const systemKind = 'CASHIER';

test.describe('SR_修改會員身份證Case', () => {
    test('修改身份證', async ({ request }) => {
        console.log("Step1:取得當前身份證");
        const token = await getToken(request);
        const headers = getHeader_memberId(systemKind, token);
        const currentLoginId = await getLoginId(request, headers, config);
        console.log('✅當前身份證：', currentLoginId);

        console.log("Step2:輸入修改身份證");
        const targetLoginId = getOtherLoginId(currentLoginId);
        const query2Url = `${process.env.INTERNAL_ADMIN_AUDIT}/v1/users/queryWithTmpUser?loginId=${targetLoginId}`;
        const query2Res = await request.post(query2Url, { headers });
        expect(query2Res.ok()).toBeTruthy();
        console.log('✅修改身份證：', targetLoginId);

        console.log("Step3:送出修改身份證");
        const resetUrl = `${process.env.INTERNAL_ADMIN_AUDIT}/v2/users/profile/patchForCashier`;
        const resetData = {
            "acctId": config.acctId,
            "loginId": targetLoginId,
        }
        const resetRes = await request.patch(resetUrl, { headers, data: resetData });
        expect(resetRes.ok()).toBeTruthy();
        const resetResBody = await resetRes.json();

        if (resetResBody.message === 'OK') {
            console.log(`✅身份證已變更: ${targetLoginId}`);
        }
        else {
            throw new Error(`❌身份證修改失敗: ${resetResBody.message}`);
        }
    });
});
