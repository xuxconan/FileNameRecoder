import type { IpcRendererEvent } from "electron";

import Channel from "../base/web";

import {
  CHANNEL_NAME,
  IWebApi,
  IWebClassApi,
} from "./events";

export default class ChannelLocale extends Channel implements IWebClassApi {
  public static CHANNEL_NAME = CHANNEL_NAME;

  api: IWebApi;

  SetLocale(locale: string) {
    return this.api?.setLocale(locale);
  }

  GetLocale() {
    return this.api?.getLocale();
  }

  OnLocaleChanged(callback: (event: IpcRendererEvent, ...args: any[]) => void) {
    return this.api?.onLocaleChanged(callback);
  }
}
