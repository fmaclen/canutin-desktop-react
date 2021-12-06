import { getRepository, In } from 'typeorm';
import {
  isAfter,
  isSameMonth,
  startOfMonth,
  isEqual,
} from 'date-fns';

import { BudgetTypeEnum } from '@enums/budgetType.enum';
import { EditBudgetSubmit } from '@app/components/Budget/EditBudgetGroups';
import { Settings } from '@database/entities';

import { Budget, TransactionSubCategory } from '../entities';
import seedBudget from '@database/seed/seedBudget';
import { dateInUTC } from '@app/utils/date.utils';

export class BudgetRepository {
  static async createBudget(
    name: string,
    targetAmount: number,
    type: BudgetTypeEnum,
    categories: TransactionSubCategory[]
  ): Promise<Budget> {
    return await getRepository<Budget>(Budget).save(
      new Budget(name, targetAmount, type, categories, dateInUTC(startOfMonth(new Date())))
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

  static async updateBudget(id: number, targetAmount: number, name?: string) {
    await getRepository<Budget>(Budget).update({ id }, { targetAmount, name });
  }

  static async editBudgets(editBudgets: EditBudgetSubmit): Promise<void> {
    // Update settings
    const settings = (await getRepository<Settings>(Settings).findOne({
      order: { id: 'DESC' },
    })) as Settings;
    const budgetRepository = getRepository<Budget>(Budget);

    await getRepository<Settings>(Settings).update(settings?.id, {
      budgetAuto: editBudgets.autoBudget === 'Enable',
      updatedAt: dateInUTC(new Date()),
    });

    const budgets = await this.getBudgets();
    let lastMonthExpenseBudgets =
      budgets.filter(
        ({ createdAt }) => isAfter(new Date(), createdAt) || isSameMonth(new Date(), createdAt)
      )?.[0]?.createdAt ?? startOfMonth(new Date());
    lastMonthExpenseBudgets = dateInUTC(lastMonthExpenseBudgets);
    const existedBudgets = Object.keys(editBudgets.group).map(id => ({
      id,
      ...editBudgets.group[id],
    }));

    if (isEqual(lastMonthExpenseBudgets, dateInUTC(startOfMonth(new Date())))) {
      // Update last entries of the month and add/delete new expense groups
      const lastBudgets = budgets.filter(budget =>
        isEqual(budget.createdAt, dateInUTC(startOfMonth(new Date())))
      );

      if (editBudgets.autoBudget === 'Enable') {
        await budgetRepository.delete({ id: In(lastBudgets.map(({ id }) => id)) });
        await seedBudget(); // Default
      } else {
        const budgetsToBeUpdated = existedBudgets.filter(budget =>
          lastBudgets.find(({ id }) => id === Number(budget.id))
        );
        const income = (await budgetRepository.findOne({
          where: { type: 'income' },
          order: { createdAt: 'DESC' },
        })) as Budget;
        await budgetRepository.update(
          { id: income.id },
          { targetAmount: editBudgets.targetIncome }
        );

        const newBudgets = existedBudgets.filter(budget => !budgetsToBeUpdated.includes(budget));
        await Promise.allSettled(
          budgetsToBeUpdated.map(({ id, targetAmount, name }) => {
            return this.updateBudget(Number(id), targetAmount, name);
          })
        );
        await Promise.allSettled(
          newBudgets.map(({ name, targetAmount }) =>
            this.createBudget(name as string, targetAmount, BudgetTypeEnum.EXPANSE, [])
          )
        );
      }
    } else {
      // Create new entries

      if (editBudgets.autoBudget === 'Enable') {
        await seedBudget();
      } else {
        const income = (await budgetRepository.findOne({
          where: { type: 'income' },
          order: { createdAt: 'DESC' },
        })) as Budget;
        await budgetRepository.update(
          { id: income.id },
          { targetAmount: editBudgets.targetIncome }
        );
        await Promise.allSettled(
          existedBudgets.map(({ name, targetAmount }) =>
            this.createBudget(name as string, targetAmount, BudgetTypeEnum.EXPANSE, [])
          )
        );
      }
    }
  }
}
