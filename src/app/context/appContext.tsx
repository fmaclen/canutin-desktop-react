import { createContext, PropsWithChildren, useState } from 'react';

import { VaultStatusEnum } from '@enums/vault.enum';
import { LinkAccountProps } from '@app/data/canutinLink.api';

interface AppContextValue {
  isLoading: boolean;
  setIsLoading: (_: boolean) => void;
  isAppInitialized: boolean;
  setIsAppInitialized: (_: boolean) => void;
  vaultPath: string | null;
  setVaultPath: (_: string) => void;
  vaultStatus: VaultStatusEnum;
  setVaultStatus: (_: VaultStatusEnum) => void;
  linkAccount: LinkAccountProps | null;
  setLinkAccount: (_: LinkAccountProps | null) => void;
}

export const AppContext = createContext<AppContextValue>({
  isLoading: true,
  setIsLoading: () => {},
  isAppInitialized: false,
  setIsAppInitialized: () => {},
  vaultPath: null,
  setVaultPath: () => {},
  vaultStatus: VaultStatusEnum.NOT_SET,
  setVaultStatus: () => {},
  linkAccount: null,
  setLinkAccount: () => {},
});

export const AppCtxProvider = ({ children }: PropsWithChildren<Record<string, unknown>>) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAppInitialized, setIsAppInitialized] = useState(false);
  const [vaultPath, setVaultPath] = useState<string | null>(null);
  const [vaultStatus, setVaultStatus] = useState(VaultStatusEnum.NOT_SET);
  const [linkAccount, setLinkAccount] = useState<LinkAccountProps | null>(null);

  const value = {
    isLoading,
    setIsLoading,
    isAppInitialized,
    setIsAppInitialized,
    vaultPath,
    setVaultPath,
    vaultStatus,
    setVaultStatus,
    linkAccount,
    setLinkAccount,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
