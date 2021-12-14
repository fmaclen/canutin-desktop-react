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

describe('Big picture tests', () => {
  const bigPictureCashflowChartPeriodMonths = [
    expect.stringMatching('Jan'),
    expect.stringMatching('Feb'),
    expect.stringMatching('Mar'),
    expect.stringMatching('Apr'),
    expect.stringMatching('May'),
    expect.stringMatching('Jun'),
    expect.stringMatching('Jul'),
    expect.stringMatching('Aug'),
    expect.stringMatching('Sep'),
    expect.stringMatching('Oct'),
    expect.stringMatching('Nov'),
    expect.stringMatching('Dec'),
  ];

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

    const bigPictureSidebarLink = screen.getByTestId('sidebar-big-picture');
    expect(bigPictureSidebarLink).toHaveAttribute('disabled');

    userEvent.click(bigPictureSidebarLink);
    expect(bigPictureSidebarLink).not.toHaveAttribute('active', '1');
  });

  test('Big picture page displays an empty view when no enough data is available', async () => {
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

    const bigPictureSidebarLink = screen.getByTestId('sidebar-big-picture');
    expect(bigPictureSidebarLink).not.toHaveAttribute('disabled');

    userEvent.click(bigPictureSidebarLink);
    expect(bigPictureSidebarLink).toHaveAttribute('active', '1');

    // Summary section
    const bigPictureSummary = screen.getByTestId('big-picture-summary');
    expect(bigPictureSummary).toBeVisible();
    expect(bigPictureSummary).toHaveTextContent('Net worth');
    expect(bigPictureSummary).toHaveTextContent('Cash');
    expect(bigPictureSummary).toHaveTextContent('Investments');
    expect(bigPictureSummary).toHaveTextContent('Debt');
    expect(bigPictureSummary).toHaveTextContent('Other assets');
    expect(bigPictureSummary).toHaveTextContent('$0');
    expect(bigPictureSummary).not.toHaveTextContent(/[1-9]/);

    // Cashflow section
    const bigPictureCashflow = screen.getByTestId('big-picture-cashflow');
    expect(bigPictureCashflow).toBeVisible();
    expect(bigPictureCashflow).toHaveTextContent('Cashflow');
    expect(bigPictureCashflow).toHaveTextContent('Not enough transactions to display this chart.');
    expect(bigPictureCashflow).not.toHaveTextContent('Jan');
    expect(bigPictureCashflow).not.toHaveTextContent('$');

    // Trailing cashflow section
    const bigPictureTrailingCashflow = screen.getByTestId('big-picture-trailing-cashflow');
    expect(bigPictureTrailingCashflow).toBeVisible();
    expect(bigPictureTrailingCashflow).toHaveTextContent('Trailing cashflow');
    expect(bigPictureTrailingCashflow).toHaveTextContent('Income per month');
    expect(bigPictureTrailingCashflow).toHaveTextContent('Expenses per month');
    expect(bigPictureTrailingCashflow).toHaveTextContent('Net surplus per month');
    expect(screen.getByTestId('big-picture-trailing-cashflow-income')).toHaveTextContent('$0');
    expect(screen.getByTestId('big-picture-trailing-cashflow-expenses')).toHaveTextContent('$0');
    expect(screen.getByTestId('big-picture-trailing-cashflow-surplus')).toHaveTextContent('$0');

    const bigPictureTrailingCashflowLast6Months = screen.getByText('Last 6 months');
    // expect(bigPictureTrailingCashflowLast6Months).toHaveAttribute('isActive', '1'); // FIXME: This should be truthy

    const bigPictureTrailingCashflowLast12Months = screen.getByText('Last 12 months');
    // expect(bigPictureTrailingCashflowLast12Months).toHaveAttribute('isActive', '0'); // FIXME: This should be truthy
  });

  test('Big picture page displays the correct data', async () => {
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

    const bigPictureSidebarLink = screen.getByTestId('sidebar-big-picture');
    expect(bigPictureSidebarLink).toHaveAttribute('toggled', '1');
    expect(bigPictureSidebarLink).toHaveAttribute('active', '0');
    expect(bigPictureSidebarLink).not.toHaveAttribute('disabled');

    userEvent.click(bigPictureSidebarLink);
    expect(bigPictureSidebarLink).toHaveAttribute('active', '1');

    // Summary section
    const bigPictureSummary = screen.getByTestId('big-picture-summary');
    expect(bigPictureSummary).toHaveTextContent('Net worth');
    expect(bigPictureSummary).toHaveTextContent('$183,871');
    expect(bigPictureSummary).toHaveTextContent('Cash');
    expect(bigPictureSummary).toHaveTextContent('$10,700');
    expect(bigPictureSummary).toHaveTextContent('Investments');
    expect(bigPictureSummary).toHaveTextContent('$142,831');
    expect(bigPictureSummary).toHaveTextContent('Debt');
    expect(bigPictureSummary).toHaveTextContent('-$22,660');
    expect(bigPictureSummary).toHaveTextContent('Other assets');
    expect(bigPictureSummary).toHaveTextContent('$53,000');

    // Cashflow section
    const bigPictureCashflowChartPeriods = screen.getAllByTestId('chart-period');
    expect(bigPictureCashflowChartPeriods.length).toBe(12);
    expect(bigPictureCashflowChartPeriods[0]).toHaveTextContent('$316');
    expect(bigPictureCashflowChartPeriods[1]).toHaveTextContent('-$329');
    expect(bigPictureCashflowChartPeriods[2]).toHaveTextContent('$1,236');
    expect(bigPictureCashflowChartPeriods[3]).toHaveTextContent('$316');
    expect(bigPictureCashflowChartPeriods[4]).toHaveTextContent('$197');
    expect(bigPictureCashflowChartPeriods[5]).toHaveTextContent('$816');
    expect(bigPictureCashflowChartPeriods[6]).toHaveTextContent('-$329');
    expect(bigPictureCashflowChartPeriods[7]).toHaveTextContent('$316');
    expect(bigPictureCashflowChartPeriods[8]).toHaveTextContent('$816');
    expect(bigPictureCashflowChartPeriods[9]).toHaveTextContent('$316');
    expect(bigPictureCashflowChartPeriods[10]).toHaveTextContent('$316');
    expect(bigPictureCashflowChartPeriods[11]).toHaveTextContent('-$374');
    expect(bigPictureCashflowChartPeriods.map(period => period.textContent)).toEqual(
      expect.arrayContaining(bigPictureCashflowChartPeriodMonths)
    );

    // expect(bigPictureCashflowChartPeriods[11]).toHaveAttribute('isActive', 1); // FIXME: This should be truthy

    const bigPictureCashflowIncome = screen.getByTestId('chart-summary-income');
    expect(bigPictureCashflowIncome).toHaveTextContent('Income');
    expect(bigPictureCashflowIncome).toHaveTextContent('$4,800');

    const bigPictureCashflowExpenses = screen.getByTestId('chart-summary-expenses');
    expect(bigPictureCashflowExpenses).toHaveTextContent('Expenses');
    expect(bigPictureCashflowExpenses).toHaveTextContent('-$5,173.6');

    const bigPictureCashflowSurplus = screen.getByTestId('chart-summary-surplus');
    expect(bigPictureCashflowSurplus).toHaveTextContent('Surplus');
    expect(bigPictureCashflowSurplus).toHaveTextContent('-$373.60');

    // TODO: hover on a different period and assert new `chart-summary` values
    // TODO: assert that only active and peak periods display a balance

    // Trailing cashflow section
    const bigPictureTrailingCashflow = screen.getByTestId('big-picture-trailing-cashflow');
    expect(bigPictureTrailingCashflow).toBeVisible();
    expect(bigPictureTrailingCashflow).toHaveTextContent('Trailing cashflow');
    expect(bigPictureTrailingCashflow).toHaveTextContent('Income per month');
    expect(bigPictureTrailingCashflow).toHaveTextContent('Expenses per month');
    expect(bigPictureTrailingCashflow).toHaveTextContent('Net surplus per month');

    const bigPictureTrailingCashflowIncome = screen.getByTestId(
      'big-picture-trailing-cashflow-income'
    );
    const bigPictureTrailingCashflowExpenses = screen.getByTestId(
      'big-picture-trailing-cashflow-expenses'
    );
    const bigPictureTrailingCashflowSurplus = screen.getByTestId(
      'big-picture-trailing-cashflow-surplus'
    );
    expect(bigPictureTrailingCashflowIncome).toHaveTextContent('$7,500.33');
    expect(bigPictureTrailingCashflowExpenses).toHaveTextContent('-$7,124.62');
    expect(bigPictureTrailingCashflowSurplus).toHaveTextContent('$375.71');
    expect(bigPictureTrailingCashflowIncome).not.toHaveTextContent('$7,535.30');
    expect(bigPictureTrailingCashflowExpenses).not.toHaveTextContent('-$7,134.58');
    expect(bigPictureTrailingCashflowSurplus).not.toHaveTextContent('$400.72');

    userEvent.click(screen.getByText('Last 12 months'));
    expect(bigPictureTrailingCashflowIncome).not.toHaveTextContent('$7,500.33');
    expect(bigPictureTrailingCashflowExpenses).not.toHaveTextContent('-$7,124.62');
    expect(bigPictureTrailingCashflowSurplus).not.toHaveTextContent('$375.71');
    expect(bigPictureTrailingCashflowIncome).toHaveTextContent('$7,535.30');
    expect(bigPictureTrailingCashflowExpenses).toHaveTextContent('-$7,134.58');
    expect(bigPictureTrailingCashflowSurplus).toHaveTextContent('$400.72');
  });
});
