import { app, BrowserWindow, ipcMain, IpcMainInvokeEvent } from 'electron';

import { APP_WINDOW_CONTROL, APP_INFO } from '@constants/app';
import { WindowControlEnum } from '@appConstants/misc';

const setupAppEvents = async (win: BrowserWindow) => {
  ipcMain.on(APP_WINDOW_CONTROL, async (e, action: WindowControlEnum) => {
    if (win) {
      switch (action) {
        case WindowControlEnum.MINIMIZE:
          win.minimize();
          break;
        case WindowControlEnum.MAXIMIZE:
          win.isMaximized() ? win.unmaximize() : win.maximize();
          break;
        case WindowControlEnum.CLOSE:
          win.close();
      }
    }
  });

  ipcMain.handle(APP_INFO, async (_: IpcMainInvokeEvent) => {
    return {
      version: app.getVersion(),
    };
  });
};

export default setupAppEvents;
