interface SubConfig {
    /** 出還車站&時間 */
    departStation: string;
    returnStation: string;
    /** 訂車人身份證 */
    loginId: string;
    /** 3D驗證 */
    smsPin: string;
    /** 出車車牌 */
    plateNo: string;
    /** 員工編號 */
    memberId: string;
    /** 訂單備註 */
    note: string;
    /** 上傳檔案 */
    uploadfile: string;
}


export const getConfig = (): SubConfig => {
    switch (process.env.ENV_NAME) {
        case 'prod':
            return {
                departStation: '台北土城站',
                returnStation: '台北土城站',
                loginId: 'xxx',
                smsPin: 'xxx',
                plateNo: 'xxx',
                memberId: 'K2108',
                note: '系統測試訂單，請勿理會，謝謝',
                uploadfile: '/Users/K2108/Desktop/圖/1.pdf',
            };
        case 'beta':
            return {
                departStation: '台北土城站',
                returnStation: '台北土城站',
                loginId: 'F225006006',
                smsPin: '1234567',
                plateNo: 'RCT-2120',
                memberId: 'K2108',
                note: 'BETA系統測試訂單，請勿理會',
                uploadfile: '/Users/K2108/Desktop/圖/1.pdf',
            };
        default:
            throw new Error(`Unknown ENV_NAME: ${process.env.ENV_NAME}`);
    }
}

