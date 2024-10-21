
import { contextBridge, ipcRenderer } from "electron/renderer";
import { CHANNEL_THEME, CHANNEL_THEME_CHANGED, CHANNEL_THEME_CURRENT } from "../../events";

contextBridge.exposeInMainWorld(CHANNEL_THEME, {
  changed(...params: any[]) { return ipcRenderer.invoke(CHANNEL_THEME_CHANGED, ...params) },
  current(...params: any[]) { return ipcRenderer.invoke(CHANNEL_THEME_CURRENT, ...params) },
})
