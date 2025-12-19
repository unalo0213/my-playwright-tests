import { getConfig } from "../cms/cms.config.js";
const config = getConfig();

export function getHeader_memberId(systemKind: string, token: string) {
    return {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'x-authorization': token,
        'X-MemberId': config.memberId,
        'X-System-Kind': systemKind,
        'X-Platform': 'IOS'
    };
}
