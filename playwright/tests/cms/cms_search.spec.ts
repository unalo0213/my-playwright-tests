import { test, expect } from "@playwright/test";
import { getHeader_memberId } from "@tests/base/getHeader_memberId.js";
import { getConfig } from "./cms.config.js";
const config = getConfig();

const systemKind = 'CMS';
const headers = getHeader_memberId(systemKind);
const baseUrl = `${process.env.INTERNAL_AUTH}/v1/users/queryWithTmpUser`;
const testCases = [
  {
    name: 'loginId 查詢',
    params: { loginId: config.loginId }, compareKey: 'loginId'
  },
  {
    name: 'acctId 查詢',
    params: { acctId: config.acctId }, compareKey: 'acctId'
  },
  {
    name: 'mainCell 查詢',
    params: { mainCell: config.phone, nationalCode: '886' }, compareKey: 'mainCell'
  }
];

test.describe('CMS-查詢會員(手機/身分證/acctId)', () => {
  for (const tc of testCases) {
    test(tc.name, async ({ request }) => {
      const res = await request.get(baseUrl, { headers: headers, params: tc.params });

      // HTTP 狀態碼 2xx 判定
      expect(res.ok()).toBeTruthy();
      // 解析回應成JSON格式+方便後續用邏輯做判斷用
      const body = await res.json();

      // 宣告變數「裝」值」
      const key = tc.compareKey;
      const expectedValue = tc.params[key];
      const actualValue = body.data?.usersEntity?.[key];

      // 如果訊息是 OK，進行 acctId 比對
      if (body.message === 'OK') {
        if (String(actualValue) === String(expectedValue)) { //統一型別再比對
          console.log(`✅${key}相符: ${actualValue} == ${expectedValue}`);
        }
        else {
          console.log(`❌${key}不相符: ${actualValue} != ${expectedValue}`);
        }
      }
      else {
        throw new Error(`測試Fail: ${body.message}`);
      }
    });
  }
});