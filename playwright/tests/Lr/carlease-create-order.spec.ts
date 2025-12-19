import { test, Page } from "@playwright/test";
import dayjs from "dayjs";
import { getConfig } from "./carlease-create-order.config.js";
import { loginAdmin } from "../base/loginAdmin.js";
const config = getConfig();

// 上傳圖片專用
// import { exampleImg } from "@helpers/exampleImg";

test(`試算單衝 70+採購`, async ({ page }) => {
  /** 送試算 */
  await page.goto(`${process.env.BASE_CARLEASE_URL}/calculateOrder`);
  await loginAdmin(page);

  /** 本機環境不會有則跳過 */
  try {
    await page.getByRole("button", { name: "OK" }).waitFor({
      state: "visible",
      timeout: 3000,
    });
    await page.getByRole("button", { name: "OK" }).click();
  } catch (error) { }

  await page.getByRole("button", { name: "車型搜尋" }).click();
  await page
    .getByLabel("車型搜尋")
    .getByText("*車型代碼")
    .locator("../..")
    .locator("input")
    .fill(config.carType);
  await page.getByRole("button", { name: "查詢" }).click();

  await page.locator(`#carTypeSelect_${config.carType}`).click();
  await page.locator("#identityId input").click();
  await page
    .getByRole("textbox", { name: "客戶統編/身分證" })
    .fill(config.customerId);
  await page.getByRole("button", { name: "搜尋" }).click();
  await page.locator(`#selectCustomerButton_${config.customerId}`).click();

  await page.locator("#color input").click();
  await page.locator("#color input").fill("aa");
  await page.locator("#carAgentId input").click();
  await page.getByRole("option", { name: "七和實業股份有限公司 -" }).click();

  /** 加選配件 */
  await page.getByRole("button", { name: "加選配件" }).click();
  await page.locator("#company-vender-autocomplete").click();
  await page.getByRole("option", { name: "七和實業股份有限公司" }).click();
  await page.getByRole("button", { name: "搜尋" }).click();
  await page.locator(".bg-white > path").first().click();
  await page.locator(".bg-white > path").first().click();
  await page.getByRole("button", { name: "完成" }).click();
  await page.getByRole("button", { name: "確認" }).click();
  /** 加選配件 end */

  await page.getByRole("button", { name: "計算", exact: true }).click();
  await page.getByRole("button", { name: "送件", exact: true }).click();

  /** 取得 ordersId、caseMasterId */
  const [response] = await Promise.all([
    page.waitForResponse((resp) =>
      resp
        .url()
        .includes("/admin/rentalquote/v1/orders/extraInfo/workflow/memo")
    ),
  ]);

  /** 送授信 */
  const responseData = await response.json();
  const ordersId = responseData.data?.[0].systemDocId;
  const caseMasterId = responseData.data?.[0].caseMasterId;
  const maxCalcStep = Math.max(
    ...responseData.data?.[0]?.workFlowCaseFlowInfoList.map(
      (item) => item.step
    )
  );

  const calcInput = page
    .locator("div")
    .filter({ hasText: /^試算編號$/ })
    .first()
    .locator("..") // 向上找父元素
    .locator("input");

  await page.goto(`${process.env.BASE_CARLEASE_URL}/calculateList`);
  await calcInput.click();
  await calcInput.fill(String(ordersId));
  await page.getByRole("button", { name: "立即查詢" }).click();
  await page.locator('[id^="checkbox_"]').first().check();
  await page.locator("#postCaseAdd").click();
  await page.getByRole("button", { name: "授信送件" }).click();
  await page.locator("#custType").getByRole("combobox").click();
  await page.getByRole("option", { name: "自然人" }).click();
  await page.locator("#bossName input").click();
  await page.locator("#bossName input").fill("asd");
  await page.getByRole("textbox", { name: "請填寫承作觀點" }).click();
  await page.getByRole("textbox", { name: "請填寫承作觀點" }).fill("dsa");
  await page.locator("#contactMobile input").fill("0922111222");
  await page
    .locator("div")
    .filter({ hasText: /^負責人身分證字號$/ })
    .first()
    .locator("..")
    .locator("input")
    .fill("A126370811");
  await page.getByRole("button", { name: "送件授信審核" }).click();

  await calcInput.click();
  await calcInput.fill(String(ordersId));
  await page.getByRole("button", { name: "立即查詢" }).click();

  const [calcListRes] = await Promise.all([
    page.waitForResponse((resp) =>
      resp.url().includes("/admin/rentalquote/v1/orders/search")
    ),
  ]);

  const calcListData = await calcListRes.json();
  const creditNo = calcListData.data?.[0].creditNo;
  console.log("calcListData:", calcListData);

  /** 試算單簽核 */
  await page.goto(
    `${process.env.BASE_LRENTAL_URL}/workflow/CaseListAdmin/${caseMasterId}`
  );

  await page.getByRole("button", { name: "自動簽核" }).click();
  await page
    .getByRole("textbox", { name: "無填寫時，自動簽核至決行關卡" })
    .click();

  await page
    .getByRole("textbox", { name: "無填寫時，自動簽核至決行關卡" })
    .fill(String(maxCalcStep));

  await page.getByRole("button", { name: "確認" }).click();

  /** 授信調整主管對保 */
  await page.goto(`${process.env.BASE_LRENTAL_URL}/workflow/CreditList`);
  const listResponse = await page.waitForResponse((resp) =>
    resp.url().includes("/admin/workflow/v1/caseList")
  );

  const listData = await listResponse.json();
  let creditCaseMasterId = listData.data.page.list?.[0]?.caseMasterId;

  await page.getByRole("textbox", { name: "請輸入授信單號" }).click();
  await page
    .getByRole("textbox", { name: "請輸入授信單號" })
    .fill(String(creditNo));
  await page.getByRole("textbox", { name: "請輸入授信單號" }).press("Enter");
  // await page.getByRole("button", { name: "查詢" }).click();
  const noDataElement = page
    .locator("text=查無資料")
    .or(page.locator("text=沒有資料"));
  const creditCell = page.getByRole("cell", { name: creditNo });

  try {
    await Promise.race([
      creditCell.waitFor({ state: "visible", timeout: 100000 }),
      noDataElement.waitFor({ state: "visible", timeout: 100000 }),
    ]);

    // 檢查是否找到授信單號
    if (await creditCell.isVisible()) {
      await creditCell.click();
      console.log(`✅ 找到並點擊授信單號: ${creditNo}`);
    } else {
      console.log(`⚠️ 查無授信資料: ${creditNo}`);
      await page.getByRole("button", { name: "個人訊息" }).click();
      await page.getByRole("combobox", { name: "代理" }).click();
      await page.getByRole("option", { name: "陳信昌" }).click();
      await page.getByRole("heading", { name: "是否更換代理人" }).waitFor({
        state: "visible",
        timeout: 5000,
      });
      await page.getByRole("button", { name: "確定" }).click();
      await page.getByRole("textbox", { name: "請輸入授信單號" }).click();
      await page
        .getByRole("textbox", { name: "請輸入授信單號" })
        .fill(String(creditNo));

      await page.waitForTimeout(1000);
      await page
        .getByRole("textbox", { name: "請輸入授信單號" })
        .press("Enter");

      const listResponse = await page.waitForResponse((resp) =>
        resp.url().includes("/admin/workflow/v1/caseList")
      );
      const listData = await listResponse.json();
      creditCaseMasterId = listData.data.page.list[0].caseMasterId;
      console.log(`creditCaseMasterId`, creditCaseMasterId);
      console.log(`✅ 重新設定代理後，找到並點擊授信單號: ${creditNo}`);
      await creditCell.click();
      // throw new Error(`找不到授信單號: ${creditNo}`);
    }
  } catch (error) {
    // console.log(`❌ 查詢超時或發生錯誤: ${error.message}`);
    // throw error;
  }

  const creditWorkFlowResponse = await page.waitForResponse((resp) =>
    resp.url().includes(`/admin/workflow/v1/caseInfo/${creditCaseMasterId}`)
  );
  const creditWorkFlowData = await creditWorkFlowResponse.json();
  console.log(`creditWorkFlowData`, creditWorkFlowData);
  const maxCreditStep = Math.max(
    ...creditWorkFlowData.data?.caseFlowInfoList.map((item) => item.step)
  );

  console.log(`maxCreditStep`, maxCreditStep);

  await page
    .getByText("主管對保*")
    .locator("..")
    .locator(".MuiSelect-select")
    .click();
  await page.getByRole("option", { name: "是" }).click();

  await page.locator("#caseMemo").click();
  await page.locator("#caseMemo").fill("對保通過");

  await page.locator("#caseListSearchSignAgree").click();

  await page.getByRole("button", { name: "確定" }).click();

  await page.getByRole("button", { name: "個人訊息" }).click();
  await page.getByRole("combobox", { name: "代理" }).click();
  await page.getByRole("option", { name: "本人" }).click();
  await page.getByRole("heading", { name: "是否更換為本人？" }).waitFor({
    state: "visible",
    timeout: 5000,
  });
  await page.getByRole("button", { name: "確定" }).click();
  await page.waitForTimeout(1500);

  /** 授信牽核 */
  await page.goto(
    `${process.env.BASE_LRENTAL_URL}/workflow/CaseListAdmin/${creditCaseMasterId}`
  );

  await page.getByRole("button", { name: "自動簽核" }).click();
  await page
    .getByRole("textbox", { name: "無填寫時，自動簽核至決行關卡" })
    .click();

  await page
    .getByRole("textbox", { name: "無填寫時，自動簽核至決行關卡" })
    .fill(String(maxCreditStep - 1));

  await page.getByRole("button", { name: "確認" }).click();
  await page.waitForTimeout(1000);

  /** 直接抓最後一關的人 */
  await page.getByRole("cell").nth(-7).locator("button").click();
  await page.getByRole("heading", { name: "是否更換代理人" }).waitFor({
    state: "visible",
    timeout: 5000,
  });
  await page.getByRole("button", { name: "確定" }).click();
  await page
    .getByText("黃仲均 [K2522] - 前端開發課")
    .locator("..")
    .locator(".text-blue-800")
    .waitFor({
      state: "visible",
      timeout: 10000,
    });

  /** 簽核授信 */
  const approveCredit = async (page: Page) => {
    await page.getByRole("cell", { name: creditNo }).click();

    await page.locator("#caseMemo").click();
    await page.locator("#caseMemo").fill("對保通過");

    await page.locator("#caseListSearchSignApprove").click();
    await page.getByText("是否確定決行").waitFor({
      state: "visible",
      timeout: 5000,
    });
    await page.waitForTimeout(3000);
    await page.getByRole("button", { name: "確定" }).click();
    try {
      // 此處有營業條件 or 徵提條件
      await page.locator("text=/本案將依.*決行.*/").waitFor({
        state: "visible",
        timeout: 5000,
      });
      await page.waitForTimeout(3000);
      await page.getByRole("button", { name: "確定" }).click();
      await page.waitForTimeout(8000);
      // await page
      //   .locator("text=查無資料")
      //   .or(page.locator("text=沒有資料"))
      //   .waitFor({
      //     state: "visible",
      //     timeout: 10000,
      //   });
    } catch (error) { }
  };

  await page.goto(`${process.env.BASE_LRENTAL_URL}/workflow/CreditList/`, {
    waitUntil: "networkidle", // 等待網頁載入完成
  });
  await page
    .getByRole("textbox", { name: "請輸入授信單號" })
    .fill(String(creditNo));
  await page.waitForTimeout(1000);
  await page.getByRole("textbox", { name: "請輸入授信單號" }).press("Enter");

  await approveCredit(page);

  /** 到 70 */

  /** 購車文件上傳/審核 */
  // await page.goto(`${process.env.BASE_CARLEASE_URL}/purchaseFileUpload`);

  // await page
  //   .getByRole("textbox", { name: "※輸入[試算單號]時，可忽略[已上傳否]之條件" })
  //   .click();
  // await page
  //   .getByRole("textbox", { name: "※輸入[試算單號]時，可忽略[已上傳否]之條件" })
  //   .fill(ordersId);
  // await page.getByRole("button", { name: "搜尋" }).click();
  // await page.getByRole("button", { name: "上傳" }).click();

  // await page.getByText("合約&附件").click();
  // await page.getByRole("option", { name: "對保照" }).click();
  // await page.locator("#fileName input").fill("aaa");
  // await page.locator("#uploadFileInput").setInputFiles(exampleImg);

  // await page.getByRole("button", { name: "確認上傳" }).click();
  // await page.goto(`${process.env.BASE_CARLEASE_URL}/purchaseFileConfirm`);
  // // await page.getByText("車輛採購").click();
  // // await page.getByRole("link", { name: "購車文件確認" }).click();
  // await page
  //   .getByRole("textbox", { name: "※輸入[試算單號]時，可忽略[已確認否]之條件" })
  //   .click();
  // await page
  //   .getByRole("textbox", { name: "※輸入[試算單號]時，可忽略[已確認否]之條件" })
  //   .fill(ordersId);
  // await page.getByRole("button", { name: "搜尋" }).click();
  // await page.getByRole("button", { name: "編輯" }).click();
  // await page.getByRole("cell", { name: "已確認" }).nth(0).click();
  // await page.getByTestId("CloseIcon").click();

  /** 採購請款 */
  await page.goto(
    `${process.env.BASE_CARLEASE_URL}/purchaseApplyList?purchaseStatus=temp`
  );
  await page
    .getByText("試算單號")
    .locator("../../..")
    .locator("input")
    .click();
  await page.waitForTimeout(1000);
  await page
    .getByText("試算單號")
    .locator("../../..")
    .locator("input")
    .fill(ordersId);
  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "查詢" }).click();
  await page.getByRole("button", { name: "編輯" }).click();
  const page1Promise = page.waitForEvent("popup");
  const page1 = await page1Promise;
  await page1.getByRole("button", { name: "帶入" }).click();
  await page1
    .locator("#prepayDate input")
    .fill(dayjs().add(1, "day").format("YYYY-MM-DD"));
  await page1
    .locator("#preLicenseDate input")
    .fill(dayjs().add(2, "day").format("YYYY-MM-DD"));
  await page1.getByRole("button", { name: "送件" }).click();
  await page1.goto(`${process.env.BASE_CARLEASE_URL}/carPurchase`);
  await page1
    .getByText("試算單號")
    .locator("../../..")
    .locator("input")
    .click();
  await page1
    .getByText("試算單號")
    .locator("../../..")
    .locator("input")
    .fill(ordersId);
  await page.waitForTimeout(1000);
  await page1.getByRole("button", { name: "搜尋" }).click();
  const page2Promise = page1.waitForEvent("popup");
  await page1.getByText(ordersId).click();
  const page2 = await page2Promise;
  await page2
    .getByText("引擎號碼")
    .locator("../../..")
    .locator("input")
    .click();
  await page2
    .getByText("引擎號碼")
    .locator("../../..")
    .locator("input")
    .fill("1");
  await page2
    .getByText("車身號碼")
    .locator("../../..")
    .locator("input")
    .click();
  await page2
    .getByText("車身號碼")
    .locator("../../..")
    .locator("input")
    .fill("2");
  await page2
    .getByText("牌登資料")
    .locator("..")
    .getByText("排氣量")
    .locator("../../..")
    .locator("input")
    .click();
  await page2
    .getByText("牌登資料")
    .locator("..")
    .getByText("排氣量")
    .locator("../../..")
    .locator("input")
    .fill("3");
  await page2
    .getByText("行照車型")
    .locator("../../..")
    .locator("input")
    .click();
  await page2
    .getByText("行照車型")
    .locator("../../..")
    .locator("input")
    .fill("4");
  await page2.getByRole("button", { name: "儲存" }).click();
  const page3Promise = page1.waitForEvent("popup");
  await page1.getByRole("button", { name: "暫付款/請款" }).click();
  const page3 = await page3Promise;
  await page3.getByRole("button", { name: "新增發票" }).click();
  await page3.getByText("*銷售額").locator("../..").locator("input").click();
  await page3
    .getByText("*銷售額")
    .locator("../..")
    .locator("input")
    .fill("100");
  await page3
    .getByText("實付車款")
    .locator("../../..")
    .locator("input")
    .click();
  await page3
    .getByText("實付車款")
    .locator("../../..")
    .locator("input")
    .fill("105");
  await page3
    .getByLabel("新增發票")
    .getByText("發票號碼")
    .locator("../../..")
    .locator("input")
    .click();
  await page3
    .getByLabel("新增發票")
    .getByText("發票號碼")
    .locator("../../..")
    .locator("input")
    .fill(`AZ${dayjs().format("DDHHmmss")}`);
  await page3.getByRole("button", { name: "儲存" }).click();

  // 等待 2 分鐘
  // await page.waitForFunction(
  //   () => {
  //     return false;
  //   },
  //   { timeout: 120000 }
  // );

  // const currentUrl = page.url();

  // // 從網址中提取 orderId
  // if (currentUrl.includes("/ordersReview/view/")) {
  //   const orderId = currentUrl.split("/").pop();

  //   console.log("Order ID:", orderId);
  // }
});
