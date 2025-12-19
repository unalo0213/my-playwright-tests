import { getConfig } from "../cms/cms.config.js";
const config = getConfig();

export function getOtherLoginId(currentLoginId: string) {
    if (currentLoginId === config.loginId) return config.resetLoginId;
    if (currentLoginId === config.resetLoginId) return config.loginId;
    throw new Error(`未知的身份證: ${currentLoginId}`);
}
