import { existsSync } from 'fs';
import { ConnectionOptions } from 'typeorm';
import { BrowserWindow } from 'electron';
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
} from '@constants';

export const connectAndSaveDB = async (
  win: BrowserWindow | null,
  filePath: string,
  masterKey: string
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
        db.pragma(`KEY = '${masterKey}'`); // FIXME: sanitize the secret when implementing UI
      },
    };
    const isConnected = await connection.isConnected();
    if (isConnected) await connection.close();

    await connection.create(databaseConnection);
    await settings.set(DATABASE_PATH, filePath);
    await settings.set(DATABASE_MASTER_KEY, masterKey);

    win?.webContents.send(DATABASE_CONNECTED, { filePath });
  } catch (error) {
    win?.webContents.send(DATABASE_NOT_VALID);
  }
};

export const findAndConnectDB = async (
  win: BrowserWindow | null,
  filePath: string,
  masterKey: string
) => {
  if (filePath) {
    if (existsSync(filePath)) {
      await connectAndSaveDB(win, filePath, masterKey);
    } else {
      win?.webContents.send(DATABASE_DOES_NOT_EXIST, { dbPath: filePath });
    }
  } else {
    win?.webContents.send(DATABASE_NOT_DETECTED);
  }
};
