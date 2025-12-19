import { getConfig } from "../cms/cms.config.js";
const config = getConfig();

export function getHeader_toC(systemKind: string) {
    return {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'X-System-Kind': systemKind,
        'X-Platform': 'WEB'
    };
}
