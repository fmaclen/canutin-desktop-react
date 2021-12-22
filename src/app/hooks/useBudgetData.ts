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
import { autoBudgetWantsCategories, autoBudgetNeedsCategories } from '@app/utils/budget.utils';

const useBudgetData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { settingsIndex, accountsIndex } = useContext(EntitiesContext);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { budgetFilterOption } = useContext(TransactionsContext);
  const autoBudget = settingsIndex?.settings.budgetAuto;

  let targetIncomeAmount = 0;
  let targetExpensesAmount = 0;
  let targetSavingsAmount = 0;

  // Get transactions in period
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

  // Auto-budget
  if (autoBudget) {
    const transactions =
      accountsIndex && accountsIndex.accounts.map(account => account.transactions!).flat();

    if (transactions) {
      transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
      targetIncomeAmount = getTransactionTrailingCashflowAverage(
        getTransactionsTrailingCashflow(transactions),
        TrailingCashflowSegmentsEnum.LAST_6_MONTHS
      )[0];
    }

    targetIncomeAmount = Math.round(targetIncomeAmount);
    targetExpensesAmount = Math.round(targetIncomeAmount * 0.8);
  }

  targetSavingsAmount = Math.round(targetIncomeAmount - targetExpensesAmount);

  // Budget this period
  const periodIncome = transactions.filter(({ amount }) => amount > 0);
  const periodExpenses = transactions.filter(({ amount }) => amount < 0);

  const periodIncomeAmount = Math.round(
    periodIncome.reduce((acc, transaction) => {
      return acc + transaction.amount;
    }, 0)
  );

  const periodExpensesAmount = Math.round(
    periodExpenses.reduce((acc, transaction) => {
      return acc + transaction.amount;
    }, 0)
  );

  const periodSavingsAmount = periodIncomeAmount - Math.abs(periodExpensesAmount);

  // Process expense transactions per group
  const expenseGroupNeeds = periodExpenses.filter(({ category }) =>
    autoBudgetNeedsCategories.includes(category.id)
  );
  const expenseGroupWants = periodExpenses.filter(({ category }) =>
    autoBudgetWantsCategories.includes(category.id)
  );

  // Collect all expense groups
  const periodExpenseGroups = [
    {
      name: 'Needs',
      targetExpenseGroupAmount: targetIncomeAmount * 0.5,
      periodExpenseGruopAmount: Math.round(
        expenseGroupNeeds.reduce((acc, transaction) => {
          return acc + transaction.amount;
        }, 0)
      ),
    },
    {
      name: 'Wants',
      targetExpenseGroupAmount: targetIncomeAmount * 0.3,
      periodExpenseGruopAmount: Math.round(
        expenseGroupWants.reduce((acc, transaction) => {
          return transaction.amount < 0 ? acc + transaction.amount : acc;
        }, 0)
      ),
    },
  ];

  return {
    targetIncomeAmount,
    targetExpensesAmount,
    targetSavingsAmount,
    periodIncomeAmount,
    periodExpensesAmount,
    periodSavingsAmount,
    periodExpenseGroups,
    isLoading,
  };
};

export default useBudgetData;
