import { IpcRendererEvent } from "electron";

import Channel from "../base/render";

import {
  CHANNEL_NAME,
  SET_SRC,
  GET_SRC,
  GET_IS_DARK,
  ON_SRC_CHANGED,
  ON_SYS_UPDATED,
  IWebApi,
} from "./events";

export default class ChannelTheme extends Channel {
  public static CHANNEL_NAME = CHANNEL_NAME;

  constructor() {
    super();

    const self = this;
    const api: IWebApi = {
      // 修改主题来源
      setThemeSrc(themeSource: string) {
        return self.ipcRendererInvoke(SET_SRC, themeSource);
      },

      // 获取当前主题来源
      getThemeSrc() {
        return self.ipcRendererInvoke(GET_SRC);
      },

      // 获取是否为深色主题
      getIsDark() {
        return self.ipcRendererInvoke(GET_IS_DARK);
      },

      // 监听主题来源更新
      onSrcChanged(callback: (event: IpcRendererEvent, ...args: any[]) => void) {
        return self.ipcRendererOn(ON_SRC_CHANGED, callback);
      },

      // 监听系统主题更新
      onSysUpdated(callback: (event: IpcRendererEvent, ...args: any[]) => void) {
        return self.ipcRendererOn(ON_SYS_UPDATED, callback);
      },
    }
    this.exposeInWorld(api);
  }
}
