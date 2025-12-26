import { test, expect } from "@playwright/test";
import { getHeader_memberId } from "../base/getHeader_memberId.js";
import { runDbQuery } from "../base/runDbQuery.js";
import { getConfig } from "./cms.config.js";
const config = getConfig();

const testCases = [
  {
    name: "查詢門號",
  },
  {
    name: "執行人黑拉黑",
  },
  {
    name: "檢查人黑拉黑結果",
  },
  {
    name: "執行人黑解黑",
  },
  {
    name: "檢查人黑解黑結果",
  },
];

async function checkFaceBlacklistStatus(acctId: string, step: string) {
  await runDbQuery(config.dbName_auth, async (connection) => {
    const [rows] = await connection.execute(
      "SELECT id,acctId,status FROM black_list_of_face_perception WHERE acctid = ? ORDER BY id DESC",
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
      if (tc.name === "查詢門號") {
        const queryHeaders = getHeader_memberId();
        const queryUrl = `${process.env.INTERNAL_AUDIT}/v1/users/queryWithTmpUser`;
        const queryRes = await request.get(queryUrl, {
          headers: queryHeaders,
          params: { acctId: config.faceBlack_acctId },
        });
        const queryBody = await queryRes.json();
        const currentAcctId = queryBody.data?.usersEntity?.acctId;
        const currentLoginId = queryBody.data?.usersEntity?.loginId;
        console.log(`✅AcctId:${currentAcctId} | loginId:${currentLoginId}`);
      }

      if (tc.name === "執行人臉拉黑") {
        const banFaceUrl = `${process.env.INTERNAL_AUDIT}/v1/users/blacklist`;
        const banFaceData = {
          acctId: config.faceBlack_acctId,
          systemKind: "GOSMART",
          loginId: config.faceBlack_loginId,
          memo: config.banMemo,
          bannedType: "PERMANENT",
          isBlackFace: true,
          blackListCategoryIds: [4],
        };
        const banFaceRes = await request.post(banFaceUrl, {
          headers: queryHeaders,
          data: banFaceData,
        });
        expect(banFaceRes.ok()).toBeTruthy();
        const banFaceBody = await banFaceRes.json();

        if (banFaceBody.message === "OK") {
          console.log(`✅人臉拉黑成功:${banFaceBody.data.acctId}`);
        } else {
          throw new Error(`❌Fail: ${banFaceBody.message}`);
        }
      }

      if (tc.name === "檢查人黑拉黑結果") {
        await checkFaceBlacklistStatus(config.faceBlack_acctId);
      }

      if (tc.name === "執行人臉解黑") {
        const unBanFaceUrl = `${process.env.INTERNAL_AUDIT}/v1/users/blacklist/acctid/${config.faceBlack_acctId}`;
        const unBanFaceData = {
          memo: config.unBanMemo,
        };
        const unBanFaceRes = await request.delete(unBanFaceUrl, {
          headers: queryHeaders,
          data: unBanFaceData,
        });
        expect(unBanFaceRes.ok()).toBeTruthy();
        const unBanFaceBody = await unBanFaceRes.json();

        if (unBanFaceBody.message === "OK") {
          console.log(`✅人臉解黑成功:${config.acctId}`);
        } else {
          throw new Error(`❌Fail: ${unBanFaceBody.message}`);
        }
      }

      if (tc.name === "檢查人黑解黑結果") {
        await checkFaceBlacklistStatus(config.faceBlack_acctId);
      }
    });
  }
});
