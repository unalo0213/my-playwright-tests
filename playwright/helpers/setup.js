// @ts-check
import * as fs from "fs";
import * as path from "path";

console.log("🚀 開始設定環境檔案...");

/**
 * @typedef {Object} EnvFile
 * @property {string} src
 * @property {string} dest
 */

/** @type {EnvFile[]} */
const envFiles = [
  { src: "env_example/.env.beta", dest: ".env.beta" },
  { src: "env_example/.env.int", dest: ".env.int" },
  { src: "env_example/.env.prod", dest: ".env.prod" },
];

envFiles.forEach(({ src, dest }) => {
  try {
    const srcPath = path.join(process.cwd(), src);
    const destPath = path.join(process.cwd(), dest);

    /** 如果已有檔案不做複製 */
    if (fs.existsSync(destPath)) {
      console.log(`ℹ️  ${dest} 已存在，跳過複製該檔案`);
      return;
    }

    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`✅ 已複製 ${src} → ${dest}`);
    } else {
      console.warn(`⚠️  找不到 ${src}`);
    }
  } catch (error) {
    console.error(`❌ 複製 ${src} 時發生錯誤:`, /** @type {Error} */ (error).message);
  }
});