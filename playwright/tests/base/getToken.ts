import { getConfig } from '../cms/cms.config.js';
const config = getConfig();

export async function getToken(request) {
    const loginUrl = `${process.env.LOGIN_TOKEN}/v1/login`;
    const loginData = {
        'account': process.env.ADMIN_ACCOUNT,
        'password': process.env.ADMIN_PASSWORD,
        'type': "CARPLUS",
    };
    const loginRes = await request.post(loginUrl, { data: loginData });
    const loginBody = await loginRes.json();
    const token = loginBody.data?.token;
    return token;
}
