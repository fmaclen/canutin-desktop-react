import React from 'react';
import ReactDOM from 'react-dom';

import App from '@components/App';
import { AppCtxProvider } from '@app/context/appContext';
import { StatusBarProvider } from '@app/context/statusBarContext';
import { TransactionsProvider } from '@app/context/transactionsContext';
import { EntitiesProvider } from '@app/context/entitiesContext';
import { LinkProvider } from '@app/context/linkContext';

ReactDOM.render(
  <AppCtxProvider>
    {/* TODO: rename AppCtxProvider > AppProvider so it's consistent with the other names */}
    <StatusBarProvider>
      <TransactionsProvider>
        {/* TODO: test moving TransactionsProvider inside LinkProvider */}
        <EntitiesProvider>
          <LinkProvider>
            <App />
          </LinkProvider>
        </EntitiesProvider>
      </TransactionsProvider>
    </StatusBarProvider>
  </AppCtxProvider>,
  document.getElementById('root')
);
