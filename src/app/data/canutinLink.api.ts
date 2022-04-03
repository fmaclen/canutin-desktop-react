import axios from 'axios';

import { Asset } from '@database/entities';
import { AssetTypeEnum } from '@enums/assetType.enum';
import { NewTransactionType } from '@appTypes/transaction.type';

export enum ApiEndpoints {
  USER_AUTH = '/auth',
  USER_LOGIN = '/login',
  USER_CREATE_ACCOUNT = '/create-account',
  USER_LOGOUT = '/logout',
  SUMMARY = '/api/v1/summary',
  SYNC = '/api/v1/sync',
  NEW_INSTITUTION = '/api/v1/institutions/create',
  UPDATE_INSTITUTION = '/api/v1/institutions/update',
  UNLINK_INSTITUTION = '/api/v1/institutions/unlink',
  NEW_INSTITUTION_TOKEN = '/api/v1/institutions/new-token',
  UPDATE_INSTITUTION_TOKEN = '/api/v1/institutions/update-token',
}

const getApiURL = () => {
  switch (process.env.NODE_ENV) {
    case 'development':
      return 'http://localhost:9292';
    default:
      return 'https://link.canutin.com';
  }
};

export const API_URL = getApiURL();

const canutinLinkApi = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

export interface InstitutionProps {
  id: string;
  name: string;
  errorTitle: string;
  errorMessage: string;
  lastUpdate: Date;
}

interface LinkAccountErrorProps {
  user: boolean;
  institution: boolean;
}

export interface LinkAccountProps {
  email: string;
  institutions?: InstitutionProps[];
  errors: LinkAccountErrorProps;
  isOnline: boolean;
  isSyncing: boolean;
  lastSync: Date;
}

export interface AssetPricesProps {
  symbol: string;
  type: string;
  latestPrice: number;
}

export interface RemoteAccountProps {
  accountType: string;
  autoCalculate: boolean; // TODO: Rename to `autoCalculated`
  balance: number;
  balanceGroup: string;
  institutionName: string;
  linkId: string;
  name: string;
  officialName: string;
  transactions?: NewTransactionType[];
  // TODO: add `closed?: boolean`
}

export interface SyncResponseProps {
  accounts: RemoteAccountProps[];
  removedTransactions: string[];
  assetPrices: AssetPricesProps[];
}

export const requestLinkSummary = async () => {
  const linkSummary = await canutinLinkApi
    .get<LinkAccountProps>(ApiEndpoints.SUMMARY)
    .then(response => {
      return (
        response && { ...response.data, isSyncing: false, lastSync: new Date(), isOnline: true }
      );
    })
    .catch(e => {
      return null;
    });
  return linkSummary;
};

export const requestLinkSync = async (assets: Asset[] | null) => {
  const syncResponse = await canutinLinkApi
    .post<SyncResponseProps>(ApiEndpoints.SYNC, {
      assets: assets?.filter(asset =>
        [AssetTypeEnum.SECURITY, AssetTypeEnum.CRYPTOCURRENCY].includes(asset.assetType.name)
      ),
    })
    .then(response => {
      const { assetPrices, accounts, removedTransactions } = response.data;
      return (assetPrices || accounts || removedTransactions) && response.data;
    })
    .catch(e => {});
  return syncResponse;
};

export default canutinLinkApi;
