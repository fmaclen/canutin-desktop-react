import { useContext, useEffect, useState } from 'react';
import { ipcRenderer, IpcRendererEvent } from 'electron';

import { EntitiesContext } from '@app/context/entitiesContext';
import { TransactionsContext } from '@app/context/transactionsContext';
import TransactionIpc from '@app/data/transaction.ipc';
import { Transaction } from '@database/entities';
import { FILTER_TRANSACTIONS_ACK } from '@constants/events';
import { getAutoBudget, getUserBudget } from '@app/utils/budget.utils';

type ExpenseGroupType = {
  name: string;
  targetAmount: number;
  transactionCategoryIds: number[];
};

type BudgetType = {
  targetIncomeAmount: number;
  targetExpensesAmount: number;
  targetSavingsAmount: number;
  budgetExpenseGroups: ExpenseGroupType[];
};

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
  const [isLoading, setIsLoading] = useState(true);
  const autoBudget = settingsIndex?.settings.autoBudget;

  const {
    targetIncomeAmount,
    targetExpensesAmount,
    targetSavingsAmount,
    budgetExpenseGroups,
  }: BudgetType = autoBudget
    ? getAutoBudget(accountsIndex!)
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
      expenseGroup.transactionCategoryIds.includes(transaction.category.id)
    );
    return {
      ...expenseGroup,
      periodAmount: getTotalFromTransactions(expenseGroupTransactions),
    };
  });

  // Out of budget expenses
  const categoriesInExpenseGroups = budgetExpenseGroups.reduce(
    (categoriesIdAcc: number[], { transactionCategoryIds }) => [
      ...categoriesIdAcc,
      ...transactionCategoryIds,
    ],
    []
  );
  const outOfBudgetTransactions = periodExpenseTransactions.filter(
    ({ category }) => !categoriesInExpenseGroups.includes(category.id)
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
