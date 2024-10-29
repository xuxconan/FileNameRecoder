// 渲染进程用
import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

export default class Channel {
  public static CHANNEL_NAME = "channel";

  // 获取渠道名
  protected channelName() {
    return (this.constructor as any).CHANNEL_NAME;
  }

  // 通过bridge将方法暴露到窗口中
  protected exposeInWorld(api: { [key: string]: any }, worldId?: number) {
    console.assert(!!contextBridge, "ContextBridge unavailable !!");
    const channelName = this.channelName();
    if (isNaN(worldId)) contextBridge.exposeInMainWorld(channelName, api);
    else contextBridge.exposeInIsolatedWorld(worldId, channelName, api);
  }

  // web <-> electron
  protected async ipcRendererInvoke(event: string, ...params: any[]) {
    console.assert(!!ipcRenderer, "IpcRenderer unavailable !!");
    return ipcRenderer.invoke(event, ...params);
  }

  // web -> electron
  protected ipcRendererSend(event: string, ...params: any[]) {
    console.assert(!!ipcRenderer, "IpcRenderer unavailable !!");
    return ipcRenderer.send(event, ...params);
  }

  // web <- electron
  protected ipcRendererOn(
    event: string,
    listener: (event: IpcRendererEvent, ...args: any[]) => void,
    once?: boolean
  ) {
    console.assert(!!ipcRenderer, "IpcRenderer unavailable !!");
    if (once) return ipcRenderer.once(event, listener);
    else return ipcRenderer.on(event, listener);
  }
}
