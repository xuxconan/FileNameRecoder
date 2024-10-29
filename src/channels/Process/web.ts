import Channel from "../base/web";

import {
  CHANNEL_NAME,
  IWebApi,
  IWebClassApi,
} from "./events";

export default class ChannelProcess extends Channel implements IWebClassApi {
  public static CHANNEL_NAME = CHANNEL_NAME;

  api: IWebApi;
  constructor() {
    super();

    const self = this;
    Object.defineProperty(this, "Env", {
      get() { return self.api.env; }
    })
  }

  Env: any = {};
}
