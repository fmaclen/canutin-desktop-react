import React, { useContext } from 'react';
import axios from 'axios';

import { CanutinFileAccountType } from '@appTypes/canutin';
import { AppContext } from '@app/context/appContext';

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
  error_title: string;
  error_message: string;
  last_update: Date;
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

// interface InstitutionType {
//   institution_name: string;
//   institution_id: string;
//   accounts: CanutinFileAccountType[];
// }

export const requestSync = async () => {
  await canutinLinkApi
    .post(ApiEndpoints.SYNC, { data: 'sync_assets' })
    .then(response => {
      const { assets, accounts, removedTransactions } = response.data;
      console.log('ACCOUNTS:', accounts);
      console.log('REMOVED TRANSACTIONS:', removedTransactions);
      console.log('ASSETS:', assets);

      return true;
    })
    .catch(e => {});
  // Update balanceStatements
};

export default canutinLinkApi;
