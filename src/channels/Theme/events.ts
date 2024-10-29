import type { IpcRendererEvent } from "electron";

export const CHANNEL_NAME = "channel_theme";

export const SET_SRC = `${CHANNEL_NAME}:set_src`; // 改变当前主题来源
export const GET_SRC = `${CHANNEL_NAME}:get_src`; // 获取当前主题来源
export const GET_IS_DARK = `${CHANNEL_NAME}:get_is_dark`; // 获取是否为深色主题
export const ON_SRC_CHANGED = `${CHANNEL_NAME}:on_src_changed`; // 当前主题来源改变
export const ON_SYS_UPDATED = `${CHANNEL_NAME}:on_sys_updated`; // 系统主题更新

export type IWebApi = {
  setThemeSrc: (themeSource: string) => Promise<string>;
  getThemeSrc: () => Promise<string>;
  getIsDark: () => Promise<boolean>;
  onSrcChanged: (callback: (event: IpcRendererEvent, ...args: any[]) => void) => void;
  onSysUpdated: (callback: (event: IpcRendererEvent, ...args: any[]) => void) => void;
}
export type IWebClassApi = { [key in Capitalize<keyof IWebApi> ]: IWebApi[keyof IWebApi] }
