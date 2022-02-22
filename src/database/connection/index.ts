import isDev from 'electron-is-dev';
import {
  createConnection,
  getConnection,
  Connection,
  ConnectionOptions,
  AlreadyHasActiveConnectionError,
  ConnectionNotFoundError,
} from 'typeorm';

import {
  Account,
  AccountBalanceStatement,
  Asset,
  Budget,
  Transaction,
  TransactionCategory,
  AssetType,
  AccountType,
  TransactionSubCategory,
  AssetBalanceStatement,
  Settings,
} from '../entities';
import { DATABASE_CHUNK_SIZE } from '@constants';

export const dbConfig = {
  type: 'better-sqlite3',
  synchronize: isDev && true,
  logging: isDev && true,
  entities: [
    Account,
    AccountType,
    AccountBalanceStatement,
    Asset,
    AssetType,
    AssetBalanceStatement,
    Transaction,
    TransactionCategory,
    TransactionSubCategory,
    Budget,
    Settings,
  ],
};

// Splits arrays in chunks so they can be bulk inserted within the DB's driver limits
export const splitInChunks = (array: any[]) => {
  const chunks: any[] = [];
  for (let i = 0; i < array.length; i += DATABASE_CHUNK_SIZE) {
    chunks.push(array.slice(i, i + DATABASE_CHUNK_SIZE));
  }
  return chunks;
};

const connection = {
  async create(dbConfig: ConnectionOptions, callback?: (c: Connection) => void): Promise<void> {
    try {
      const connection = await createConnection(dbConfig);
      if (callback) {
        callback(connection);
      }
    } catch (error) {
      console.error('Error', error);
      if (error instanceof AlreadyHasActiveConnectionError) {
        return;
      }
      throw new Error(`ERROR: Creating test db connection: ${error}`);
    }
  },

  async close(): Promise<void> {
    await getConnection().close();
  },

  async clear(): Promise<void> {
    const connection = getConnection();
    const entities = connection.entityMetadatas;

    const reposToClear: Promise<void>[] = [];
    entities.forEach(entity => {
      const repository = connection.getRepository(entity.name);
      try {
        reposToClear.push(repository.clear());
      } catch (error) {
        throw new Error(`ERROR: Cleaning db: ${error}`);
      }
    });

    return Promise.all(reposToClear).then();
  },

  async isConnected(): Promise<boolean> {
    try {
      return await getConnection().isConnected;
    } catch (error) {
      if (error instanceof ConnectionNotFoundError) {
        return false;
      }
    }

    return false;
  },
};

export default connection;
