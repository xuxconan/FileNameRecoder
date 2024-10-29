import Preload from "../../global/preload";
import ChannelTheme from "../../channels/Theme/render";

class MainPreload extends Preload {
  constructor() {
    super();
    new ChannelTheme(); // 处理都写在构造函数内了
  }
}
new MainPreload();
