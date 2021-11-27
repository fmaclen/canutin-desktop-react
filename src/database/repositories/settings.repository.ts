import { getRepository } from 'typeorm';

import { Settings } from '../entities';

export class SettingsRepository {
  static async createSettings(
    budgetAuto: boolean
  ): Promise<Settings> {
    return await getRepository<Settings>(Settings).save(
      new Settings(
        budgetAuto
      )
    );
  }
}
