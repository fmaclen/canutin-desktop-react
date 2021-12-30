import { screen } from '@testing-library/react';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { mocked } from 'ts-jest/utils';
import { render } from '@tests/utils';
import userEvent from '@testing-library/user-event';
import { endOfDay, startOfDay, subMonths } from 'date-fns';

import App from '@components/App';
import {
  DB_GET_ACCOUNTS_ACK,
  DB_GET_BUDGETS_ACK,
  DB_GET_TRANSACTION_CATEGORY_ACK,
  FILTER_TRANSACTIONS_ACK,
} from '@constants/events';
import { DATABASE_CONNECTED } from '@constants';
import { AppCtxProvider } from '@app/context/appContext';
import { EntitiesProvider } from '@app/context/entitiesContext';
import { TransactionsProvider } from '@app/context/transactionsContext';
import { seedAccounts } from '@tests/factories/seededEntitiesFactory';
import { autoBudgetCategoriesBuilder } from '@tests/factories/autoBudgetCategoriesFactory';
import {
  accountCheckingDetails,
  accountCreditCardDetails,
  accountSavingsDetails,
} from '@database/seed/demoData/accounts';
import {
  accountCheckingTransactionSet,
  accountSavingsTransactionSet,
  accountCreditCardTransactionSet,
} from '@database/seed/demoData/transactions';
import { filters } from '@app/constants/filters';
import { dateInUTC } from '@app/utils/date.utils';
import mapCategories from '@database/helpers/importResources/mapCategories';
import { Transaction } from '@database/entities';

const initAppWithContexts = () => {
  render(
    <AppCtxProvider>
      <EntitiesProvider>
        <TransactionsProvider>
          <App />
        </TransactionsProvider>
      </EntitiesProvider>
    </AppCtxProvider>
  );
};

describe('Budget tests', () => {
  const minimumAccount = [{ ...accountCheckingDetails, transactions: [] }];

  test("Sidebar link can't be clicked if no accounts or assets are present", async () => {
    mocked(ipcRenderer).on.mockImplementation((event, callback) => {
      if (event === DATABASE_CONNECTED) {
        callback((event as unknown) as IpcRendererEvent, {
          filePath: 'testFilePath',
        });
      }

      return ipcRenderer;
    });

    initAppWithContexts();

    const budgetSidebarLink = screen.getByTestId('sidebar-budget');
    expect(budgetSidebarLink).toHaveAttribute('disabled');

    userEvent.click(budgetSidebarLink);
    expect(budgetSidebarLink).not.toHaveAttribute('active', '1');
  });

  test('Budget page displays an empty view when no enough data is available', async () => {
    mocked(ipcRenderer).on.mockImplementation((event, callback) => {
      if (event === DATABASE_CONNECTED) {
        callback((event as unknown) as IpcRendererEvent, {
          filePath: 'testFilePath',
        });
      }

      if (event === DB_GET_ACCOUNTS_ACK) {
        callback((event as unknown) as IpcRendererEvent, minimumAccount);
      }

      if (event === FILTER_TRANSACTIONS_ACK) {
        callback((event as unknown) as IpcRendererEvent, { transactions: [] });
      }

      return ipcRenderer;
    });

    initAppWithContexts();

    const budgetSidebarLink = screen.getByTestId('sidebar-budget');
    expect(budgetSidebarLink).not.toHaveAttribute('disabled');

    userEvent.click(budgetSidebarLink);
    expect(budgetSidebarLink).toHaveAttribute('active', '1');

    expect(screen.getByText('Auto-budget')).toBeVisible();
    expect(screen.getByText('No transactions were found in the current period')).toBeVisible();
  });

  test('Budget page displays the correct data', async () => {
    let oneMonthOfTransactions = accountCheckingTransactionSet()
      .filter(transaction => {
        // Mimic the logic in `TransactionRepository.getFilterTransactions()`
        const dateFrom = dateInUTC(startOfDay(filters[0].dateFrom));
        const dateTo = dateInUTC(endOfDay(filters[0].dateTo));
        return transaction.date >= dateFrom && transaction.date <= dateTo;
      })
      .map(transaction => {
        return {
          ...transaction,
          account: { ...accountCheckingDetails },
          category: { name: mapCategories(transaction.categoryName) },
        };
      });

    accountSavingsTransactionSet()
      .filter(transaction => {
        const dateFrom = dateInUTC(startOfDay(filters[0].dateFrom));
        const dateTo = dateInUTC(endOfDay(filters[0].dateTo));
        return transaction.date >= dateFrom && transaction.date <= dateTo;
      })
      .forEach(transaction => {
        oneMonthOfTransactions.push({
          ...transaction,
          account: { ...accountSavingsDetails },
          category: { name: mapCategories(transaction.categoryName) },
        });
      });

    accountCreditCardTransactionSet()
      .filter(transaction => {
        const dateFrom = dateInUTC(startOfDay(filters[0].dateFrom));
        const dateTo = dateInUTC(endOfDay(filters[0].dateTo));
        return transaction.date >= dateFrom && transaction.date <= dateTo;
      })
      .forEach(transaction => {
        oneMonthOfTransactions.push({
          ...transaction,
          account: { ...accountCreditCardDetails },
          category: { name: mapCategories(transaction.categoryName) },
        });
      });

    const {
      needsCategories,
      wantsCategories,
      transactionsWithCategories,
    } = autoBudgetCategoriesBuilder(oneMonthOfTransactions);
    oneMonthOfTransactions = transactionsWithCategories;

    mocked(ipcRenderer).on.mockImplementation((event, callback) => {
      if (event === DATABASE_CONNECTED) {
        callback((event as unknown) as IpcRendererEvent, {
          filePath: 'testFilePath',
        });
      }

      if (event === DB_GET_ACCOUNTS_ACK) {
        callback((event as unknown) as IpcRendererEvent, seedAccounts);
      }

      if (event === FILTER_TRANSACTIONS_ACK) {
        callback((event as unknown) as IpcRendererEvent, {
          transactions: oneMonthOfTransactions,
        });
      }

      if (event === DB_GET_TRANSACTION_CATEGORY_ACK) {
        needsCategories.forEach(category => {
          callback((event as unknown) as IpcRendererEvent, category);
        });
        wantsCategories.forEach(category => {
          callback((event as unknown) as IpcRendererEvent, category);
        });
      }

      if (event === DB_GET_BUDGETS_ACK) {
        callback((event as unknown) as IpcRendererEvent, []);
      }

      return ipcRenderer;
    });

    initAppWithContexts();
    userEvent.click(screen.getByTestId('sidebar-big-picture')); // Resets path back to the default
    const budgetSidebarLink = screen.getByTestId('sidebar-budget');
    expect(budgetSidebarLink).toHaveAttribute('active', '0');
    expect(budgetSidebarLink).not.toHaveAttribute('disabled');

    userEvent.click(budgetSidebarLink);
    expect(budgetSidebarLink).toHaveAttribute('active', '1');

    const budgetBarIncome = screen.getByTestId('budget-bar-income');
    expect(budgetBarIncome).toHaveTextContent('Income');
    expect(budgetBarIncome).toHaveTextContent('$7,577');
    expect(budgetBarIncome).toHaveTextContent('$8,050 (106%)');

    const budgetBarExpenses = screen.getByTestId('budget-bar-expenses');
    expect(budgetBarExpenses).toHaveTextContent('Expenses');
    expect(budgetBarExpenses).toHaveTextContent('-$6,061');
    expect(budgetBarExpenses).toHaveTextContent('-$7,822 (129%)');

    const budgetBarSavings = screen.getByTestId('budget-bar-savings');
    expect(budgetBarSavings).toHaveTextContent('Savings');
    expect(budgetBarSavings).toHaveTextContent('$1,516');
    expect(budgetBarSavings).toHaveTextContent('$228 (15%)');

    const budgetBarNeeds = screen.getByTestId('budget-bar-needs');
    expect(budgetBarNeeds).toHaveTextContent('Needs');
    expect(budgetBarNeeds).toHaveTextContent('-$4,053 (107%)');
    expect(budgetBarNeeds).toHaveTextContent('-$3,788');

    const budgetBarWants = screen.getByTestId('budget-bar-wants');
    expect(budgetBarWants).toHaveTextContent('Wants');
    expect(budgetBarWants).toHaveTextContent('-$3,769 (166%)');
    expect(budgetBarWants).toHaveTextContent('-$2,273');

    // const budgetOutOfBudget = screen.getByTestId('budget-out-of-budget');
    // expect(budgetOutOfBudget).toHaveTextContent('Out of budget');
    // expect(budgetOutOfBudget).toHaveTextContent('-$1,498');
  });

  // test('Budgets can be edited', async () => {

  // });

  // test('Transaction categories can be assigned to budgets', async () => {

  // });
});
