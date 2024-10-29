import Channel from "../base/render";

import {
  ENV_EXPOSE_KEYS
} from "../../consts";

import {
  CHANNEL_NAME,
  IWebApi,
} from "./events";

export default class ChannelProcess extends Channel {
  public static CHANNEL_NAME = CHANNEL_NAME;

  constructor() {
    super();
    const exposeKeys = process.env[ENV_EXPOSE_KEYS]?.split(",") ?? [];
    const api: IWebApi = {
      env: Object.fromEntries(exposeKeys.map((key) => [key, process.env[key]]))
    }
    this.exposeInWorld(api);
  }
}
