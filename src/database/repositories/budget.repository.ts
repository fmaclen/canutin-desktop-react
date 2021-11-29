import { getRepository } from 'typeorm';

import { BudgetTypeEnum } from '@enums/budgetType.enum';
import { EditBudgetSubmit } from '@app/components/Budget/EditBudgetGroups';
import { Settings } from '@database/entities';

import { Budget, TransactionSubCategory } from '../entities';

export class BudgetRepository {
  static async createBudget(
    name: string,
    targetAmount: number,
    type: BudgetTypeEnum,
    categories: TransactionSubCategory[]
  ): Promise<Budget> {
    return await getRepository<Budget>(Budget).save(
      new Budget(name, targetAmount, type, categories)
    );
  }

  static async getBudgets(): Promise<Budget[]> {
    return await getRepository<Budget>(Budget).find({
      relations: ['categories'],
      order: {
        createdAt: 'DESC',
        id: 'DESC',
      },
    });
  }

  static async editBudgets(editBudgets: EditBudgetSubmit): Promise<Budget[]> {
    const settings = await getRepository<Settings>(Settings).findOne({
      order: { id: 'DESC' }
    }) as Settings;
  
    await getRepository<Settings>(Settings).update(settings?.id, {
      budgetAuto: editBudgets.autoBudget === 'Enable',
      updatedAt: new Date()
    });

    if (editBudgets.autoBudget === 'Disabled') {
      const income = await getRepository<Budget>(Budget).findOne({
        where: { type: 'income' },
        order: { id: 'DESC' }
      }) as Budget;

      await getRepository<Budget>(Budget).update(income.id, {
        deletedAt: new Date() 
      });

      await this.createBudget('Income', editBudgets.targetIncome, BudgetTypeEnum.INCOME, []);

      await Promise.all(
        Object.keys(editBudgets.group).map(id => {
          const group = editBudgets.group[Number(id)];
  
          return getRepository<Budget>(Budget).update(id, {
            name: group.name,
            targetAmount: group.targetAmount,
          });
        })
      )
    }

    const budgets = await this.getBudgets();

    return  budgets;
  }
}
