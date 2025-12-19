import * as fs from "fs";
import * as path from "path";
import { TestConfig, CarSubscriptionConfig } from "../types/config.js";

/**
 * 載入與測試檔案同名的配置檔案
 * @param testFilePath - 測試檔案的完整路徑
 * @returns 配置物件
 */
export function loadTestConfig(testFilePath: string): TestConfig | CarSubscriptionConfig {
  try {
    const testFileName = path.basename(testFilePath, ".spec.ts");
    const configFileName = `${testFileName}.config.json`;
    const configPath = path.join(path.dirname(testFilePath), configFileName);

    const configFile = fs.readFileSync(configPath, "utf8");
    return JSON.parse(configFile) as TestConfig | CarSubscriptionConfig;
  } catch (error) {
    const testFileName = path.basename(testFilePath, ".spec.ts");
    console.error(
      `無法載入配置檔案，請確保 ${testFileName}.config.json 存在且格式正確`
    );
    throw error;
  }
}

/**
 * 載入指定名稱的配置檔案
 * @param configName - 配置檔案名稱（不含 .json）
 * @param configDir - 配置檔案所在目錄（可選）
 * @returns 配置物件
 */
export function loadConfig<T = any>(configName: string, configDir: string = __dirname): T {
  try {
    const configPath = path.join(configDir, `${configName}.json`);
    const configFile = fs.readFileSync(configPath, "utf8");
    return JSON.parse(configFile) as T;
  } catch (error) {
    console.error(`無法載入配置檔案，請確保 ${configName}.json 存在且格式正確`);
    throw error;
  }
}