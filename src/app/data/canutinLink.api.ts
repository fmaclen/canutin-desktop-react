import axios from 'axios';

export enum ApiEndpoints {
  USER_AUTH = '/auth',
  USER_LOGIN = '/login',
  USER_CREATE_ACCOUNT = '/create-account',
  USER_LOGOUT = '/logout',
}

const getApiURL = () => {
  switch (process.env.NODE_ENV) {
    case 'development':
      return 'http://localhost:9292';
    default:
      return '/';
  }
};

export const API_URL = getApiURL();

const canutinLinkApi = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

export default canutinLinkApi;
