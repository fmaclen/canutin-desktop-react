import { getRepository } from 'typeorm';

import { BudgetTypeEnum } from '@enums/budgetType.enum';

import { Budget, TransactionSubCategory } from '../entities';

export class BudgetRepository {
  static async createBudget(
    name: string,
    targetAmount: number,
    type: BudgetTypeEnum,
    categories: TransactionSubCategory[]
  ): Promise<Budget> {
    return await getRepository<Budget>(Budget).save(
      new Budget(
        name,
        targetAmount,
        type,
        categories
      )
    );
  }
}
