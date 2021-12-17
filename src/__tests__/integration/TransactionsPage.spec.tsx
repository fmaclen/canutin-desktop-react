import { screen } from '@testing-library/react';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { mocked } from 'ts-jest/utils';
import userEvent from '@testing-library/user-event';
import { endOfMonth, startOfMonth } from 'date-fns';

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
    mocked(ipcRenderer).on.mockImplementation((event, callback) => {
      if (event === DATABASE_CONNECTED) {
        callback((event as unknown) as IpcRendererEvent, {
          filePath: 'testFilePath',
        });
      }

      if (event === DB_GET_ACCOUNTS_ACK) {
        callback((event as unknown) as IpcRendererEvent, minimumAccount);
      }

      const today = dateInUTC(new Date());
      const dateFrom = startOfMonth(dateInUTC(today));
      const dateTo = endOfMonth(dateInUTC(today));
      const seedTransactionsThisMonth = accountCheckingTransactionSet()
        .filter(transaction => {
          const date = transaction.date;
          return date >= dateFrom && date <= dateTo;
        })
        .map(transaction => ({
          ...transaction,
          account: { ...accountCheckingDetails },
          category: { name: transaction.categoryName },
        }));

      if (event === FILTER_TRANSACTIONS_ACK) {
        callback((event as unknown) as IpcRendererEvent, {
          transactions: seedTransactionsThisMonth,
        });
      }

      return ipcRenderer;
    });

    initAppWithContexts();
    const cardTransactions = screen.getByTestId('card-transactions');
    expect(cardTransactions).toHaveTextContent('Transactions');
    expect(cardTransactions).toHaveTextContent('8');
  });
});
