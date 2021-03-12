import { createConnection, getConnection, Connection, ConnectionOptions } from 'typeorm';
import { User } from '../entities/user.entity';

export const dbConfig: ConnectionOptions = {
  type: 'sqlite',
  synchronize: true,
  logging: true,
  database: './canutin.sqlite',
  entities: [User],
};

const connection = {
  async create(dbConfig: ConnectionOptions, callback?: (c: Connection) => void): Promise<void> {
    try {
      const connection = await createConnection(dbConfig);
      if (callback) {
        callback(connection);
      }
    } catch (error) {
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
        throw new Error(`ERROR: Cleaning test db: ${error}`);
      }
    });

    return Promise.all(reposToClear).then();
  }
};

export default connection;
