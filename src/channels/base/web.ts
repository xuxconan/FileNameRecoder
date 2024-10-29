// 页面用
export default class Channel {
  public static CHANNEL_NAME = "channel";

  api: any;
  constructor() {
    this.api = (window as any)[(this.constructor as any).CHANNEL_NAME];
  }
}
