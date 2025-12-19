interface Config {
    phone: string;
    resetPhone: string;
    nationalCode: string;
}
interface Headers {
    [key: string]: string;
}

export async function getPhone(
    request: any,
    headers: Headers,
    config: Config
): Promise<string> {

    const phoneList = [config.phone, config.resetPhone];
    for (const phone of phoneList) {
        const url = `${process.env.INTERNAL_ADMIN_AUDIT}/v1/users/queryWithTmpUser?mainCell=${phone}&nationalCode=${config.nationalCode}`;
        const res = await request.get(url, { headers });
        if (res.ok()) {
            const body = await res.json();
            const data = body?.data?.usersEntity;
            if (data?.mainCell) {
                return data.mainCell as string;
            }
        }
    }
    throw new Error("❌ config.phone / config.resetPhone 都查不到 currentPhone");
}
