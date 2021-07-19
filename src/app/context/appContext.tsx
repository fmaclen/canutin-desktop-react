import { createContext, PropsWithChildren, useState } from 'react';

import { LinkAccountProps } from '@app/data/canutinLink.api';

interface AppContextValue {
  isLoading: boolean;
  setIsLoading: (_: boolean) => void;
  isAppInitialized: boolean;
  setIsAppInitialized: (_: boolean) => void;
  filePath: string | null;
  setFilePath: (_: string) => void;
  isDbEmpty: boolean;
  setIsDbEmpty: (_: boolean) => void;
  linkAccount: LinkAccountProps | null;
  setLinkAccount: (_: LinkAccountProps | null) => void;
}

export const AppContext = createContext<AppContextValue>({
  isLoading: true,
  setIsLoading: () => {},
  isAppInitialized: false,
  setIsAppInitialized: () => {},
  filePath: null,
  setFilePath: () => {},
  isDbEmpty: false,
  setIsDbEmpty: () => {},
  linkAccount: null,
  setLinkAccount: () => {},
});

export const AppCtxProvider = ({ children }: PropsWithChildren<Record<string, unknown>>) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAppInitialized, setIsAppInitialized] = useState(false);
  const [filePath, setFilePath] = useState<string | null>(null);
  const [isDbEmpty, setIsDbEmpty] = useState(false);
  const [linkAccount, setLinkAccount] = useState<LinkAccountProps | null>(null);

  const value = {
    isLoading,
    setIsLoading,
    isAppInitialized,
    setIsAppInitialized,
    filePath,
    setFilePath,
    isDbEmpty,
    setIsDbEmpty,
    linkAccount,
    setLinkAccount,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
