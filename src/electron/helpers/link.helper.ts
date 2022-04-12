import axios from 'axios';
import isDev from 'electron-is-dev';

export const canutinLinkApi = axios.create({
  withCredentials: true,
  baseURL: isDev ? 'http://localhost:9292' : 'https://link.canutin.com',
});
