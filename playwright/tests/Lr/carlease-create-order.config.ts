interface CreateOrderConfig {
  /** 車型選擇 */
  carType: string;
  /** 客戶選擇 */
  customerId: string;
}

export const getConfig = (): CreateOrderConfig => {
  switch (process.env.ENV_NAME) {
    case "int":
      return {
        carType: "3005I900",
        customerId: "A126370811",
      };
    case "beta":
      return {
        carType: "3005I900",
        customerId: "A126370811",
      };
    case "prod":
    default:
      return {
        carType: "3005I900",
        customerId: "A126370811",
      };
  }
};
