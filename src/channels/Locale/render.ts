import { IpcRendererEvent } from "electron";

import Channel from "../base/render";

import {
  CHANNEL_NAME,
  SET_LOCALE,
  GET_LOCALE,
  ON_LOCALE_CHANGED,
  IWebApi,
} from "./events";

export default class ChannelMain extends Channel {
  public static CHANNEL_NAME = CHANNEL_NAME;

  constructor() {
    super();
    const self = this;
    const api: IWebApi = {
      // 设置语言
      setLocale: (locale: string) => {
        return self.ipcRendererInvoke(SET_LOCALE, locale);
      },

      // 设置语言
      getLocale: () => {
        return self.ipcRendererInvoke(GET_LOCALE);
      },

      // 当前语言改变
      onLocaleChanged(callback: (event: IpcRendererEvent, ...args: any[]) => void) {
        return self.ipcRendererOn(ON_LOCALE_CHANGED, callback);
      },
    }
    this.exposeInWorld(api);
  }
}
