import React, { ReactNode } from 'react';

import TheBigPicture from 'app/pages/TheBigPicture';
import BalanceSheet from 'app/pages/BalanceSheet';
import Budget from 'app/pages/Budget';
import Transactions from 'app/pages/Transactions';
import Trends from 'app/pages/Trends';
import AddAccountOrAsset from 'app/pages/AddAccountOrAsset';
import AddAccountAssetByHand from 'app/pages/AddAccountAssetByHand';

export const routesPaths = {
  index: '/',
  bigpicture: '/bigpicture',
  balance: '/balance',
  budget: '/budget',
  transactions: '/transactions',
  trends: '/trends',
  addAccountOrAsset: '/account/addAccountOrAsset',
  addAccountOrAssetByHand: '/account/addAccountOrAsset/byHand',
};

export interface RouteConfigProps {
  path: string | string[],
  component: ReactNode,
  exact?: boolean,
  subRoutes?: RouteConfigProps[];
}

export const routesConfig: RouteConfigProps[] = [
  {
    path: [routesPaths.index],
    exact: true,
    component: <BalanceSheet />
  },
  {
    path: [routesPaths.bigpicture],
    exact: true,
    component: <TheBigPicture />,
  },
  {
    path: [routesPaths.balance],
    exact: true,
    component: <BalanceSheet />,
  },
  {
    path: [routesPaths.budget],
    exact: true,
    component: <Budget />,
  },
  {
    path: [routesPaths.transactions],
    exact: true,
    component: <Transactions />,
  },
  {
    path: [routesPaths.trends],
    exact: true,
    component: <Trends />,
  },
  {
    path: [routesPaths.addAccountOrAsset],
    exact: true,
    component: <AddAccountOrAsset />,
  },
  {
    path: [routesPaths.addAccountOrAssetByHand],
    exact: true,
    component: <AddAccountAssetByHand />,
  }
];
