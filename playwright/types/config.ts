export interface EnvConfig {
  /** 環境名 */
  ENV_NAME: string;
  /** 前台帳號 */
  ACCOUNT: string;
  /** 前台密碼 */
  PASSWORD: string;
  /** 前台網址 */
  BASE_URL: string;
  /** 後台帳號 */
  ADMIN_ACCOUNT: string;
  /** 後台密碼 */
  ADMIN_PASSWORD: string;
  /** 後台PRE帳號 */
  ADMIN_PRE_ACCOUNT: string;
  /** 後台PRE密碼 */
  ADMIN_PRE_PASSWORD: string;

  /** 後台收銀台網址 */
  ADMIN_CASHIER_URL: string;
  /** 後台CMS網址 */
  ADMIN_CMS_URL: string;
  /** 後台2G網址 */
  ADMIN_2G_URL: string;
  /** 後台PRE網址 */
  ADMIN_PRE_URL: string;
  /** 後台LRental網址 */
  ADMIN_LRENTAL_URL: string;
  TIMEOUT: string;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvConfig { }
  }
}