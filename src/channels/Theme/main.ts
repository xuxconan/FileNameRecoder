import { nativeTheme } from "electron";

import Channel from "../base/main";

import {
  THEME_SYSTEM,
  THEME_LIGHT,
  THEME_DARK,
} from "../../consts";

import {
  CHANNEL_NAME,
  SET_SRC,
  GET_SRC,
  GET_IS_DARK,
  ON_SRC_CHANGED,
  ON_SYS_UPDATED,
} from "./events";

export default class ChannelTheme extends Channel {
  public static CHANNEL_NAME = CHANNEL_NAME;

  // 设置主题来源，并给所有窗口发送主题来源改变事件
  public static SetSrc() {
    this.ipcMainHandle(SET_SRC, (event, value) => {
      nativeTheme.themeSource = value;
      this.broadcastToAllWebContents(ON_SRC_CHANGED, nativeTheme.themeSource);
      return nativeTheme.themeSource;
    })
  }

  // 获取主题来源
  public static GetSrc() {
    this.ipcMainHandle(GET_SRC, (event, value) => {
      return nativeTheme.themeSource;
    });
  }

  // 获取当前是否为深色主题
  public static GetIsDark() {
    this.ipcMainHandle(GET_IS_DARK, (event, value) => {
      return nativeTheme.shouldUseDarkColors;
    });
  }

  // 当系统主题色改变时，广播给所有窗口应该使用什么主题
  public static ListenSysThemeUpdated() {
    console.assert(!!nativeTheme, "NativeTheme unavailable !!");
    nativeTheme.addListener("updated", () => {
      if (nativeTheme.themeSource !== THEME_SYSTEM) return;
      ChannelTheme.broadcastToAllWebContents(ON_SYS_UPDATED, nativeTheme.shouldUseDarkColors);
    })
  }
}
