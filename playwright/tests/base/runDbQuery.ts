import { spawn, execSync } from "child_process";
import mysql from "mysql2/promise";
import fs from "fs";

/**
 * 通用資料庫執行器
 * @param callback 傳入要在資料庫連線中執行的非同步函式
 */
export async function runDbQuery(
  dbName: string,
  callback: (connection: any) => Promise<void>
) {
  const localPort = 3325; // 固定 Port，不再需要手動累加
  const keyPath = process.env.SSH_KEY_PATH;
  const remoteDbHost = "10.115.176.7";
  const sshJumpHost = "carplusqa@34.80.59.102";

  console.log(`▶DB啟動(Port: ${localPort})...`);

  // --- 1. 防呆：自動修正金鑰權限 ---
  try {
    const stats = fs.statSync(keyPath);
    const permissions = "0" + (stats.mode & 0o777).toString(8);
    if (permissions !== "0600") {
      console.log(`🛡️  偵測到金鑰權限為 ${permissions}，自動修正為 0600...`);
      execSync(`chmod 600 ${keyPath}`);
    }
  } catch (e) {
    console.error(`❌ 無法存取金鑰檔案: ${e.message}`);
  }

  // --- 2. 防呆：清理殘留的舊 Port 連線 ---
  try {
    // 尋找並強行殺掉佔用此 Port 的所有進程
    execSync(`lsof -t -i:${localPort} | xargs kill -9`, { stdio: "ignore" });
    await new Promise((r) => setTimeout(r, 500));
    //console.log(`🧹 已清理 Port ${localPort} 的舊連線進程`);
  } catch (e) {
    // 沒人佔用時會報錯，忽略即可
  }

  // --- 3. 建立 SSH 隧道 ---
  const sshProcess = spawn("ssh", [
    "-i",
    keyPath,
    "-L",
    `${localPort}:${remoteDbHost}:3306`,
    sshJumpHost,
    "-N",
    "-o",
    "StrictHostKeyChecking=no",
    "-o",
    "ExitOnForwardFailure=yes", // 這裡很有用，但要確保它真的會結束進程
    "-o",
    "ConnectTimeout=10",
  ]);

  // 監聽 SSH 錯誤 Log
  sshProcess.on("exit", (code) => {
    if (code !== 0 && code !== null) {
      console.error(`[SSH Exit]: 隧道非預期中斷，代碼: ${code}`);
    }
  });

  let connection;
  try {
    // --- 4. 實施連線重試機制 (最多試 5 次) ---
    let connected = false;
    for (let i = 1; i <= 3; i++) {
      try {
        await new Promise((r) => setTimeout(r, 1500)); // 每次等 1.5 秒
        connection = await mysql.createConnection({
          host: "127.0.0.1",
          port: localPort,
          user: process.env.DB_USER,
          password: process.env.DB_PWD, // 建議從 process.env 讀取
          database: dbName,
          connectTimeout: 5000,
        });
        connected = true;
        break;
      } catch (err) {
        console.log(`⏳ 等待隧道建立中... 第 ${i} 次嘗試`);
      }
    }

    if (!connected) throw new Error(`無法在 Port ${localPort} 建立連線`);

    console.log("▶資料庫連線成功！執行測試步驟...");

    // --- 5. 執行測試腳本傳進來的邏輯 ---
    await callback(connection);
  } catch (error) {
    console.error(`❌ [DB Runner Error]: ${error.message}`);
    throw error;
  } finally {
    // --- 6. 資源回收：先關 DB 再殺 SSH ---
    if (connection) {
      await connection.end();
      console.log("\n▶資料庫連線已結束");
    }
    sshProcess.kill("SIGTERM");
    //console.log("🔒 SSH 隧道已關閉");
  }
}
