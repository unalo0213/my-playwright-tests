interface car2goConfig {
  /** 訂車人電話 */
  phone: string;
  acctId: string;
  acctName: string;
  dbName_auth: string;
}

export const getConfig = (): car2goConfig => {
  switch (process.env.ENV_NAME) {
    case "prod":
      return {
        phone: "0917132085",
        acctId: "F",
        acctName: "F",
        dbName_auth: "F",
      };
    case "beta":
      return {
        phone: "0903005344",
        acctId: "2402110",
        acctName: "344",
        dbName_auth: "beta-auth",
      };
    default:
      throw new Error(`Unknown ENV_NAME: ${process.env.ENV_NAME}`);
  }
};
