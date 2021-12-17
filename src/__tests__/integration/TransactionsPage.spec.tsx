import { screen } from '@testing-library/react';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { mocked } from 'ts-jest/utils';
import userEvent from '@testing-library/user-event';

// Fixes `ReferenceError: regeneratorRuntime is not defined` error on `useAsyncDebounce`.
// REF: https://github.com/tannerlinsley/react-table/issues/2071
import 'regenerator-runtime/runtime';

import { dateInUTC } from '@app/utils/date.utils';
import { DB_GET_ACCOUNTS_ACK, FILTER_TRANSACTIONS_ACK } from '@constants/events';
import { DATABASE_CONNECTED } from '@constants';
import { AppCtxProvider } from '@app/context/appContext';
import { EntitiesProvider } from '@app/context/entitiesContext';
import { render } from '@tests/utils';
import App from '@components/App';

import { accountCheckingDetails } from '@database/seed/demoData/accounts';
import { TransactionsProvider } from '@app/context/transactionsContext';
import { accountCheckingTransactionSet } from '@database/seed/demoData/transactions';
import { filters } from '@app/constants/filters';

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

describe('Transactions tests', () => {
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
    const transactionsSidebarLink = screen.getByTestId('sidebar-transactions');
    expect(transactionsSidebarLink).toHaveAttribute('disabled');

    userEvent.click(transactionsSidebarLink);
    expect(transactionsSidebarLink).not.toHaveAttribute('active', '1');
  });

  test('Transactions page displays an empty view when no enough data is available', async () => {
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
    const transactionsSidebarLink = screen.getByTestId('sidebar-transactions');
    expect(transactionsSidebarLink).toHaveAttribute('active', '0');
    expect(transactionsSidebarLink).not.toHaveAttribute('disabled');

    userEvent.click(transactionsSidebarLink);
    expect(transactionsSidebarLink).toHaveAttribute('active', '1');

    const scrollViewTransactions = screen.getByTestId('scrollview-transactions');
    expect(scrollViewTransactions).toMatchSnapshot();
  });

  test('Transactions page displays the correct data', async () => {
    // Seed transactions and filter them by "Last 3 months"
    const seedTransactionsThisMonth = accountCheckingTransactionSet()
      .filter(transaction => {
        const date = transaction.date;
        return date >= filters[2].dateFrom && date <= filters[2].dateTo;
      })
      .map(transaction => ({
        ...transaction,
        account: { ...accountCheckingDetails },
        category: { name: transaction.categoryName },
      }));

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
        callback((event as unknown) as IpcRendererEvent, {
          transactions: seedTransactionsThisMonth,
        });
      }

      return ipcRenderer;
    });

    initAppWithContexts();
    userEvent.click(screen.getByTestId('sidebar-big-picture')); // Resets path back to the default
    const transactionsSidebarLink = screen.getByTestId('sidebar-transactions');
    expect(transactionsSidebarLink).toHaveAttribute('active', '0');
    expect(transactionsSidebarLink).not.toHaveAttribute('disabled');

    userEvent.click(transactionsSidebarLink);
    expect(transactionsSidebarLink).toHaveAttribute('active', '1');

    const cardTransactions = screen.getByTestId('card-transactions');
    expect(cardTransactions).toHaveTextContent('Transactions');
    expect(cardTransactions).toHaveTextContent('24');

    const cardNetBalance = screen.getByTestId('card-net-balance');
    expect(cardNetBalance).toHaveTextContent('Net balance');
    expect(cardNetBalance).toHaveTextContent('$300');
    expect(cardNetBalance).not.toHaveTextContent('-$300');

    // TODO
    // - assert number of rows generated
    // - assert the first transaction values
    // - assert the last transaction values
    // - assert sorting works
    // - assert credit/debit segmented control works
    // - assert typing in the search bar filters transactions
    // - assert switching date filters function is called (?)
  });

  // - Add test for "add transaction" flow
});
