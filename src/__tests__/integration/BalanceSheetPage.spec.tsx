import { screen } from '@testing-library/react';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { mocked } from 'ts-jest/utils';
import userEvent from '@testing-library/user-event';

import { DB_GET_ACCOUNTS_ACK, DB_GET_ASSETS_ACK } from '@constants/events';
import { DATABASE_CONNECTED } from '@constants';
import { AppCtxProvider } from '@app/context/appContext';
import { EntitiesProvider } from '@app/context/entitiesContext';
import { render } from '@tests/utils';
import App from '@components/App';

import { seedAccounts, seedAssets } from '@tests/factories/seededEntitiesFactory';
import { accountCheckingDetails } from '@database/seed/demoData/accounts';

const initAppWithContexts = () => {
  render(
    <AppCtxProvider>
      <EntitiesProvider>
        <App />
      </EntitiesProvider>
    </AppCtxProvider>
  );
};

describe('Balance sheet tests', () => {
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

    const balancesheetSidebarLink = screen.getByTestId('sidebar-balance-sheet');
    expect(balancesheetSidebarLink).toHaveAttribute('disabled');

    userEvent.click(balancesheetSidebarLink);
    expect(balancesheetSidebarLink).not.toHaveAttribute('active', '1');
  });

  test('Balance sheet page displays an empty view when no enough data is available', async () => {
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

      return ipcRenderer;
    });

    initAppWithContexts();

    const balancesheetSidebarLink = screen.getByTestId('sidebar-balance-sheet');
    expect(balancesheetSidebarLink).not.toHaveAttribute('disabled');

    userEvent.click(balancesheetSidebarLink);
    expect(balancesheetSidebarLink).toHaveAttribute('active', '1');

    const balanceGroupCash = screen.getByTestId('balance-group-cash');
    expect(balanceGroupCash).toHaveTextContent('Cash');
    expect(balanceGroupCash).toHaveTextContent('Checking');
    expect(balanceGroupCash).toHaveTextContent("Alice's Checking");
    expect(balanceGroupCash).toHaveTextContent('$0');

    const balanceGroupDebt = screen.getByTestId('balance-group-debt');
    expect(balanceGroupDebt).toHaveTextContent('Debt');
    expect(balanceGroupDebt).toHaveTextContent('$0');
    expect(balanceGroupDebt).toHaveTextContent('No balances are available in this group.');

    const balanceGroupInvestments = screen.getByTestId('balance-group-investments');
    expect(balanceGroupInvestments).toHaveTextContent('Investments');
    expect(balanceGroupInvestments).toHaveTextContent('$0');
    expect(balanceGroupInvestments).toHaveTextContent('No balances are available in this group.');

    const balanceGroupOtherAssets = screen.getByTestId('balance-group-other-assets');
    expect(balanceGroupOtherAssets).toHaveTextContent('Other assets');
    expect(balanceGroupOtherAssets).toHaveTextContent('$0');
    expect(balanceGroupOtherAssets).toHaveTextContent('No balances are available in this group.');

    expect(screen.getByText(/Accounts 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Assets 0/i)).toBeInTheDocument();
  });

  test('Balance sheet page displays the correct data', async () => {
    mocked(ipcRenderer).on.mockImplementation((event, callback) => {
      if (event === DATABASE_CONNECTED) {
        callback((event as unknown) as IpcRendererEvent, {
          filePath: 'testFilePath',
        });
      }

      if (event === DB_GET_ACCOUNTS_ACK) {
        callback((event as unknown) as IpcRendererEvent, seedAccounts);
      }

      if (event === DB_GET_ASSETS_ACK) {
        callback((event as unknown) as IpcRendererEvent, seedAssets);
      }

      return ipcRenderer;
    });

    initAppWithContexts();

    // "Balance sheet" is the default view so we click on "The big picture" to assert the sidebar behavior
    userEvent.click(screen.getByTestId('sidebar-big-picture'));
    const balancesheetSidebarLink = screen.getByTestId('sidebar-balance-sheet');
    expect(balancesheetSidebarLink).toHaveAttribute('toggled', '1');
    expect(balancesheetSidebarLink).toHaveAttribute('active', '0');
    expect(balancesheetSidebarLink).not.toHaveAttribute('disabled');

    userEvent.click(balancesheetSidebarLink);
    expect(balancesheetSidebarLink).toHaveAttribute('active', '1');

    let balanceGroupCash = screen.getByTestId('balance-group-cash');
    expect(balanceGroupCash).toHaveTextContent('Cash');
    expect(balanceGroupCash).toHaveTextContent('$10,700');
    expect(balanceGroupCash).toHaveTextContent(/Savings/i);
    expect(balanceGroupCash).toHaveTextContent('Emergency Fund');
    expect(balanceGroupCash).toHaveTextContent('$6,000');
    expect(balanceGroupCash).toHaveTextContent(/Checking/i);
    expect(balanceGroupCash).toHaveTextContent("Alice's Checking");
    expect(balanceGroupCash).toHaveTextContent('$3,400');
    expect(balanceGroupCash).toHaveTextContent(/Wallet/i);
    expect(balanceGroupCash).toHaveTextContent('$1,300');
    expect(balanceGroupCash).toHaveTextContent('Account');
    expect(balanceGroupCash).not.toHaveTextContent('Asset');
    expect(balanceGroupCash).not.toHaveTextContent('No balances are available in this group.');

    let balanceGroupDebt = screen.getByTestId('balance-group-debt');
    expect(balanceGroupDebt).toHaveTextContent('Debt');
    expect(balanceGroupDebt).toHaveTextContent('-$21,974');
    expect(balanceGroupDebt).toHaveTextContent(/Credit card/i);
    expect(balanceGroupDebt).toHaveTextContent("Bob's Juggernaut Visa");
    expect(balanceGroupDebt).toHaveTextContent('-$724');
    expect(balanceGroupDebt).toHaveTextContent(/Auto/i);
    expect(balanceGroupDebt).toHaveTextContent('Toyota Auto Loan');
    expect(balanceGroupDebt).toHaveTextContent('-$21,250');
    expect(balanceGroupDebt).toHaveTextContent('Account');
    expect(balanceGroupDebt).not.toHaveTextContent('Asset');
    expect(balanceGroupDebt).not.toHaveTextContent('No balances are available in this group.');

    let balanceGroupInvestments = screen.getByTestId('balance-group-investments');
    expect(balanceGroupInvestments).toHaveTextContent('Investments');
    expect(balanceGroupInvestments).toHaveTextContent('$142,831');
    expect(balanceGroupInvestments).toHaveTextContent(/Cryptocurrency/i);
    expect(balanceGroupInvestments).toHaveTextContent('Bitcoin');
    expect(balanceGroupInvestments).toHaveTextContent('$69,420');
    expect(balanceGroupInvestments).toHaveTextContent('Ethereum');
    expect(balanceGroupInvestments).toHaveTextContent('$17,500');
    expect(balanceGroupInvestments).toHaveTextContent(/Security/i);
    expect(balanceGroupInvestments).toHaveTextContent('Tesla');
    expect(balanceGroupInvestments).toHaveTextContent('$30,000');
    expect(balanceGroupInvestments).toHaveTextContent('GameStop');
    expect(balanceGroupInvestments).toHaveTextContent('$3,125');
    expect(balanceGroupInvestments).toHaveTextContent(/Roth/i);
    expect(balanceGroupInvestments).toHaveTextContent("Alice's Roth IRA");
    expect(balanceGroupInvestments).toHaveTextContent('$18,536');
    expect(balanceGroupInvestments).toHaveTextContent(/401k/i);
    expect(balanceGroupInvestments).toHaveTextContent("Bob's 401k");
    expect(balanceGroupInvestments).toHaveTextContent('$4,251');
    expect(balanceGroupInvestments).toHaveTextContent('Account');
    expect(balanceGroupInvestments).toHaveTextContent('Asset');
    expect(balanceGroupInvestments).not.toHaveTextContent(
      'No balances are available in this group.'
    );

    let balanceGroupOtherAssets = screen.getByTestId('balance-group-other-assets');
    expect(balanceGroupOtherAssets).toHaveTextContent('Other assets');
    expect(balanceGroupOtherAssets).toHaveTextContent('$53,000');
    expect(balanceGroupOtherAssets).toHaveTextContent(/Vehicle/i);
    expect(balanceGroupOtherAssets).toHaveTextContent('2021 Toyota RAV4');
    expect(balanceGroupOtherAssets).toHaveTextContent('$38,500');
    expect(balanceGroupOtherAssets).toHaveTextContent(/Collectible/i);
    expect(balanceGroupOtherAssets).toHaveTextContent('Pokemon Card Collection');
    expect(balanceGroupOtherAssets).toHaveTextContent('$14,500');
    expect(balanceGroupOtherAssets).toHaveTextContent('Asset');
    expect(balanceGroupOtherAssets).not.toHaveTextContent('Account');
    expect(balanceGroupOtherAssets).not.toHaveTextContent(
      'No balances are available in this group.'
    );

    const segmentedControlAccounts = screen.getByText(/Accounts 7/i);
    expect(segmentedControlAccounts).toBeVisible();

    userEvent.click(segmentedControlAccounts);
    balanceGroupInvestments = screen.getByTestId('balance-group-investments');
    balanceGroupCash = screen.getByTestId('balance-group-cash');
    balanceGroupDebt = screen.getByTestId('balance-group-debt');
    balanceGroupOtherAssets = screen.getByTestId('balance-group-other-assets');
    expect(balanceGroupCash).toHaveTextContent('Cash');
    expect(balanceGroupCash).toHaveTextContent('$10,700');
    expect(balanceGroupCash).toHaveTextContent('Account');
    expect(balanceGroupCash).not.toHaveTextContent('Asset');
    expect(balanceGroupCash).not.toHaveTextContent('No balances are available in this group.');
    expect(balanceGroupDebt).toHaveTextContent('Debt');
    expect(balanceGroupDebt).toHaveTextContent('-$21,974');
    expect(balanceGroupDebt).toHaveTextContent('Account');
    expect(balanceGroupDebt).not.toHaveTextContent('Asset');
    expect(balanceGroupDebt).not.toHaveTextContent('No balances are available in this group.');
    expect(balanceGroupInvestments).toHaveTextContent('Investments');
    expect(balanceGroupInvestments).toHaveTextContent('$22,786');
    expect(balanceGroupInvestments).not.toHaveTextContent('Asset');
    expect(balanceGroupOtherAssets).toHaveTextContent('Other assets');
    expect(balanceGroupOtherAssets).toHaveTextContent('$0');
    expect(balanceGroupOtherAssets).toHaveTextContent('No balances are available in this group.');
    expect(balanceGroupOtherAssets).not.toHaveTextContent('$53,000');
    expect(balanceGroupOtherAssets).not.toHaveTextContent('Account');

    const segmentedControlAssets = screen.getByText(/Assets 6/i);
    expect(segmentedControlAssets).toBeVisible();

    userEvent.click(segmentedControlAssets);
    balanceGroupInvestments = screen.getByTestId('balance-group-investments');
    balanceGroupCash = screen.getByTestId('balance-group-cash');
    balanceGroupDebt = screen.getByTestId('balance-group-debt');
    balanceGroupOtherAssets = screen.getByTestId('balance-group-other-assets');
    expect(balanceGroupCash).toHaveTextContent('Cash');
    expect(balanceGroupCash).toHaveTextContent('$0');
    expect(balanceGroupCash).toHaveTextContent('No balances are available in this group.');
    expect(balanceGroupCash).not.toHaveTextContent('$10,700');
    expect(balanceGroupCash).not.toHaveTextContent('Account');
    expect(balanceGroupCash).not.toHaveTextContent('Asset');
    expect(balanceGroupDebt).toHaveTextContent('Debt');
    expect(balanceGroupDebt).toHaveTextContent('$0');
    expect(balanceGroupDebt).toHaveTextContent('No balances are available in this group.');
    expect(balanceGroupDebt).not.toHaveTextContent('-$21,974');
    expect(balanceGroupDebt).not.toHaveTextContent('Account');
    expect(balanceGroupDebt).not.toHaveTextContent('Asset');
    expect(balanceGroupInvestments).toHaveTextContent('Investments');
    expect(balanceGroupInvestments).toHaveTextContent('$120,045');
    expect(balanceGroupInvestments).toHaveTextContent('Asset');
    expect(balanceGroupInvestments).not.toHaveTextContent('Account');
    expect(balanceGroupInvestments).not.toHaveTextContent(
      'No balances are available in this group.'
    );
    expect(balanceGroupOtherAssets).toHaveTextContent('Other assets');
    expect(balanceGroupOtherAssets).toHaveTextContent('$53,000');
    expect(balanceGroupOtherAssets).toHaveTextContent('Asset');
    expect(balanceGroupOtherAssets).not.toHaveTextContent('Account');
    expect(balanceGroupOtherAssets).not.toHaveTextContent(
      'No balances are available in this group.'
    );

    const segmentedControlAll = screen.getByText(/All/i);
    expect(segmentedControlAll).toBeVisible();

    userEvent.click(segmentedControlAll);
    balanceGroupInvestments = screen.getByTestId('balance-group-investments');
    balanceGroupCash = screen.getByTestId('balance-group-cash');
    balanceGroupDebt = screen.getByTestId('balance-group-debt');
    balanceGroupOtherAssets = screen.getByTestId('balance-group-other-assets');
    expect(balanceGroupCash).toHaveTextContent('Cash');
    expect(balanceGroupCash).toHaveTextContent('$10,700');
    expect(balanceGroupDebt).toHaveTextContent('Debt');
    expect(balanceGroupDebt).toHaveTextContent('-$21,974');
    expect(balanceGroupInvestments).toHaveTextContent('Investments');
    expect(balanceGroupInvestments).toHaveTextContent('$142,831');
    expect(balanceGroupOtherAssets).toHaveTextContent('Other assets');
    expect(balanceGroupOtherAssets).toHaveTextContent('$53,000');
  });
});
