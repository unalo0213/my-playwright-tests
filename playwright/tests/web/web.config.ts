interface CmsConfig {
  /** 會員acctId */
  acctId: string;
  /** 會員身份證 */
  loginId: string;
  /** 會員phone */
  phone: string;
  /** mail信箱*/
  mail: string;
  /** mail信箱密碼*/
  mail_pwd: string;
  /** `beta-auth`*/
  dbName_auth: string;
  /** 出車站*/
  departStation: string;
  /** 3D驗證 */
  smsPin: string;
  /** 訂單備註 */
  note: string;
}

export const getConfig = (): CmsConfig => {
  const envName = process.env.ENV_NAME || "beta"; // 添加這行
  switch (envName) {
    case "prod":
      return {
        acctId: "F",
        loginId: "F",
        phone: "F",
        mail: "F",
        mail_pwd: "F",
        dbName_auth: "F",
        departStation: "F",
        smsPin: "F",
        note: "F",
      };
    case "beta":
      return {
        acctId: "2402110",
        loginId: "F225006006",
        phone: "0903005344",
        mail: "e0903005344@gmail.com",
        mail_pwd: "Carplus122088",
        dbName_auth: "beta-auth",
        departStation: "台北土城站",
        smsPin: "123456",
        note: "系統測試訂單，請勿理會",
      };
    default:
      throw new Error(`Unknown ENV_NAME: ${process.env.ENV_NAME}`);
  }
};
