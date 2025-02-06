import Channel from "../base/main";

import {
  CHANNEL_NAME,
  SET_LOCALE,
  GET_LOCALE,
  ON_LOCALE_CHANGED,
} from "./events";

import i18n from "../../libs/common/I18n";

export default class ChannelLocale extends Channel {
  public static CHANNEL_NAME = CHANNEL_NAME;

  // 设置语言，并给所有窗口发送语言改变事件
  public static SetLocale() {
    this.ipcMainHandle(SET_LOCALE, (event, value) => {
      i18n.locale = value;
      this.broadcastToAllWebContents(ON_LOCALE_CHANGED, i18n.locale);
      return i18n.locale;
    })
  }

  // 获取语言
  public static GetLocale() {
    this.ipcMainHandle(GET_LOCALE, (event, value) => {
      return i18n.locale;
    });
  }
}
