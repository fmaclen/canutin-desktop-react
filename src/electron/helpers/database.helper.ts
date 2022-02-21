import { existsSync } from 'fs';
import { ConnectionOptions } from 'typeorm';
import { BrowserWindow } from 'electron';
import settings from 'electron-settings';

import connection, { dbConfig } from '@database/connection';
import {
  DATABASE_CONNECTED,
  DATABASE_DOES_NOT_EXIST,
  DATABASE_NOT_DETECTED,
  DATABASE_PATH,
  DATABASE_NOT_VALID,
  DATABASE_CHUNK_SIZE,
} from '@constants';

export const connectAndSaveDB = async (win: BrowserWindow | null, filePath: string) => {
  try {
    const databaseConnection: ConnectionOptions = {
      ...dbConfig,
      database: filePath,
      type: 'better-sqlite3',
    };
    const isConnected = await connection.isConnected();
    if (isConnected) await connection.close();

    await connection.create(databaseConnection);
    await settings.set(DATABASE_PATH, filePath);
    win?.webContents.send(DATABASE_CONNECTED, { filePath });
  } catch (error) {
    win?.webContents.send(DATABASE_NOT_VALID);
  }
};

export const findAndConnectDB = async (win: BrowserWindow | null, filePath: string) => {
  if (filePath) {
    if (existsSync(filePath)) {
      await connectAndSaveDB(win, filePath);
    } else {
      win?.webContents.send(DATABASE_DOES_NOT_EXIST, { dbPath: filePath });
    }
  } else {
    win?.webContents.send(DATABASE_NOT_DETECTED);
  }
};

export const splitInChunks = (array: any[]) => {
  const chunks: any[] = [];
  for (let i = 0; i < array.length; i += DATABASE_CHUNK_SIZE) {
    chunks.push(array.slice(i, i + DATABASE_CHUNK_SIZE));
  }
  return chunks;
};
