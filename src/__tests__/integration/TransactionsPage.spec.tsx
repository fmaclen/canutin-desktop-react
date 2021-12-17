import { screen } from '@testing-library/react';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { mocked } from 'ts-jest/utils';
import userEvent from '@testing-library/user-event';

// Fixes `ReferenceError: regeneratorRuntime is not defined` error on `useAsyncDebounce`.
// REF: https://github.com/tannerlinsley/react-table/issues/2071
import 'regenerator-runtime/runtime';

import { DB_GET_ACCOUNTS_ACK, DB_GET_ASSETS_ACK, FILTER_TRANSACTIONS_ACK } from '@constants/events';
import { DATABASE_CONNECTED } from '@constants';
import { AppCtxProvider } from '@app/context/appContext';
import { EntitiesProvider } from '@app/context/entitiesContext';
import { render } from '@tests/utils';
import App from '@components/App';

import { seedAccounts, seedAssets } from '@tests/factories/seededEntitiesFactory';
import { accountCheckingDetails } from '@database/seed/demoData/accounts';
import { TransactionsProvider } from '@app/context/transactionsContext';

const initAppWithContexts = () => {
  render(
    <AppCtxProvider>
      <TransactionsProvider>
        <EntitiesProvider>
          <App />
        </EntitiesProvider>
      </TransactionsProvider>
    </AppCtxProvider>
  );
};

describe('Transactions tests', () => {
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
    const minimumAccount = [{ ...accountCheckingDetails, transactions: [] }];

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
        callback((event as unknown) as IpcRendererEvent, { transactions: [], status: null });
      }

      return ipcRenderer;
    });

    initAppWithContexts();

    const transactionsSidebarLink = screen.getByTestId('sidebar-transactions');
    expect(transactionsSidebarLink).not.toHaveAttribute('disabled');

    userEvent.click(transactionsSidebarLink);
    expect(transactionsSidebarLink).toHaveAttribute('active', '1');

    const scrollViewTransactions = screen.getByTestId('scrollview-transactions');
    expect(scrollViewTransactions).toMatchSnapshot();

    // expect(screen.getByText('Add transaction')).toBeVisible();
    // expect(screen.getByText('Import')).toBeVisible();
    // expect(screen.getByText('Last 3 months')).toBeVisible();
    // expect(screen.getByText('Browse transactions')).toBeVisible();
    // expect(screen.getByText('No transactions were found')).toBeVisible();

    // const cardTransactions = screen.getByTestId('card-transactions');
    // expect(cardTransactions).toHaveTextContent('Transactions');
    // expect(cardTransactions).toHaveTextContent('$0');

    // const cardNetBalance = screen.getByTestId('card-net-balance');
    // expect(cardNetBalance).toHaveTextContent('Net balance');
    // expect(cardNetBalance).toHaveTextContent('$0');
  });

  // test('Transactions page displays the correct data', async () => {
  //   mocked(ipcRenderer).on.mockImplementation((event, callback) => {
  //     if (event === DATABASE_CONNECTED) {
  //       callback((event as unknown) as IpcRendererEvent, {
  //         filePath: 'testFilePath',
  //       });
  //     }

  //     if (event === DB_GET_ACCOUNTS_ACK) {
  //       callback((event as unknown) as IpcRendererEvent, seedAccounts);
  //     }

  //     if (event === DB_GET_ASSETS_ACK) {
  //       callback((event as unknown) as IpcRendererEvent, seedAssets);
  //     }

  //     return ipcRenderer;
  //   });

  //   initAppWithContexts();

  //   const transactionsSidebarLink = screen.getByTestId('sidebar-transactions');
  //   expect(transactionsSidebarLink).toHaveAttribute('toggled', '1');
  //   expect(transactionsSidebarLink).toHaveAttribute('active', '0');
  //   expect(transactionsSidebarLink).not.toHaveAttribute('disabled');

  //   userEvent.click(transactionsSidebarLink);
  //   expect(transactionsSidebarLink).toHaveAttribute('active', '1');
  // });
});
