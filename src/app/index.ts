import { app, session, dialog, nativeTheme, BaseWindow, BrowserWindowConstructorOptions } from 'electron';
import path from "node:path";

import Main from '../wins/Main';
import Test from '../wins/Test';
import ChannelTheme from "../channels/Theme/main";

import { APP_SETTING_FILE } from '../consts';
import { AppData } from '../utils/native';

import { IAppOptions } from '../interfaces';

export default class App {
  win: BaseWindow;
  settings: AppData;

  constructor(options?: IAppOptions) {
    const settings = new AppData("appData", APP_SETTING_FILE);
    this.settings = settings;

    // Handle creating/removing shortcuts on Windows when installing/uninstalling.
    if (require('electron-squirrel-startup')) {
      app.quit();
    }

    // 注册通过schemes打开app的方式
    const schemes = options?.schemes;
    if (schemes && process.defaultApp) {
      if (process.argv.length >= 2) {
        app.setAsDefaultProtocolClient(
          schemes,
          process.execPath,
          [path.resolve(process.argv[1])]
        );
      }
    } else {
      app.setAsDefaultProtocolClient(schemes);
    }

    // 设置channel处理
    ChannelTheme.SetSrc();
    ChannelTheme.GetSrc();
    ChannelTheme.GetIsDark();
    ChannelTheme.ListenSysThemeUpdated();

    // 避免程序多开
    const singletonLock = app.requestSingleInstanceLock();
    if (!singletonLock) app.quit();
    else {
      app.on('second-instance', (event, commandLine, workingDirectory) => {
        // 用户正在尝试运行第二个实例，我们需要让焦点指向我们的窗口
        if (this.win) {
          if (this.win.isMinimized()) this.win.restore()
          this.win.focus()
        }
        // 命令行是一个字符串数组，其中最后一个元素是深度链接的URL。
        dialog.showErrorBox('Welcome Back', `You arrived from: ${commandLine.pop()}`)
      })

      // 如果没有窗口打开则打开一个窗口 (macOS)
      // app.on('ready', createWindow);
      app.whenReady().then(() => {

        // https://www.electronjs.org/docs/latest/tutorial/security
        session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
          callback({
            responseHeaders: {
              ...details.responseHeaders,
              'Content-Security-Policy': ['default-src \'self\' \'unsafe-inline\' \'unsafe-eval\';']
            }
          })
        })

        this.createMainWindow(options);

        app.on('activate', () => {
          if (BaseWindow.getAllWindows().length === 0) {
            this.createMainWindow(options);
          }
        })
      })
    }

    // 关闭所有窗口时退出应用 (Windows & Linux)
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') app.quit()
    })

    app.on("quit", () => {
      settings.Write({ theme: nativeTheme.themeSource });
    })
  }

  async createMainWindow(options?: BrowserWindowConstructorOptions) {
    // 获取上次配置
    const settings = this.settings;
    const { x, y, width, height, fullscreen, theme } = (await settings.Read()) ?? {};
    options.x = options.x ?? x;
    options.y = options.y ?? y;
    options.width = options.width ?? width ?? 800;
    options.height = options.height ?? height ?? 600;
    options.fullscreen = options.fullscreen ?? fullscreen ?? false;
    if (theme) nativeTheme.themeSource = theme;

    this.win = new Main({
      settings: settings,
      ...options
    });
    // new Test(options); // 测试多窗口用
  }
}
