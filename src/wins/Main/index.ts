import { BrowserWindow, BrowserViewConstructorOptions, globalShortcut } from 'electron';

import { APP_SETTING_FILE } from '../../consts';
import { AppData } from '../../utils/native';

// electron-forge自动注入，[入口名]_WEBPACK_ENTRY 和 [入口名]_PRELOAD_WEBPACK_ENTRY
declare const MAIN_WEBPACK_ENTRY: string;
declare const MAIN_PRELOAD_WEBPACK_ENTRY: string;

export default class Main extends BrowserWindow {
  settings: AppData;

  constructor(options?: BrowserViewConstructorOptions) {
    super({
      webPreferences: {
        preload: MAIN_PRELOAD_WEBPACK_ENTRY
      },
      ...options
    });
    this.loadURL(MAIN_WEBPACK_ENTRY);

    const settings = new AppData("appData", APP_SETTING_FILE);
    this.settings = settings;

    this.setMenu(null);

    const webContents = this.webContents;
    globalShortcut.register("CommandOrControl+Shift+i", function () {
      if (webContents.isDevToolsOpened())
        webContents.closeDevTools();
      else
        webContents.openDevTools();
    })

    const foo = async () => {
      const { maximize, console } = (await settings.Read()) ?? {};
      if (maximize) this.maximize();
      if (console) webContents.openDevTools();
    };
    foo();

    this.addListener("close", () => {
      // 关闭时记录窗口状态
      const bounds = this.getBounds();
      settings.Write({
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height,
        fullscreen: this.isFullScreen(),
        maximize: this.isMaximized(),
        console: webContents.isDevToolsOpened(),
      })
    })
  }
}
