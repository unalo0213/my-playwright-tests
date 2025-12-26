import { test, expect } from "@playwright/test";
import { getHeader_memberId } from "../base/getHeader_memberId";
import { getToken } from "../base/getToken";
import { getConfig } from "./2g.config";
import { runDbQuery } from "../base/runDbQuery.js";
const config = getConfig();

const testCases = [
  {
    name: "取得當前審核狀態",
  },
  {
    name: "送出帳號審核通過",
  },
  {
    name: "查詢審核結果",
  },
  {
    name: "還原帳號審核狀態",
  },
];

test.describe("2G_送審Case", () => {
  for (const tc of testCases) {
    test(tc.name, async ({ request }) => {
      const token = await getToken(request);
      const headers = getHeader_memberId(token);

      if (tc.name === "取得當前審核狀態") {
        const banUrl = `${process.env.INTERNAL_ADMIN_AUDIT}/v2/users/documents/review?acctId=${config.acctId}&systemKind=GOSMART`;
        const banRes = await request.get(banUrl, { headers });
        expect(banRes.ok()).toBeTruthy();
        const banBody = await banRes.json();

        if (banBody.message === "OK") {
          console.log(
            `✅acctId：${config.acctId} | verifyStatus: ${banBody.data.verifyStatus}`
          );
        } else {
          throw new Error(`❌Fail: ${banBody.message}`);
        }
      }

      if (tc.name === "送出帳號審核通過") {
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
      }

      if (tc.name === "查詢審核結果") {
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
        expect(chkRes.ok()).toBeTruthy();
        const chkBody = await chkRes.json();

        if (chkBody.message === "OK") {
          console.log(
            `✅acctId：${chkBody.data.userDocumentsListResList[0].acctId} | verifyStatus:${chkBody.data.userDocumentsListResList[0].verifyStatus}`
          );
        } else {
          throw new Error(`❌Fail: ${chkBody.message}`);
        }
      }

      if (tc.name === "還原帳號審核狀態") {
        await runDbQuery(config.dbName_auth, async (connection) => {
          const [result] = await connection.execute(
            "UPDATE certified_document SET verifyStatus = ? WHERE acctid = ?",
            [2, config.acctId]
          );

          const [rows] = await connection.execute(
            "SELECT verifyStatus FROM certified_document WHERE acctid = ?",
            [config.acctId]
          );

          console.log(
            `\n✅acctId：${config.acctId} | verifyStatus: ${rows[0].verifyStatus}`
          );
        });
      }
    });
  }
});
