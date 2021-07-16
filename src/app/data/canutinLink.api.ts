import axios from 'axios';

export enum ApiEndpoints {
  USER_AUTH = '/auth',
  USER_LOGIN = '/login',
  USER_CREATE_ACCOUNT = '/create-account',
  USER_LOGOUT = '/logout',
  SUMMARY = '/api/v1/summary',
  NEW_INSTITUTION = '/api/v1/items/create',
  UPDATE_INSTITUTION = '/api/v1/items/update',
  UNLINK_INSTITUTION = '/api/v1/items/unlink',
  NEW_INSTITUTION_TOKEN = '/api/v1/items/new-token',
  UPDATE_INSTITUTION_TOKEN = '/api/v1/items/update-token',
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

export default canutinLinkApi;
