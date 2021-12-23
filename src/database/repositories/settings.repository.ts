import { getRepository } from 'typeorm';

import { Settings } from '../entities';

export class SettingsRepository {
  static async createSettings(autoBudget: boolean): Promise<Settings> {
    return await getRepository<Settings>(Settings).save(new Settings(autoBudget));
  }

  static async getSettings(): Promise<Settings> {
    return (await getRepository<Settings>(Settings).findOne({
      order: { id: 'DESC' },
    })) as Settings; // Return the last one
  }
}
