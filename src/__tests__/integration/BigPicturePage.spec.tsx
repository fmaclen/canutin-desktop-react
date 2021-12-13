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

const initAppWithContexts = () => {
  render(
    <AppCtxProvider>
      <EntitiesProvider>
        <App />
      </EntitiesProvider>
    </AppCtxProvider>
  );
};

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
  const cardNetWorth = screen.getByTestId('card-net-worth');
  const cardCash = screen.getByTestId('card-cash');
  const cardInvestments = screen.getByTestId('card-investments');
  const cardDebt = screen.getByTestId('card-debt');
  const cardOtherAssets = screen.getByTestId('card-other-assets');
  expect(cardNetWorth).toHaveTextContent('$185,013');
  expect(cardCash).toHaveTextContent('$10,700');
  expect(cardInvestments).toHaveTextContent('$142,831');
  expect(cardDebt).toHaveTextContent('-$21,518');
  expect(cardOtherAssets).toHaveTextContent('$53,000');
});
