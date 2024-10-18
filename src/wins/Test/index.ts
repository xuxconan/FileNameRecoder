import { BrowserWindow, BrowserViewConstructorOptions, globalShortcut } from 'electron';

// electron-forge自动注入，[入口名]_WEBPACK_ENTRY 和 [入口名]_PRELOAD_WEBPACK_ENTRY
declare const TEST_WEBPACK_ENTRY: string;
declare const TEST_PRELOAD_WEBPACK_ENTRY: string;

export default class Test extends BrowserWindow {
  constructor(options?: BrowserViewConstructorOptions) {
    super({
      webPreferences: {
        preload: TEST_PRELOAD_WEBPACK_ENTRY
      },
      ...options
    });
    this.loadURL(TEST_WEBPACK_ENTRY);

    this.setMenu(null);

    const webContents = this.webContents;
    webContents.openDevTools();
    globalShortcut.register("CommandOrControl+Shift+I", function () {
      if (webContents.isDevToolsOpened())
        webContents.closeDevTools();
      else
        webContents.openDevTools();
    })
  }
}
