import { app, dialog, ipcMain, nativeTheme, BaseWindow, BrowserWindowConstructorOptions } from 'electron';
import path from "node:path";

import { CHANNEL_THEME_CHANGED, CHANNEL_THEME_CURRENT } from '../events';
import Main from '../wins/Main';
import Test from '../wins/Test';

import { APP_SETTING_FILE } from '../consts';
import { AppData } from '../utils/native';

import { IAppOptions } from './interface';

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

    // 注册全局主题切换方法
    ipcMain.handle(CHANNEL_THEME_CHANGED, function (event, value) {
      nativeTheme.themeSource = value;
      return nativeTheme.themeSource;
    })
    ipcMain.handle(CHANNEL_THEME_CURRENT, function () {
      return nativeTheme.themeSource;
    })

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

    this.win = new Main(options);
    // new Test(options); // 测试多窗口用
  }
}
