import type { IpcRendererEvent } from "electron";

export const CHANNEL_NAME = "channel_locale";

export const GET_LOCALE = `${CHANNEL_NAME}:get_locale`; // 设置语言
export const SET_LOCALE = `${CHANNEL_NAME}:set_locale`; // 设置语言
export const ON_LOCALE_CHANGED = `${CHANNEL_NAME}:on_locale_changed`; // 当前语言改变

export type IWebApi = {
  setLocale: (locale: string) => Promise<string>;
  getLocale: () => Promise<string>;
  onLocaleChanged: (callback: (event: IpcRendererEvent, ...args: any[]) => void) => void;
}
export type IWebClassApi = { [key in Capitalize<keyof IWebApi> ]: IWebApi[keyof IWebApi] }
