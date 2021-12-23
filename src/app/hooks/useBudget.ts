import { useContext, useEffect, useState } from 'react';
import { ipcRenderer, IpcRendererEvent } from 'electron';

import { EntitiesContext } from '@app/context/entitiesContext';
import { TransactionsContext } from '@app/context/transactionsContext';
import TransactionIpc from '@app/data/transaction.ipc';
import { Transaction, TransactionSubCategory } from '@database/entities';
import { FILTER_TRANSACTIONS_ACK, DB_GET_TRANSACTION_CATEGORY_ACK } from '@constants/events';
import {
  AutoBudgetCategoriesType,
  autoBudgetNeedsCategories,
  autoBudgetWantsCategories,
  getAutoBudget,
  getUserBudget,
} from '@app/utils/budget.utils';

const getTotalFromTransactions = (transactions: Transaction[]) => {
  return Math.round(
    transactions.reduce((acc, transaction) => {
      return acc + transaction.amount;
    }, 0)
  );
};

const useBudget = () => {
  const { budgetFilterOption } = useContext(TransactionsContext);
  const { accountsIndex, settingsIndex, budgetsIndex } = useContext(EntitiesContext);
  const [periodTransactions, setPeriodTransactions] = useState<Transaction[]>([]);
  const [autoBudgetCategories, setAutoBudgetCategories] = useState<AutoBudgetCategoriesType>();
  const [isLoading, setIsLoading] = useState(true);
  const autoBudget = settingsIndex?.settings.autoBudget;

  // Get autoBudget categories
  useEffect(() => {
    if (autoBudget) {
      autoBudgetNeedsCategories.forEach(categoryName => {
        TransactionIpc.getTransactionCategory(categoryName);
      });
      autoBudgetWantsCategories.forEach(categoryName => {
        TransactionIpc.getTransactionCategory(categoryName);
      });

      const needsCategories: TransactionSubCategory[] = [];
      const wantsCategories: TransactionSubCategory[] = [];

      ipcRenderer.on(
        DB_GET_TRANSACTION_CATEGORY_ACK,
        (_: IpcRendererEvent, category: TransactionSubCategory) => {
          if (needsCategories.length < autoBudgetNeedsCategories.length) {
            needsCategories.push(category);
          } else {
            wantsCategories.push(category);
          }
        }
      );

      setAutoBudgetCategories({
        needs: needsCategories,
        wants: wantsCategories,
      });

      return () => {
        ipcRenderer.removeAllListeners(DB_GET_TRANSACTION_CATEGORY_ACK);
      };
    }
  }, []);

  const { targetIncomeAmount, targetExpensesAmount, targetSavingsAmount, budgetExpenseGroups } =
    autoBudget && autoBudgetCategories
      ? getAutoBudget(accountsIndex!, autoBudgetCategories)
      : getUserBudget(budgetsIndex!, budgetFilterOption!);

  // Transactions in period
  useEffect(() => {
    TransactionIpc.getFilterTransactions(budgetFilterOption?.value);

    ipcRenderer.on(
      FILTER_TRANSACTIONS_ACK,
      (_: IpcRendererEvent, { transactions }: { transactions: Transaction[] }) => {
        setPeriodTransactions(transactions.filter(transaction => !transaction.excludeFromTotals));
        setIsLoading(false);
      }
    );

    return () => {
      ipcRenderer.removeAllListeners(FILTER_TRANSACTIONS_ACK);
    };
  }, [budgetFilterOption?.value]);

  const periodIncomeTransactions = periodTransactions.filter(({ amount }) => amount > 0);
  const periodExpenseTransactions = periodTransactions.filter(({ amount }) => amount < 0);

  // Summary
  const periodIncomeAmount = getTotalFromTransactions(periodIncomeTransactions);
  const periodExpensesAmount = getTotalFromTransactions(periodExpenseTransactions);
  const periodSavingsAmount = periodIncomeAmount - Math.abs(periodExpensesAmount);

  // Expenses by group
  const periodExpenseGroups = budgetExpenseGroups.map(expenseGroup => {
    const expenseGroupTransactions = periodExpenseTransactions.filter(transaction =>
      expenseGroup.categories.map(category => category.id).includes(transaction.category.id)
    );
    return {
      ...expenseGroup,
      periodAmount: getTotalFromTransactions(expenseGroupTransactions),
    };
  });

  // Out of budget expenses
  const categoryIdsInAllExpenseGroups = budgetExpenseGroups.reduce((acc, expenseGroup) => {
    return [...acc, ...expenseGroup.categories.map(category => category.id)];
  }, [] as number[]);
  const outOfBudgetTransactions = periodExpenseTransactions.filter(
    ({ category }) => !categoryIdsInAllExpenseGroups.includes(category.id)
  );
  const periodOutOfBudgetAmount = getTotalFromTransactions(outOfBudgetTransactions);

  return {
    targetIncomeAmount,
    targetExpensesAmount,
    targetSavingsAmount,
    periodIncomeAmount,
    periodExpensesAmount,
    periodSavingsAmount,
    periodOutOfBudgetAmount,
    periodExpenseGroups,
    periodTransactions,
    budgetExpenseGroups,
    isLoading,
    autoBudget,
  };
};

export default useBudget;
