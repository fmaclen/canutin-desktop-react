import React, { useEffect, useState, useContext } from 'react';
import { Switch, Route, BrowserRouter, Redirect } from 'react-router-dom';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import styled from 'styled-components';

import TitleBar from '@components/common/TitleBar';
import StatusBar from '@components/common/StatusBar';
import SideBar from '@components/common/SideBar';
import { AppContext } from '@app/context/appContext';
import { requestSync, getLinkSummary } from '@app/data/canutinLink.api';

import Setup from '@pages/Setup';

import { routesConfig, RouteConfigProps, routesPaths } from '@routes';
import { DATABASE_CONNECTED, DATABASE_NOT_DETECTED } from '@constants';
import { DB_GET_ACCOUNTS_ACK, DB_GET_ASSETS_ACK } from '@constants/events';
import AssetIpc from '@app/data/asset.ipc';
import AccountIpc from '@app/data/account.ipc';
import { Account, Asset } from '@database/entities';

import GlobalStyle from '@app/styles/global';
import { container } from './styles';
import { StatusBarContext } from '@app/context/statusBarContext';
import { StatusEnum } from '@app/constants/misc';

const Container = styled.div`
  ${container}
`;

const App = () => {
  const {
    isLoading,
    setIsLoading,
    isAppInitialized,
    setIsAppInitialized,
    setFilePath,
    isDbEmpty,
    setIsDbEmpty,
    setLinkAccount,
    linkAccount,
  } = useContext(AppContext);
  const { setStatusMessage } = useContext(StatusBarContext);
  const [accounts, setAccounts] = useState<Account[] | null>(null);
  const [assets, setAssets] = useState<Asset[] | null>(null);

  useEffect(() => {
    ipcRenderer.on(DB_GET_ACCOUNTS_ACK, (_: IpcRendererEvent, accounts: Account[]) => {
      setAccounts(accounts);
    });

    ipcRenderer.on(DB_GET_ASSETS_ACK, (_: IpcRendererEvent, assets: Asset[]) => {
      setAssets(assets);
    });

    ipcRenderer.on(DATABASE_CONNECTED, (_, filePath) => {
      setIsLoading(false);
      setIsAppInitialized(true);
      setFilePath(filePath?.filePath);
      if (filePath) {
        AssetIpc.getAssets();
        AccountIpc.getAccounts();
      }
    });

    ipcRenderer.on(DATABASE_NOT_DETECTED, () => {
      setIsLoading(false);
      setIsAppInitialized(false);
    });

    return () => {
      ipcRenderer.removeAllListeners(DATABASE_NOT_DETECTED);
      ipcRenderer.removeAllListeners(DATABASE_CONNECTED);
    };
  }, []);

  useEffect(() => {
    if (
      Array.isArray(assets) &&
      assets.length === 0 &&
      Array.isArray(accounts) &&
      accounts.length === 0
    ) {
      setIsDbEmpty(true);
    } else {
      setIsDbEmpty(false);

      const handleSync = async () => {
        const summary = await getLinkSummary();
        summary && setLinkAccount(summary);
      };

      handleSync();
    }
  }, [assets, accounts]);

  useEffect(() => {
    if (linkAccount?.isSyncing) {
      const handleSync = async () => {
        const summary = await getLinkSummary();

        if (summary) {
          setLinkAccount(summary);
          await requestSync(assets);
          setLinkAccount({ ...linkAccount, isSyncing: false });
        } else {
          setLinkAccount({
            ...linkAccount,
            errors: { user: true, institution: false },
            isSyncing: false,
          });
          setStatusMessage({
            sentiment: StatusEnum.WARNING,
            message: "Couldn't connect to Canutin's server, please try again later",
            isLoading: false,
          });
        }
      };
      handleSync();
    }
  }, [linkAccount]);

  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <Container hasSidebar={isAppInitialized}>
          {!isLoading && isAppInitialized && (
            <>
              <TitleBar />
              <SideBar />
              <Switch>
                {isDbEmpty && (
                  <Redirect
                    exact
                    from={routesPaths.bigpicture}
                    to={routesPaths.addAccountOrAsset}
                  />
                )}
                {routesConfig.map(({ path, component, exact }: RouteConfigProps, index) => (
                  <Route key={index} exact={exact} path={path}>
                    {component}
                  </Route>
                ))}
              </Switch>
            </>
          )}

          {!isAppInitialized && (
            <>
              <TitleBar />
              <Setup />
            </>
          )}
          <StatusBar />
        </Container>
      </BrowserRouter>
    </>
  );
};

export default App;
