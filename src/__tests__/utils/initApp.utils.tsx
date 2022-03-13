import { ipcRenderer, IpcRendererEvent } from 'electron';
import { mocked } from 'jest-mock';

import {
  DB_GET_ACCOUNTS_ACK,
  DB_GET_ASSETS_ACK,
  DB_GET_SETTINGS_ACK,
  DB_GET_BUDGETS_ACK,
  FILTER_TRANSACTIONS_ACK,
} from '@constants/repositories';
import { VAULT_READY } from '@constants/vault';
import { SeedAccount, SeedAsset, SeedTransaction } from '@tests/factories/entitiesFactory';
import { AppCtxProvider } from '@app/context/appContext';
import { EntitiesProvider } from '@app/context/entitiesContext';
import { render } from '@tests/utils';
import App from '@components/App';

interface SeedSettings {
  autoBudget?: true | false;
}

interface InitAppWithProps {
  accounts?: SeedAccount[];
  assets?: SeedAsset[];
  settings?: SeedSettings;
  filterTransactions?: SeedTransaction[] | false;
}

export const initAppWithContexts = () => {
  render(
    <AppCtxProvider>
      <EntitiesProvider>
        <App />
      </EntitiesProvider>
    </AppCtxProvider>
  );
};

export const initAppWith = ({
  accounts = [],
  assets = [],
  settings = { autoBudget: true },
  filterTransactions = [],
}: InitAppWithProps) => {
  mocked(ipcRenderer).on.mockImplementation((event, callback) => {
    if (event === VAULT_READY) {
      callback(event as unknown as IpcRendererEvent, {
        filePath: 'testFilePath',
      });
    }

    if (event === DB_GET_ACCOUNTS_ACK) {
      callback(event as unknown as IpcRendererEvent, accounts);
    }

    if (event === DB_GET_ASSETS_ACK) {
      callback(event as unknown as IpcRendererEvent, assets);
    }

    if (event === DB_GET_SETTINGS_ACK) {
      callback(event as unknown as IpcRendererEvent, settings);
    }

    if (event === DB_GET_BUDGETS_ACK) {
      callback(event as unknown as IpcRendererEvent, []);
    }

    if (event === FILTER_TRANSACTIONS_ACK) {
      callback(event as unknown as IpcRendererEvent, { transactions: filterTransactions });
    }

    return ipcRenderer;
  });

  initAppWithContexts();
};
