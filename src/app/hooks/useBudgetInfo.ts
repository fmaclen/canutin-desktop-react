import { useContext, useEffect, useState } from 'react';
import {
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isWithinInterval,
  startOfMonth,
} from 'date-fns';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { EntitiesContext } from '@app/context/entitiesContext';
import { TransactionsContext } from '@app/context/transactionsContext';
import TransactionIpc from '@app/data/transaction.ipc';
import { FILTER_TRANSACTIONS_ACK } from '@constants/events';
import { Budget, Transaction } from '@database/entities';
import { BudgetTypeEnum } from '@enums/budgetType.enum';
import { dateInUTC } from '@app/utils/date.utils';

const useBudgetInfo = (lastMonth?: boolean) => {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { budgetFilterOption } = useContext(TransactionsContext);
  const { budgetsIndex } = useContext(EntitiesContext);
  const dateFrom = lastMonth
    ? dateInUTC(startOfMonth(new Date()))
    : dateInUTC(budgetFilterOption?.value?.dateFrom);

  useEffect(() => {
    TransactionIpc.getFilterTransactions(budgetFilterOption?.value);

    ipcRenderer.on(FILTER_TRANSACTIONS_ACK, (_: IpcRendererEvent, { transactions }) => {
      setTransactions(transactions);
      setIsLoading(false);
    });

    return () => {
      ipcRenderer.removeAllListeners(FILTER_TRANSACTIONS_ACK);
    };
  }, [budgetFilterOption?.value]);

  const lastMonthExpenseBudgets = budgetsIndex?.budgets.filter(
    ({ createdAt }) => isAfter(dateFrom, createdAt) || isSameMonth(dateFrom, createdAt)
  )?.[0]?.createdAt;

  const intervalExpenseFilter =
    lastMonthExpenseBudgets && isBefore(lastMonthExpenseBudgets, dateFrom)
      ? { start: lastMonthExpenseBudgets, end: dateFrom }
      : { end: lastMonthExpenseBudgets as Date, start: dateFrom };

  const expenseBudgets = lastMonthExpenseBudgets
    ? budgetsIndex?.budgets.filter(
        ({ type, createdAt }) =>
          type === BudgetTypeEnum.EXPANSE &&
          isWithinInterval(createdAt, intervalExpenseFilter) &&
          (isBefore(createdAt, dateFrom) || isSameMonth(createdAt, dateFrom))
      )
    : [];

  const expenseBudgetsAmount = expenseBudgets
    ? expenseBudgets
        .reduce((categoriesIdAcc: number[], { categories }) => {
          let newCategories: number[] = [];

          categories.forEach(({ id }) => {
            if (categoriesIdAcc.indexOf(id) === -1) {
              newCategories = [...newCategories, id];
            }
          });

          return [...categoriesIdAcc, ...newCategories];
        }, [])
        .reduce((accTransactions: number, categoryId) => {
          const transactionsById = transactions.reduce(
            (accTransactionsAmount, { category, amount }) => {
              if (category.id === categoryId) {
                return accTransactionsAmount + amount;
              }

              return accTransactionsAmount;
            },
            0
          );

          return accTransactions + transactionsById;
        }, 0)
    : 0;

  const expensesBudgetsTargets = expenseBudgets
    ? expenseBudgets.reduce((expenseBudgetTargetAcc, { targetAmount }) => {
        return expenseBudgetTargetAcc + targetAmount;
      }, 0)
    : 0;

  const targetIncome = budgetsIndex?.budgets
    ? (budgetsIndex?.budgets.filter(({ type }) => type === BudgetTypeEnum.INCOME)[0] as Budget)
        ?.targetAmount
    : 0;

  const income = transactions.reduce((acc, { amount }) => {
    if (amount > 0) {
      return acc + amount;
    }
    return acc;
  }, 0);

  const targetSavings = targetIncome ? targetIncome - expensesBudgetsTargets : 0;
  const savings = income - expenseBudgetsAmount;

  const targetExpenses = targetIncome ? targetIncome - targetSavings : 0;
  const expenses = transactions.reduce((acc, { amount }) => {
    if (amount < 0) {
      return acc + amount;
    }
    return acc;
  }, 0);

  return {
    targetIncome,
    income,
    targetSavings,
    savings,
    targetExpenses,
    expenses,
    transactions,
    expenseBudgets,
    budgetFilterOption,
    isLoading,
  };
};

export default useBudgetInfo;
