import Channel from "../base/render";

import {
  CHANNEL_NAME,
  LOAD_SUB_FILES,
  IWebApi,
} from "./events";

export default class ChannelMain extends Channel {
  public static CHANNEL_NAME = CHANNEL_NAME;

  constructor() {
    super();
    const self = this;
    const api: IWebApi = {
      // 加载子文件列表
      loadSubFiles: (path: string) => {
        return self.ipcRendererInvoke(LOAD_SUB_FILES, path);
      }
    }
    this.exposeInWorld(api);
  }
}
