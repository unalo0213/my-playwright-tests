import { test, expect } from "@playwright/test";
import { getHeader_memberId } from "../base/getHeader_memberId";
import { getHeader_acctId } from "@tests/base/getHeader_acctId.js";
import { getToken } from "../base/getToken";
import { getConfig } from "./cms.config.js";
const config = getConfig();

const systemKind = 'SMART2GO';

test.describe("2G_送審Case", () => {
  test("送審→通過", async ({ request }) => {
    console.log("Step1:取得審核資料");
    const token = await getToken(request);
    const headers = getHeader_memberId(systemKind, token);
    const banUrl = `${process.env.INTERNAL_ADMIN_AUDIT}/v2/users/documents/review?acctId=${config.acctId}&systemKind=${systemKind}`;
    const banRes = await request.get(banUrl, { headers });
    expect(banRes.ok()).toBeTruthy();
    const banBody = await banRes.json();

    if (banBody.message === "OK") {
      console.log(`當前審核狀態: ${banBody.data.verifyStatus}`);
    } else {
      throw new Error(`❌Fail: ${banBody.message}`);
    }
    console.log("Step2:送出審核結果");
    const passUrl = `${process.env.INTERNAL_ADMIN_AUDIT}/v2/users/documents/review`;
    const passData = {
      "acctId": config.acctId,
      "systemKind": systemKind,
      "verifyBy": "K2108",
      "driverLicenceBackReason": "",
      "driverLicenceBackStatus": 1,
      "driverLicenceFrontReason": "",
      "driverLicenceFrontStatus": 1,
      "idCardBackReason": "",
      "idCardBackStatus": 1,
      "idCardFrontReason": "",
      "idCardFrontStatus": 1,
      "selfieReason": "",
      "selfieStatus": 1,
      "verifyStatus": 4
    }
    const passRes = await request.put(passUrl, { headers, data: passData });
    expect(passRes.ok()).toBeTruthy();
    const passBody = await passRes.json();

    if (passBody.message === "OK") {
      console.log(`✅審核已通過: ${config.acctId}`);
    } else {
      throw new Error(`❌Fail: ${passBody.message}`);
    }

  });
});