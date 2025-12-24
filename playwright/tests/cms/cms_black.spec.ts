import { test, expect } from "@playwright/test";
import { getHeader_memberId } from "../base/getHeader_memberId.js";
import { runDbQuery } from "../base/runDbQuery.js";
import { getConfig } from "./cms.config.js";
const config = getConfig();

async function checkBlacklistStatus(acctId: string, step: string) {
  await runDbQuery(config.dbName, async (connection) => {
    const [rows] = await connection.execute(
      "SELECT id,acctId,status FROM black_list WHERE acctid = ? ORDER BY id DESC",
      [acctId]
    );
    console.log(
      `\n✅Id：${rows[0].id} | acctId：${rows[0].acctId} | Status: ${rows[0].status}`
    );
  });
}

test.describe("CMS_黑名單Case", () => {
  test("拉黑→解黑", async ({ request }) => {
    //⭐
    console.log("\nStep1:查詢門號");
    const queryHeaders = getHeader_memberId();
    const queryUrl = `${process.env.INTERNAL_AUDIT}/v1/users/queryWithTmpUser`;
    const queryRes = await request.get(queryUrl, {
      headers: queryHeaders,
      params: { acctId: config.acctId },
    });
    const queryBody = await queryRes.json();
    const currentAcctId = queryBody.data?.usersEntity?.acctId;
    const currentLoginId = queryBody.data?.usersEntity?.loginId;
    console.log(`✅AcctId:${currentAcctId} | LoginId:${currentLoginId}`);

    //⭐
    console.log("\nStep2：執行拉黑");
    const banUrl = `${process.env.INTERNAL_AUDIT}/v1/users/blacklist`;
    const banData = {
      acctId: config.acctId,
      systemKind: "GOSMART",
      loginId: config.loginId,
      memo: config.banMemo,
      bannedType: "PERMANENT",
      isBlackFace: false,
      blackListCategoryIds: [],
    };
    const banRes = await request.post(banUrl, {
      headers: queryHeaders,
      data: banData,
    });
    expect(banRes.ok()).toBeTruthy();
    const banBody = await banRes.json();

    if (banBody.message === "OK") {
      console.log(`✅拉黑成功: ${banBody.data.acctId}`);
    } else {
      throw new Error(`❌Fail: ${banBody.message}`);
    }

    //⭐
    console.log("\nStep3:檢查帳號當前狀態");
    await checkBlacklistStatus(config.acctId);

    //⭐
    console.log("\nStep4：執行解黑");
    const unBanUrl = `${process.env.INTERNAL_AUDIT}/v1/users/blacklist/acctid/${config.acctId}`;
    const unBanData = {
      memo: config.unBanMemo,
    };
    const unBanRes = await request.delete(unBanUrl, {
      headers: queryHeaders,
      data: unBanData,
    });
    expect(unBanRes.ok()).toBeTruthy();
    const unBanBody = await unBanRes.json();

    if (unBanBody.message === "OK") {
      console.log(`✅解黑成功:${config.acctId}`);
    } else {
      throw new Error(`❌Fail: ${unBanBody.message}`);
    }

    //⭐
    console.log("\nStep5:檢查帳號當前狀態");
    await checkBlacklistStatus(config.acctId);
  });
});
