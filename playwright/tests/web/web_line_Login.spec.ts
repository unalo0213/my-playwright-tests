// ⭐只能用debug模式，因為有二維驗證
import { test, expect } from "@playwright/test";
import { ssoBind } from "../base/ssoBind";
import { getToken } from "../base/getToken";
import { getHeader_memberId } from "../base/getHeader_memberId";
import { runDbQuery } from "../base/runDbQuery";
import { getConfig } from "./web.config";
const config = getConfig();

const testCases = [
  {
    name: "綁定",
  },
  {
    name: "驗證綁定結果",
  },
  {
    name: "解綁",
  },
  {
    name: "驗證解綁結果",
  },
];

test.describe("官網_Line", () => {
  test.setTimeout(120000);
  for (const tc of testCases) {
    test(tc.name, async ({ page, request }) => {
      const token = await getToken(request);
      const headers = getHeader_memberId(token);

      if (tc.name === "綁定") {
        await page.goto(process.env.WEB_LOGIN);
        await page.getByRole("button").nth(5).click();
        await page
          .getByRole("button", { name: "點擊開啟 line 帳號繼續" })
          .click();
        //自已點QR code登入
        await ssoBind(page);
        console.log(`✅綁定成功`);
      }
      if (tc.name === "驗證綁定結果") {
        const bindUrl = `${process.env.INTERNAL_ADMIN_AUTH}/v1/users/social/bindStatus?acctId=${config.acctId}&corporation=CARPLUS`;
        const bindRes = await request.get(bindUrl, { headers });
        expect(bindRes.ok()).toBeTruthy();
        const bindBody = await bindRes.json();
        if (bindBody.message === "OK") {
          console.log(
            `✅socialType: ${bindBody.data[0].socialType} | bindStatus: ${bindBody.data[0].bind}`
          );
        } else {
          throw new Error(`❌Fail: ${bindBody.message}`);
        }
      }

      if (tc.name === "解綁") {
        const unbindUrl = `${process.env.INTERNAL_ADMIN_AUTH}/v1/users/social/deleteAccount`;
        const unbindData = {
          acctId: config.acctId,
          corporationEnum: "CARPLUS",
          socialType: "line",
        };
        const unbindRes = await request.post(unbindUrl, {
          headers: headers,
          data: unbindData,
        });
        expect(unbindRes.ok()).toBeTruthy();
        const unBindBody = await unbindRes.json();
        if (unBindBody.message === "OK") {
          console.log(`✅解綁成功`);
        } else {
          throw new Error(`❌Fail: ${unBindBody.message}`);
        }
      }
      if (tc.name === "驗證解綁結果") {
        await runDbQuery(config.dbName_auth, async (connection) => {
          const [rows] = await connection.execute(
            "SELECT id,acctId,socialType,isUnBind,updateDate FROM users_social_account WHERE acctid = ? order by id desc",
            [config.acctId]
          );
          console.log(
            `\n✅id:${rows[0].id}  | acctId：${config.acctId} | socialType:${rows[0].socialType}  | isUnBind: ${rows[0].isUnBind}`
          );
        });
      }
    });
  }
});
