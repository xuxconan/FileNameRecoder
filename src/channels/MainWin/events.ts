
export const CHANNEL_NAME = "channel_win_main";

export const LOAD_SUB_FILES = `${CHANNEL_NAME}:load_sub_files`; // 加载子文件列表

export type IWebApi = {
  loadSubFiles: (path: string) => Promise<any[]>;
}
export type IWebClassApi = { [key in Capitalize<keyof IWebApi> ]: IWebApi[keyof IWebApi] }
