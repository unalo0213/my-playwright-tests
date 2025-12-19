interface Config {
    loginId: string;
    resetLoginId: string;
}
interface Headers {
    [key: string]: string;
}

export async function getLoginId(
    request: any,
    headers: Headers,
    config: Config
): Promise<string> {

    const loginIdList = [config.loginId, config.resetLoginId];
    for (const loginId of loginIdList) {
        const url = `${process.env.INTERNAL_ADMIN_AUDIT}/v1/users/queryWithTmpUser?loginId=${loginId}`;
        const res = await request.get(url, { headers });
        if (res.ok()) {
            const body = await res.json();
            const data = body?.data?.usersEntity;
            if (data?.loginId) {
                return data.loginId as string;
            }
        }
    }
    throw new Error("❌ 查不到currentLoginId");
}
