import { test, expect } from "@playwright/test";
import { getHeader_memberId } from "../base/getHeader_memberId";
import { runDbQuery } from "../base/runDbQuery";
import { getConfig } from "./cms.config";

const config = getConfig();

const testCases = [
  {
    name: "查詢門號",
  },
  {
    name: "執行拉黑",
  },
  {
    name: "檢查拉黑結果",
  },
  {
    name: "執行解黑",
  },
  {
    name: "檢查解黑結果",
  },
];

async function checkBlacklistStatus(acctId: string, step: string) {
  await runDbQuery(config.dbName_auth, async (connection) => {
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
  for (const tc of testCases) {
    test(tc.name, async ({ request }) => {
      const queryHeaders = getHeader_memberId();

      if (tc.name === "查詢門號") {
        const queryUrl = `${process.env.INTERNAL_AUDIT}/v1/users/queryWithTmpUser`;
        const queryRes = await request.get(queryUrl, {
          headers: queryHeaders,
          params: { acctId: config.acctId },
        });
        const queryBody = await queryRes.json();
        const currentAcctId = queryBody.data?.usersEntity?.acctId;
        const currentLoginId = queryBody.data?.usersEntity?.loginId;
        console.log(`✅AcctId:${currentAcctId} | LoginId:${currentLoginId}`);
      }

      if (tc.name === "執行拉黑") {
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
      }

      if (tc.name === "檢查拉黑結果") {
        await checkBlacklistStatus(config.acctId);
      }

      if (tc.name === "執行解黑") {
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
      }

      if (tc.name === "檢查解黑結果") {
        await checkBlacklistStatus(config.acctId);
      }
    });
  }
});
