import { useContext, useEffect, useState } from 'react';
import { ipcRenderer, IpcRendererEvent } from 'electron';

import { EntitiesContext } from '@app/context/entitiesContext';
import { TransactionsContext } from '@app/context/transactionsContext';
import TransactionIpc from '@app/data/transaction.ipc';
import { Budget, Transaction } from '@database/entities';
import { FILTER_TRANSACTIONS_ACK } from '@constants/events';
import { TrailingCashflowSegmentsEnum } from '@app/components/BigPicture/TrailingCashflow';
import {
  getTransactionsTrailingCashflow,
  getTransactionTrailingCashflowAverage,
} from '@app/utils/balance.utils';
import {
  autoBudgetWantsCategories,
  autoBudgetNeedsCategories,
  getTotalFromTransactions,
} from '@app/utils/budget.utils';

const useAutoBudget = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { accountsIndex } = useContext(EntitiesContext);
  const [periodTransactions, setPeriodTransactions] = useState<Transaction[]>([]);
  const { budgetFilterOption } = useContext(TransactionsContext);

  // Target totals
  const transactions =
    accountsIndex && accountsIndex.accounts.map(account => account.transactions!).flat();

  const targetIncomeTotal = Math.round(
    transactions && transactions.sort((a, b) => b.date.getTime() - a.date.getTime())
      ? getTransactionTrailingCashflowAverage(
          getTransactionsTrailingCashflow(transactions),
          TrailingCashflowSegmentsEnum.LAST_6_MONTHS
        )[0]
      : 0
  );
  const targetExpensesTotal = Math.round(targetIncomeTotal * 0.8 * -1);
  const targetSavingsTotal = Math.round(targetIncomeTotal - Math.abs(targetExpensesTotal));

  // Period transactions
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

  const periodIncome = periodTransactions.filter(({ amount }) => amount > 0);
  const periodExpenses = periodTransactions.filter(({ amount }) => amount < 0);

  // Period totals
  const periodIncomeTotal = getTotalFromTransactions(periodIncome);
  const periodExpensesTotal = getTotalFromTransactions(periodExpenses);
  const periodSavingsTotal = periodIncomeTotal - Math.abs(periodExpensesTotal);

  // Expense groups
  const expenseGroupNeeds = periodExpenses.filter(({ category }) =>
    autoBudgetNeedsCategories.includes(category.id)
  );
  const expenseGroupWants = periodExpenses.filter(({ category }) =>
    autoBudgetWantsCategories.includes(category.id)
  );
  const expenseGroupEverythingElse = periodExpenses.filter(
    ({ category }) =>
      !autoBudgetNeedsCategories.includes(category.id) &&
      !autoBudgetWantsCategories.includes(category.id)
  );
  const periodExpenseGroups = [
    {
      name: 'Needs',
      periodExpenseGroupTotal: getTotalFromTransactions(expenseGroupNeeds),
      targetExpenseGroupTotal: Math.round(targetIncomeTotal * 0.5 * -1),
    },
    {
      name: 'Wants',
      periodExpenseGroupTotal: getTotalFromTransactions(expenseGroupWants),
      targetExpenseGroupTotal: Math.round(targetIncomeTotal * 0.3 * -1),
    },
    {
      name: 'Everything else',
      periodExpenseGroupTotal: getTotalFromTransactions(expenseGroupEverythingElse),
      targetExpenseGroupTotal: 0,
    },
  ];

  return {
    targetIncomeTotal,
    targetExpensesTotal,
    targetSavingsTotal,
    periodIncomeTotal,
    periodExpensesTotal,
    periodSavingsTotal,
    periodExpenseGroups,
    periodTransactions,
    isLoading,
  };
};

export default useAutoBudget;
