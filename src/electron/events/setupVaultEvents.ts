import { BrowserWindow, dialog, ipcMain, IpcMainEvent, safeStorage } from 'electron';
import { existsSync } from 'fs';

import {
  VAULT_OPEN_SAVE_DIALOG,
  VAULT_OPEN_EXISTING_FILE_DIALOG,
  VAULT_UNLOCK,
} from '@constants/vault';
import { DEVICE_HAS_SAFE_STORAGE } from '@constants/events';

import { VaultType } from '../../types/vault.type';
import { connectAndSaveVault, findAndConnectVault } from '../helpers/database.helper';

import seedCategories from '@database/seed/seedCategories';
import seedAssetTypes from '@database/seed/seedAssetTypes';
import seedAccountTypes from '@database/seed/seedAccountTypes';
import seedSettings from '@database/seed/seedSettings';

const setupVaultEvents = async (win: BrowserWindow) => {
  ipcMain.handle(VAULT_OPEN_SAVE_DIALOG, async () => {
    if (win) {
      const { filePath } = await dialog.showSaveDialog(win, {
        title: 'Canutin',
        defaultPath: '~/Canutin.vault',
        filters: [{ name: 'DatabaseType', extensions: ['vault'] }],
      });

      return filePath;
    }
  });

  ipcMain.handle(VAULT_OPEN_EXISTING_FILE_DIALOG, async () => {
    if (win) {
      const { filePaths } = await dialog.showOpenDialog(win, {
        properties: ['openFile'],
        filters: [{ name: 'DatabaseType', extensions: ['vault'] }],
      });

      return filePaths[0];
    }
  });

  ipcMain.on(VAULT_UNLOCK, async (_: IpcMainEvent, vault: VaultType) => {
    const { vaultPath, vaultMasterKey, rememberVaultMasterKey } = vault;

    if (win) {
      if (!existsSync(vaultPath)) {
        await connectAndSaveVault(win, vaultPath, vaultMasterKey, rememberVaultMasterKey);
        await seedSettings();
        await seedAccountTypes();
        await seedAssetTypes();
        await seedCategories();
      } else {
        await findAndConnectVault(win, vaultPath, vaultMasterKey, rememberVaultMasterKey);
      }
    }
  });

  ipcMain.handle(DEVICE_HAS_SAFE_STORAGE, async () => {
    if (win) {
      return safeStorage.isEncryptionAvailable();
    }
  });
};

export default setupVaultEvents;
