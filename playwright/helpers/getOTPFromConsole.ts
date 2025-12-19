export async function getOTPFromConsole(): Promise<string> {
  process.stdin.resume();
  process.stdout.write("請輸入收到的 OTP 驗證碼: ");

  return new Promise((resolve) => {
    process.stdin.once("data", (data) => {
      const input = data.toString().trim();
      resolve(input);
      process.stdin.pause();
    });
  });
}
