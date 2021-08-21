import axios from 'axios';
import { getAssetByTypes } from '@app/utils/balance.utils';
import { Asset } from '@database/entities';

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
  isSyncing: boolean;
}

export const getLinkSummary = async () => {
  let linkAccount;
  await canutinLinkApi
    .get<LinkAccountProps>(ApiEndpoints.SUMMARY)
    .then(response => {
      linkAccount = response && { ...response.data, isSyncing: false };
    })
    .catch(e => {
      return null;
    });
  return linkAccount;
};

export const requestSync = async (assets: Asset[] | null) => {
  const assetList = assets && getAssetByTypes(['security', 'cryptocurrency'], assets);
  const updatableAssets = assetList?.map(asset => ({
    symbol: asset.symbol,
    type: asset.assetType.name,
  }));

  await canutinLinkApi
    .post(ApiEndpoints.SYNC, { assets: updatableAssets })
    .then(response => {
      const { assetPrices, accounts, removedTransactions } = response.data;
      console.log('ACCOUNTS:', accounts);
      console.log('REMOVED TRANSACTIONS:', removedTransactions);
      console.log('ASSETS:', assetPrices);

      return true;
    })
    .catch(e => {});
  // Update balanceStatements
};

export default canutinLinkApi;
