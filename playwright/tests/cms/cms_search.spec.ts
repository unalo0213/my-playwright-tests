import { test, expect } from "@playwright/test";
import { getHeader_memberId } from "../base/getHeader_memberId.js";
import { getConfig } from "./cms.config.js";
const config = getConfig();

const headers = getHeader_memberId();
const baseUrl = `${process.env.INTERNAL_AUDIT}/v1/users/queryWithTmpUser`;
const testCases = [
  {
    name: "loginId 查詢",
    params: { loginId: config.loginId },
    compareKey: "loginId",
  },
  {
    name: "acctId 查詢",
    params: { acctId: config.acctId },
    compareKey: "acctId",
  },
  {
    name: "mainCell 查詢",
    params: { mainCell: config.phone, nationalCode: "886" },
    compareKey: "mainCell",
  },
];

test.describe("CMS-查詢會員(手機/身分證/acctId)", () => {
  for (const tc of testCases) {
    test(tc.name, async ({ request }) => {
      const res = await request.get(baseUrl, {
        headers: headers,
        params: tc.params,
      });

      expect(res.ok()).toBeTruthy();
      const body = await res.json();
      const key = tc.compareKey;
      const expectedValue = tc.params[key];
      const actualValue = body.data?.usersEntity?.[key];

      if (body.message === "OK") {
        if (String(actualValue) === String(expectedValue)) {
          console.log(`✅${key}相符: ${actualValue} == ${expectedValue}`);
        } else {
          console.log(`❌${key}不相符: ${actualValue} != ${expectedValue}`);
        }
      } else {
        throw new Error(`測試Fail: ${body.message}`);
      }
    });
  }
});
