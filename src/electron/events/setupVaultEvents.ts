import { BrowserWindow, dialog, ipcMain, IpcMainEvent, safeStorage } from 'electron';

import { OPEN_CREATE_VAULT, OPEN_EXISTING_VAULT, UNLOCK_VAULT } from '@constants/events';

import { VaultType } from '../../types/vault.type';
import { connectAndSaveDB, findAndConnectDB } from '../helpers/database.helper';

import seedCategories from '@database/seed/seedCategories';
import seedAssetTypes from '@database/seed/seedAssetTypes';
import seedAccountTypes from '@database/seed/seedAccountTypes';
import seedSettings from '@database/seed/seedSettings';

const setupVaultEvents = async (win: BrowserWindow) => {
  ipcMain.handle(OPEN_CREATE_VAULT, async () => {
    if (win) {
      const { filePath } = await dialog.showSaveDialog(win, {
        title: 'Canutin',
        filters: [{ name: 'DatabaseType', extensions: ['vault'] }],
      });

      return {
        newFilePath: filePath,
        isEncryptionAvailable: safeStorage.isEncryptionAvailable(),
      };
    }
  });

  ipcMain.handle(OPEN_EXISTING_VAULT, async () => {
    if (win) {
      const { filePaths } = await dialog.showOpenDialog(win, {
        properties: ['openFile'],
        filters: [{ name: 'DatabaseType', extensions: ['vault'] }],
      });

      return {
        existingFilePath: filePaths[0],
        isEncryptionAvailable: safeStorage.isEncryptionAvailable(),
      };
    }
  });

  ipcMain.on(UNLOCK_VAULT, async (_: IpcMainEvent, vault: VaultType) => {
    const { isNew, filePath, masterKey, rememberMasterKey } = vault;

    if (win) {
      if (isNew) {
        await connectAndSaveDB(win, filePath, masterKey, rememberMasterKey);
        await seedSettings();
        await seedAccountTypes();
        await seedAssetTypes();
        await seedCategories();
      } else {
        await findAndConnectDB(win, filePath, masterKey, rememberMasterKey);
      }
    }
  });
};

export default setupVaultEvents;
