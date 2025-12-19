import { getConfig } from "../cms/cms.config.js";
const config = getConfig();

export function getOtherPhone(currentPhone: string) {
    if (currentPhone === config.phone) return config.resetPhone;
    if (currentPhone === config.resetPhone) return config.phone;
    throw new Error(`未知的門號: ${currentPhone}`);
}
