import { BaseWindowConstructorOptions, BrowserViewConstructorOptions } from "electron";

export type IAppOptions = BaseWindowConstructorOptions & BrowserViewConstructorOptions & {
  schemes?: string;
}
