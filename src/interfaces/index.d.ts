import { BaseWindowConstructorOptions, BrowserViewConstructorOptions } from "electron";

import { AppData } from "@/utils/native";

export type IAppOptions = BrowserViewConstructorOptions & {
  schemes?: string;
}

export type IMainOptions = BrowserViewConstructorOptions & {
  settings?: AppData;
}
