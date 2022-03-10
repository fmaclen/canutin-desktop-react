import { BrowserWindow, safeStorage } from 'electron';
import { existsSync } from 'fs';
import { ConnectionOptions } from 'typeorm';
import isDev from 'electron-is-dev';
import settings from 'electron-settings';

import connection, { dbConfig } from '@database/connection';
import {
  DATABASE_CONNECTED,
  DATABASE_DOES_NOT_EXIST,
  DATABASE_NOT_DETECTED,
  DATABASE_PATH,
  DATABASE_NOT_VALID,
  DATABASE_MASTER_KEY,
  DATABASE_MASTER_KEY_ENCODING,
  DATABASE_EXISTS_WITHOUT_MASTER_KEY,
} from '@constants';

export const connectAndSaveDB = async (
  win: BrowserWindow | null,
  filePath: string,
  masterKey: string,
  rememberMasterKey?: boolean
) => {
  try {
    const databaseConnection: ConnectionOptions = {
      ...dbConfig,
      database: filePath,
      type: 'better-sqlite3',
      driver: require('better-sqlite3-multiple-ciphers'),
      verbose: isDev ? console.log : undefined,
      prepareDatabase: db => {
        db.pragma(`CIPHER = 'sqlcipher'`);
        db.pragma(`KEY = '${masterKey}'`);
      },
    };
    const isConnected = await connection.isConnected();
    if (isConnected) await connection.close();

    await connection.create(databaseConnection);
    await settings.set(DATABASE_PATH, filePath);

    if (safeStorage.isEncryptionAvailable() && rememberMasterKey && masterKey) {
      const buffer = safeStorage.encryptString(masterKey);
      await settings.set(DATABASE_MASTER_KEY, buffer.toString(DATABASE_MASTER_KEY_ENCODING));
    }

    win?.webContents.send(DATABASE_CONNECTED, filePath);
  } catch (error) {
    await settings.set(DATABASE_MASTER_KEY, '');
    win?.webContents.send(DATABASE_NOT_VALID);
  }
};

export const findAndConnectDB = async (
  win: BrowserWindow | null,
  filePath?: string,
  masterKey?: string,
  rememberMasterKey?: boolean
) => {
  if (filePath && masterKey) {
    if (existsSync(filePath)) {
      await connectAndSaveDB(win, filePath, masterKey, rememberMasterKey);
    } else {
      win?.webContents.send(DATABASE_DOES_NOT_EXIST, { dbPath: filePath });
    }
  } else if (masterKey) {
    win?.webContents.send(DATABASE_EXISTS_WITHOUT_MASTER_KEY, filePath);
  } else {
    win?.webContents.send(DATABASE_NOT_DETECTED);
  }
};

export const getDbFromSettings = async () => {
  const filePath = (await settings.get(DATABASE_PATH)) as string | undefined;

  let masterKey: string | undefined;
  if (safeStorage.isEncryptionAvailable()) {
    const buffer = (await settings.get(DATABASE_MASTER_KEY)) as string;
    masterKey = safeStorage.decryptString(Buffer.from(buffer, DATABASE_MASTER_KEY_ENCODING));
  }

  return { filePath, masterKey };
};
