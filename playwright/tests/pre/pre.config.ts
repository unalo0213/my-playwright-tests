interface preConfig {
    /** 車號 */
    plateNo: string;
    /** 門號 */
    phone: string;
    /** 備註 */
    note: string;
    /** 上傳檔案 */
    uploadfile: string;

}

export const getConfig = (): preConfig => {
    switch (process.env.ENV_NAME) {
        case 'prod':
            return {
                plateNo: 'xxx',
                phone: '0917132085',
                note: '系統測試訂單，請勿理會，謝謝',
                uploadfile: '/Users/K2108/Desktop/圖/1.pdf',
            };
        case 'beta':
            return {
                //plateNo: 'RAS-3330',
                //plateNo: 'RCZ-8886',
                //plateNo: 'RCT-7997',
                //plateNo: 'RBU-2176',
                plateNo: ' RCX-8289',
                phone: '0944280713',
                note: '系統測試訂單，請勿理會',
                uploadfile: '/Users/K2108/Desktop/圖/1.pdf',
            };
        default:
            throw new Error(`Unknown ENV_NAME: ${process.env.ENV_NAME}`);
    }
}

