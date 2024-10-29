
export const CHANNEL_NAME = "process";

export const ENV = `${CHANNEL_NAME}:env`; // 将node的env导入页面

export type IWebApi = {
  env: { [key: string]: string };
}
export type IWebClassApi = { [key in Capitalize<keyof IWebApi> ]: IWebApi[keyof IWebApi] }
