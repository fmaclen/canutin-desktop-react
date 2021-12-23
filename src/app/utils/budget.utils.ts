import { isAfter, isSameMonth } from 'date-fns';

import { AccountsIndex } from '@app/context/entitiesContext';
import { BudgetsIndex } from '@app/context/entitiesContext';
import { BudgetTypeEnum } from '@enums/budgetType.enum';
import { SelectFieldValue } from '@app/components/common/Form/Select';

import { TrailingCashflowSegmentsEnum } from '@app/components/BigPicture/TrailingCashflow';
import {
  getTransactionsTrailingCashflow,
  getTransactionTrailingCashflowAverage,
} from '@app/utils/balance.utils';

const autoBudgetNeedsCategories = [
  14,
  15,
  25,
  28,
  30,
  32,
  33,
  37,
  39,
  40,
  41,
  42,
  43,
  44,
  46,
  47,
  48,
  49,
  50,
  57,
  59,
  65,
  66,
  67,
  68,
  70,
  75,
  79,
  80,
  81,
  82,
  84,
  85,
];
const autoBudgetWantsCategories = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  26,
  27,
  29,
  31,
  35,
  36,
  38,
  45,
  51,
  52,
  53,
  54,
  55,
  56,
  58,
  60,
  61,
  62,
  63,
  64,
  69,
  71,
  72,
  74,
  76,
  77,
  78,
  83,
  87,
];

export const getAutoBudget = (accountsIndex: AccountsIndex) => {
  const transactions =
    accountsIndex && accountsIndex.accounts.map(account => account.transactions!).flat();

  // Summary
  const targetIncomeAmount = Math.round(
    transactions && transactions.sort((a, b) => b.date.getTime() - a.date.getTime())
      ? getTransactionTrailingCashflowAverage(
          getTransactionsTrailingCashflow(transactions),
          TrailingCashflowSegmentsEnum.LAST_6_MONTHS
        )[0]
      : 0
  );
  const targetExpensesAmount = Math.round(targetIncomeAmount * 0.8 * -1);
  const targetSavingsAmount = Math.round(targetIncomeAmount - Math.abs(targetExpensesAmount));

  // Expenses by group
  const budgetExpenseGroups = [
    {
      name: 'Needs',
      targetAmount: Math.round(targetIncomeAmount * 0.5 * -1),
      transactionCategoryIds: autoBudgetNeedsCategories,
    },
    {
      name: 'Wants',
      targetAmount: Math.round(targetIncomeAmount * 0.3 * -1),
      transactionCategoryIds: autoBudgetWantsCategories,
    },
  ];

  return {
    targetIncomeAmount,
    targetExpensesAmount,
    targetSavingsAmount,
    budgetExpenseGroups,
  };
};

export const getUserBudget = (budgetsIndex: BudgetsIndex, budgetFilterOption: SelectFieldValue) => {
  const dateFrom = budgetFilterOption?.value.dateFrom;
  const latestBudgetDate = budgetsIndex?.budgets
    .filter(
      ({ createdAt }) => isAfter(dateFrom, createdAt) || isSameMonth(dateFrom, createdAt)
    )?.[0]
    ?.createdAt.getTime();
  const budgetsForPeriod = budgetsIndex?.budgets.filter(
    ({ createdAt }) => createdAt.getTime() === latestBudgetDate
  );
  const expenseBudgets =
    budgetsForPeriod && budgetsForPeriod.filter(({ type }) => type === BudgetTypeEnum.EXPENSE);

  // Summary
  let targetIncomeAmount =
    budgetsForPeriod &&
    budgetsForPeriod.find(({ type }) => type === BudgetTypeEnum.INCOME)?.targetAmount;
  targetIncomeAmount = targetIncomeAmount ? targetIncomeAmount : 0;

  let targetExpensesAmount =
    expenseBudgets && expenseBudgets.reduce((acc, { targetAmount }) => acc + targetAmount, 0);
  targetExpensesAmount = targetExpensesAmount ? targetExpensesAmount : 0;

  const targetSavingsAmount = Math.round(targetIncomeAmount - Math.abs(targetExpensesAmount));

  // Expenses by group
  const budgetExpenseGroups = expenseBudgets?.map(budgetExpense => ({
    name: budgetExpense.name,
    targetAmount: budgetExpense.targetAmount,
    transactionCategoryIds: budgetExpense.categories.map(({ id }) => id),
  }));

  return {
    targetIncomeAmount,
    targetExpensesAmount,
    targetSavingsAmount,
    budgetExpenseGroups,
  };
};
