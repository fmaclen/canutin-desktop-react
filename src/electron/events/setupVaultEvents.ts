import { BrowserWindow, dialog, ipcMain, IpcMainEvent } from 'electron';

import { OPEN_CREATE_VAULT, OPEN_EXISTING_VAULT, UNLOCK_VAULT } from '@constants/events';

import { VaultType } from '../../types/vault.type';
import { connectAndSaveDB } from '../helpers/database.helper';

import seedCategories from '@database/seed/seedCategories';
import seedAssetTypes from '@database/seed/seedAssetTypes';
import seedAccountTypes from '@database/seed/seedAccountTypes';
import seedSettings from '@database/seed/seedSettings';

const setupVaultEvents = async (win: BrowserWindow) => {
  ipcMain.handle(OPEN_CREATE_VAULT, async () => {
    if (win) {
      const { filePath } = await dialog.showSaveDialog(win, {
        filters: [{ name: 'DatabaseType', extensions: ['sqlite'] }],
      });

      return filePath;
    }
  });

  ipcMain.handle(OPEN_EXISTING_VAULT, async () => {
    if (win) {
      const { filePaths } = await dialog.showOpenDialog(win, {
        properties: ['openFile'],
        filters: [{ name: 'DatabaseType', extensions: ['sqlite'] }],
      });

      return filePaths[0];
    }
  });

  ipcMain.on(UNLOCK_VAULT, async (_: IpcMainEvent, vault: VaultType) => {
    if (win) {
      await connectAndSaveDB(win, vault.filePath, vault.masterKey);

      if (vault.isNew) {
        await seedSettings();
        await seedAccountTypes();
        await seedAssetTypes();
        await seedCategories();
      }
    }
  });
};

export default setupVaultEvents;
