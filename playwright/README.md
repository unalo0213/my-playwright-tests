# Car-Plus 汽車訂閱服務自動化測試

## 安裝步驟

### 1. 安裝 Node.js

確保您的系統已安裝 Node.js (建議版本 18.20 或以上)：   
```
Windows 32-bit Installer: https://nodejs.org/dist/v18.20.8/node-v18.20.8-x86.msi
Windows 64-bit Installer: https://nodejs.org/dist/v18.20.8/node-v18.20.8-x64.msi
Windows 32-bit Binary: https://nodejs.org/dist/v18.20.8/win-x86/node.exe
Windows 64-bit Binary: https://nodejs.org/dist/v18.20.8/win-x64/node.exe
macOS 64-bit Installer: https://nodejs.org/dist/v18.20.8/node-v18.20.8.pkg
macOS Apple Silicon 64-bit Binary: https://nodejs.org/dist/v18.20.8/node-v18.20.8-darwin-arm64.tar.gz
macOS Intel 64-bit Binary: https://nodejs.org/dist/v18.20.8/node-v18.20.8-darwin-x64.tar.gz
```

```bash
node --version
```

並且安裝 yarn

```bash
npm install yarn -g
```

### 2. 安裝專案依賴

```bash
yarn install
```

### 3. 首次安裝 Playwright 瀏覽器 (僅第一次執行專案需要) + 複製 env

```bash
yarn setup
```

### 4. 設定帳號資訊

編輯`.env` 檔案，填入您的測試帳號資訊：

```yaml
# 登入帳號資訊
ACCOUNT=your_account_here
PASSWORD=your_password_here
```

## 使用方式

### 偵錯模式執行測試 (一步一步執行)

```bash
yarn debug
```

### 使用 UI 模式執行測試

```bash
yarn ui
```

### 以瀏覽器視窗顯示

```bash
yarn headed
```

### 執行所有測試 (無視窗)

```bash
yarn test
```

### 查看測試報告

```bash
yarn report
```
