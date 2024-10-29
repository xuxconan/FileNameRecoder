import type { IpcRendererEvent } from "electron";

import Channel from "../base/web";

import {
  CHANNEL_NAME,
  IWebApi,
  IWebClassApi,
} from "./events"

export default class ChannelTheme extends Channel implements IWebClassApi {
  public static CHANNEL_NAME = CHANNEL_NAME;

  api: IWebApi;

  SetThemeSrc(themeSource: string) {
    return this.api?.setThemeSrc(themeSource);
  }

  GetThemeSrc() {
    return this.api?.getThemeSrc();
  }

  GetIsDark() {
    return this.api?.getIsDark();
  }

  OnSrcChanged(callback: (event: IpcRendererEvent, ...args: any[]) => void) {
    return this.api?.onSrcChanged(callback);
  }

  OnSysUpdated(callback: (event: IpcRendererEvent, ...args: any[]) => void) {
    return this.api?.onSysUpdated(callback);
  }

}
