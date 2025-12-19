interface car2goConfig {
    /** 訂車人電話 */
    phone: string;

}


export const getConfig = (): car2goConfig => {
    switch (process.env.ENV_NAME) {
        case 'prod':
            return {
                phone: '0917132085',
            };
        case 'beta':
            return {
                phone: '0903005344',
            };
        default:
            throw new Error(`Unknown ENV_NAME: ${process.env.ENV_NAME}`);
    }
}

