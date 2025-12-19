import { getConfig } from '../cms/cms.config.js';
const config = getConfig();

export async function getPublicKey(request) {
    const loginUrl = `${process.env.COMMON_AUTH}/v3/users/publicKey`;
    const loginData = {
        'accept': 'application/json',
        'AcctId': config.acctId,
        'X-System-Kind': 'OFFICIAL',
        'X-Platform': 'WEB'
    };
    const loginRes = await request.get(loginUrl, { data: loginData });
    const loginBody = await loginRes.text();
    const publicKey = loginBody.data?.publicKey;
    console.log('✅取得PublicKey', publicKey);
    return publicKey;
}



