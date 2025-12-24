import { test, expect } from "@playwright/test";
import { getHeader_memberId } from "../base/getHeader_memberId";
import { getToken } from "../base/getToken";
import { getConfig } from "./2g.config";
import { runDbQuery } from "../base/runDbQuery.js";
const config = getConfig();

test.describe("2G_送審Case", () => {
  test("送審→通過", async ({ request }) => {
    console.log("\nStep1:取得當前審核狀態");
    const token = await getToken(request);
    const headers = getHeader_memberId(token);
    const banUrl = `${process.env.INTERNAL_ADMIN_AUDIT}/v2/users/documents/review?acctId=${config.acctId}&systemKind=GOSMART`;
    const banRes = await request.get(banUrl, { headers });
    expect(banRes.ok()).toBeTruthy();
    const banBody = await banRes.json();

    if (banBody.message === "OK") {
      //4=審核通過，2=審核進行中
      console.log(
        `✅acctId：${config.acctId} | verifyStatus: ${banBody.data.verifyStatus}`
      );
    } else {
      throw new Error(`❌Fail: ${banBody.message}`);
    }

    console.log("\nStep2:送出帳號審核通過");
    const passUrl = `${process.env.INTERNAL_ADMIN_AUDIT}/v2/users/documents/review`;
    const passData = {
      acctId: config.acctId,
      systemKind: "GOSMART",
      verifyBy: "K2108",
      driverLicenceBackReason: "",
      driverLicenceBackStatus: 1,
      driverLicenceFrontReason: "",
      driverLicenceFrontStatus: 1,
      idCardBackReason: "",
      idCardBackStatus: 1,
      idCardFrontReason: "",
      idCardFrontStatus: 1,
      selfieReason: "",
      selfieStatus: 1,
      verifyStatus: 4,
    };
    const passRes = await request.put(passUrl, { headers, data: passData });
    expect(passRes.ok()).toBeTruthy();
    const passBody = await passRes.json();

    if (passBody.message === "OK") {
      console.log("✅狀態變更成功");
    } else {
      throw new Error(`❌Fail: ${passBody.message}`);
    }

    console.log("\nStep3:查詢審核結果");
    const chkUrl = `${process.env.INTERNAL_ADMIN_AUDIT}/v2/users/documents/list`;
    const chkData = {
      pageSize: 10,
      startIndex: 0,
      accountStatus: "",
      isNoticed: "",
      isBlacklist: "",
      submitSystemList: [],
      verifyBy: "",
      acctName: config.acctName,
    };
    const chkRes = await request.post(chkUrl, { headers, data: chkData });
    expect(banRes.ok()).toBeTruthy();
    const chkBody = await chkRes.json();

    if (chkBody.message === "OK") {
      console.log(
        `✅acctId：${chkBody.data.userDocumentsListResList[0].acctId} | verifyStatus:${chkBody.data.userDocumentsListResList[0].verifyStatus}`
      );
    } else {
      throw new Error(`❌Fail: ${chkBody.message}`);
    }

    console.log("\nStep4:還原帳號審核狀態");
    await runDbQuery(config.dbName, async (connection) => {
      // 1. 執行更新
      const [result] = await connection.execute(
        "UPDATE certified_document SET verifyStatus = ? WHERE acctid = ?",
        [2, config.acctId]
      );

      // 2. 執行查詢，確認最新狀態
      const [rows] = await connection.execute(
        "SELECT verifyStatus FROM certified_document WHERE acctid = ?",
        [config.acctId]
      );

      // 3. 印出結果
      console.log(
        `\n✅acctId：${config.acctId} | verifyStatus: ${rows[0].verifyStatus}`
      );
    });
  });
});
