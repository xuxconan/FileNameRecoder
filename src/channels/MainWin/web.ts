import Channel from "../base/web";

import {
  CHANNEL_NAME,
  IWebApi,
  IWebClassApi,
} from "./events";

export default class ChannelMain extends Channel implements IWebClassApi {
  public static CHANNEL_NAME = CHANNEL_NAME;

  api: IWebApi;

  LoadSubFiles(path: string) {
    return this.api?.loadSubFiles(path);
  }
}
