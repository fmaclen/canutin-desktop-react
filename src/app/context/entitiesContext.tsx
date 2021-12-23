import { createContext, PropsWithChildren, useEffect, useState, useContext } from 'react';
import { ipcRenderer, IpcRendererEvent } from 'electron';

import AssetIpc from '@app/data/asset.ipc';
import AccountIpc from '@app/data/account.ipc';
import {
  DB_GET_ACCOUNTS_ACK,
  DB_GET_ASSETS_ACK,
  DB_GET_BUDGETS_ACK,
  DB_GET_SETTINGS_ACK,
} from '@constants/events';
import { Account, Asset, Budget, Settings } from '@database/entities';
import { AppContext } from './appContext';
import BudgetIpc from '@app/data/budget.ipc';
import SettingsIpc from '@app/data/settings.ipc';

export interface AccountsIndex {
  lastUpdate: Date;
  accounts: Account[];
}

interface AssetsIndex {
  lastUpdate: Date;
  assets: Asset[];
}

export interface BudgetsIndex {
  lastUpdate: Date;
  budgets: Budget[];
}

interface SettingsIndex {
  lastUpdate: Date;
  settings: Settings;
}

interface EntitiesContextValue {
  assetsIndex: AssetsIndex | null;
  accountsIndex: AccountsIndex | null;
  budgetsIndex: BudgetsIndex | null;
  settingsIndex: SettingsIndex | null;
}

const defaultAssetsIndex = { assets: [], lastUpdate: new Date() };
const defaultAccountsIndex = { accounts: [], lastUpdate: new Date() };
const defaultBudgetsIndex = { budgets: [], lastUpdate: new Date() };
const defaultSettingsIndex = { settings: { budgetAuto: true } as Settings, lastUpdate: new Date() };

export const EntitiesContext = createContext<EntitiesContextValue>({
  assetsIndex: defaultAssetsIndex,
  accountsIndex: defaultAccountsIndex,
  budgetsIndex: defaultBudgetsIndex,
  settingsIndex: defaultSettingsIndex,
});

export const EntitiesProvider = ({ children }: PropsWithChildren<Record<string, unknown>>) => {
  const [assetsIndex, setAssetsIndex] = useState<AssetsIndex>(defaultAssetsIndex);
  const [accountsIndex, setAccountsIndex] = useState<AccountsIndex>(defaultAccountsIndex);
  const [budgetsIndex, setBudgetsIndex] = useState<BudgetsIndex>(defaultBudgetsIndex);
  const [settingsIndex, setSettingsIndex] = useState<SettingsIndex>(defaultSettingsIndex);
  const { filePath } = useContext(AppContext);

  useEffect(() => {
    setTimeout(() => {
      AccountIpc.getAccounts();
      AssetIpc.getAssets();
      BudgetIpc.getBudgets();
      SettingsIpc.getSettings();
    }, 100);

    ipcRenderer.on(DB_GET_ASSETS_ACK, (_: IpcRendererEvent, assets: Asset[]) => {
      setAssetsIndex({ assets, lastUpdate: new Date() });
    });

    ipcRenderer.on(DB_GET_ACCOUNTS_ACK, (_: IpcRendererEvent, accounts: Account[]) => {
      setAccountsIndex({ accounts, lastUpdate: new Date() });
    });

    ipcRenderer.on(DB_GET_BUDGETS_ACK, (_: IpcRendererEvent, budgets: Budget[]) => {
      setBudgetsIndex({ budgets, lastUpdate: new Date() });
    });

    ipcRenderer.on(DB_GET_SETTINGS_ACK, (_: IpcRendererEvent, settings: Settings) => {
      setSettingsIndex({ settings, lastUpdate: new Date() });
    });

    return () => {
      ipcRenderer.removeAllListeners(DB_GET_BUDGETS_ACK);
      ipcRenderer.removeAllListeners(DB_GET_ASSETS_ACK);
      ipcRenderer.removeAllListeners(DB_GET_ACCOUNTS_ACK);
    };
  }, [filePath]);

  const value = {
    assetsIndex,
    accountsIndex,
    budgetsIndex,
    settingsIndex,
  };

  return <EntitiesContext.Provider value={value}>{children}</EntitiesContext.Provider>;
};
