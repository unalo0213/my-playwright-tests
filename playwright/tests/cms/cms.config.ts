interface CmsConfig {
  /** ad帳號 */
  ad_account: string;
  /** ad密碼 */
  ad_password: string;
  /** 國碼 */
  nationalCode: string;
  /** 門號 */
  phone: string;
  /** 修改門號 */
  resetPhone: string;
  /** web密碼 */
  password: string;
  /** web修改密碼 */
  resetPassword: string;
  /** 會員acctId */
  acctId: string;
  /** 會員身份證 */
  loginId: string;
  /** 修改身份證 */
  resetLoginId: string;
  /** 拉黑備註 */
  banMemo: string;
  /** 拉/解黑備註 */
  unBanMemo: string;
  /** 員編memberId */
  memberId: string;
  /** mail信箱*/
  mail_account: string;
  /** mail信箱密碼*/
  mail_password: string;
  /** `beta-auth`.black_list */
  dbName: string;
  /** 人黑拉黑acctId */
  faceBlack_acctId: string;
  /** 人黑拉黑loginId */
  faceBlack_loginId: string;
}

export const getConfig = (): CmsConfig => {
  switch (process.env.ENV_NAME) {
    case "prod":
      return {
        ad_account: "F",
        ad_password: "F",
        nationalCode: "F",
        phone: "F",
        resetPhone: "F",
        password: "F",
        resetPassword: "F",
        acctId: "F",
        loginId: "F",
        resetLoginId: "F",
        banMemo: "系統測試-拉黑",
        unBanMemo: "系統測試-解黑",
        memberId: "F",
        mail_account: "F",
        mail_password: "F",
        dbName: "F",
        faceBlack_acctId: "F",
        faceBlack_loginId: "F",
      };
    case "beta":
      return {
        ad_account: "una.lo",
        ad_password: "Uuuu1111",
        nationalCode: "886",
        phone: "0903005344",
        resetPhone: "0944213344",
        password: "Uuuu1111",
        resetPassword: "Uuuu1111",
        acctId: "2402110",
        loginId: "F225006006",
        resetLoginId: "F222246008",
        banMemo: "系統測試-拉黑",
        unBanMemo: "系統測試-解黑",
        memberId: "K2108",
        mail_account: "e0903005344@gmail.com",
        mail_password: "Carplus122088",
        dbName: "beta-auth",
        faceBlack_acctId: "359619",
        faceBlack_loginId: "C220509349",
      };
    default:
      throw new Error(`Unknown ENV_NAME: ${process.env.ENV_NAME}`);
  }
};
