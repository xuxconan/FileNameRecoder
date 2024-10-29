// 主进程用
import { webContents, ipcMain, IpcMainInvokeEvent } from "electron";

export default class Channel {
  public static CHANNEL_NAME = "channel";

  // 添加ipc监听的方法
  protected static ipcMainHandle(
    event: string,
    listener: (event: IpcMainInvokeEvent, ...args: any[]) => (Promise<any>) | (any),
    once?: boolean
  ) {
    console.assert(!!ipcMain, "IpcMain unavailable !!");
    if (once) ipcMain.handleOnce(event, listener);
    else ipcMain.handle(event, listener);
  }

  // 广播到所有webContent
  protected static broadcastToAllWebContents(event: string, ...params: any[]) {
    console.assert(!!webContents, "WebContents unavailable !!");
    webContents.getAllWebContents().forEach((wc) => {
      wc.send(event, ...params);
    });
  }
}
