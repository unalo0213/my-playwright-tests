import { test, expect } from "@playwright/test";
import { getHeader_memberId } from "../base/getHeader_memberId.js";
import { getConfig } from "./cms.config.js";
const config = getConfig();

test.describe('CMS_修改會員Case', () => {
    test('修改門號', async ({ request }) => {
        console.log("Step1:取得當前門號");
        const systemKind = 'CMS';
        const queryHeaders = getHeader_memberId(systemKind);
        const queryUrl = `${process.env.INTERNAL_AUDIT}/v1/users/queryWithTmpUser`;
        const queryRes = await request.get(queryUrl, { headers: queryHeaders, params: { acctId: config.acctId } });
        const queryBody = await queryRes.json();
        const currentPhone = queryBody.data?.usersEntity?.mainCell;
        console.log('✅當前門號：', currentPhone);

        console.log("Step2:送出修改門號");
        const resetUrl = `${process.env.INTERNAL_AUTH}/v1/users/${config.acctId}/mainCell/reset`;
        const phoneToReset =
            (currentPhone === config.resetPhone)
                ? config.phone
                : config.resetPhone;
        const resetData = {
            "nationalCode": config.nationalCode,
            "mainCell": phoneToReset
        }
        const resetRes = await request.post(resetUrl, { headers: queryHeaders, data: resetData });
        expect(resetRes.ok()).toBeTruthy();
        const resetResBody = await resetRes.json();

        if (resetResBody.message === 'OK') {
            console.log(`✅門號修已變更: ${phoneToReset}`);
        }
        else {
            throw new Error(`❌門號修改失敗: ${resetResBody.message}`);
        }
    });
});
