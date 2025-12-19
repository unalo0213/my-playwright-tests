import { test, expect } from "@playwright/test";
import { getHeader_memberId } from "../base/getHeader_memberId.js";
import { getOtherPhone } from "../base/getOtherPhone.js";
import { getConfig } from "./cms.config.js";
const config = getConfig();
const banUrl = `${process.env.INTERNAL_AUDIT}/v1/users/blacklist`;
const unBanUrl = `${process.env.INTERNAL_AUDIT}/v1/users/blacklist/acctid/${config.acctId}`;

test.describe('CMS_黑名單Case', () => {
  test('拉黑→解黑', async ({ request }) => {
    console.log("Step0:取得當前門號");
    const systemCMS = 'CMS';
    const queryHeaders = getHeader_memberId(systemCMS);
    const queryUrl = `${process.env.INTERNAL_AUDIT}/v1/users/queryWithTmpUser`;
    const queryRes = await request.get(queryUrl, { headers: queryHeaders, params: { acctId: config.acctId } });
    const queryBody = await queryRes.json();
    const currentPhone = queryBody.data?.usersEntity?.mainCell;
    console.log('✅當前門號：', currentPhone);

    console.log("Step1：開始執行acctId拉黑");
    const banHeaders = getHeader_memberId(systemCMS);
    const targetPhone = getOtherPhone(currentPhone);
    const banData = {
      "acctId": config.acctId,
      "systemKind": systemCMS,
      "loginId": config.loginId,
      "memo": config.banMemo,
      "bannedType": "PERMANENT",
      "isBlackFace": false,
      "blackListCategoryIds": []
    };
    const banRes = await request.post(banUrl, { headers: banHeaders, data: banData });
    expect(banRes.ok()).toBeTruthy();
    const banBody = await banRes.json();

    if (banBody.message === 'OK') {
      console.log(`✅拉黑成功: acctId == ${banBody.data.acctId}`);
    }
    else {
      throw new Error(`❌拉黑失敗: ${banBody.message}`);
    }

    console.log("Step2：開始執行acctId解黑");
    const unBanData = {
      "memo": config.unBanMemo
    };
    const unBanRes = await request.delete(unBanUrl, { headers: banHeaders, data: unBanData });
    expect(unBanRes.ok()).toBeTruthy();
    const unBanBody = await unBanRes.json();

    if (unBanBody.message === "OK") {
      console.log(`✅解黑成功: acctId == ${config.acctId}`);
    }
    else {
      throw new Error(`❌拉黑失敗: ${unBanBody.message}`);
    }

    console.log("Step3：開始執行2G人臉拉黑");
    const system2GO = 'SMART2GO';
    const banFaceHeaders = getHeader_memberId(system2GO);
    const banFaceData = {
      "acctId": config.acctId,
      "systemKind": system2GO,
      "loginId": config.loginId,
      "memo": config.banMemo,
      "bannedType": "PERMANENT",
      "isBlackFace": true,
      "blackListCategoryIds": [4]
    };
    const banFaceRes = await request.post(banUrl, { headers: banFaceHeaders, data: banFaceData });
    expect(banFaceRes.ok()).toBeTruthy();
    const banFaceBody = await banFaceRes.json();

    if (banFaceBody.message === 'OK') {
      console.log(`✅人臉拉黑成功: acctId == ${banFaceBody.data.acctId}`);
    }
    else {
      throw new Error(`❌人臉拉黑失敗: ${banFaceBody.message}`);
    }

    console.log("Step4：開始執行CMS人臉解黑");
    const unBanFaceHeaders = getHeader_memberId(systemCMS);
    const unBanFaceData =
    {
      "memo": config.unBanMemo
    };
    const unBanFaceRes = await request.delete(unBanUrl, { headers: unBanFaceHeaders, data: unBanFaceData });
    expect(unBanFaceRes.ok()).toBeTruthy();
    const unBanFaceBody = await unBanFaceRes.json();

    if (unBanFaceBody.message === "OK") {
      console.log(`✅人臉解黑成功: acctId == ${config.acctId}`);
    }
    else {
      throw new Error(`❌人臉拉黑失敗: ${unBanFaceBody.message}`);
    }
  });
});