import { BrowserWindow, ipcMain, IpcMainEvent } from 'electron';
import settings from 'electron-settings';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

import {
  UserAuthProps,
  UserAuthResponseProps,
  SummaryProps,
  ApiEndpoints,
  LINK_HEARTBEAT,
  LINK_HEARTBEAT_ACK,
  LINK_LOGIN,
  LINK_LOGIN_ACK,
  LINK_CREATE_ACCOUNT,
  LINK_CREATE_ACCOUNT_ACK,
  LINK_LOGOUT,
  LINK_LOGOUT_ACK,
  LINK_SUMMARY,
  LINK_SUMMARY_ACK,
  LINK_UNLINK_INSTITUTION,
  LINK_UNLINK_INSTITUTION_ACK,
  LINK_COOKIE,
} from '@constants/link';
import { EVENT_ERROR, EVENT_SUCCESS } from '@constants/eventStatus';

import { canutinLinkApi } from '../helpers/link.helper';

const setupLinkEvents = async (win: BrowserWindow) => {
  ipcMain.on(LINK_HEARTBEAT, async () => {
    const isOnline = await canutinLinkApi
      .get(ApiEndpoints.HEARTBEAT)
      .then(response => response.status === 200)
      .catch(e => false);

    win.webContents.send(LINK_HEARTBEAT_ACK, { status: isOnline ? EVENT_SUCCESS : EVENT_ERROR });
  });

  const getCookies = async () => {
    return (await settings.get(LINK_COOKIE)) as AxiosRequestConfig;
  };

  const clearCookies = async () => {
    await settings.unset(LINK_COOKIE);
  };

  const handleUserAuth = async (endpoint: ApiEndpoints, userAuth: UserAuthProps) => {
    const response = await canutinLinkApi
      .post(endpoint, userAuth)
      .then(response => response)
      .catch(e => e.response);

    if (response.status === 200) {
      await settings.set(LINK_COOKIE, {
        headers: { Cookie: response.headers['set-cookie'] },
      });
      return { status: response.status } as UserAuthResponseProps;
    } else {
      return {
        status: response.status,
        error: response.data['field-error'],
      } as UserAuthResponseProps;
    }
  };

  ipcMain.on(LINK_LOGIN, async (_: IpcMainEvent, userAuth: UserAuthProps) => {
    win.webContents.send(LINK_LOGIN_ACK, await handleUserAuth(ApiEndpoints.USER_LOGIN, userAuth));
  });

  ipcMain.on(LINK_CREATE_ACCOUNT, async (_: IpcMainEvent, userAuth: UserAuthProps) => {
    win.webContents.send(
      LINK_CREATE_ACCOUNT_ACK,
      await handleUserAuth(ApiEndpoints.USER_CREATE_ACCOUNT, userAuth)
    );
  });

  ipcMain.on(LINK_LOGOUT, async () => {
    const isLoggedOut = await canutinLinkApi
      .post(ApiEndpoints.USER_LOGOUT, {})
      .then(response => response.status === 200)
      .catch(e => false);

    isLoggedOut && (await clearCookies());
    win.webContents.send(LINK_LOGOUT_ACK, { status: isLoggedOut ? EVENT_SUCCESS : EVENT_ERROR });
  });

  const getSummary = async () => {
    const response: AxiosResponse = await canutinLinkApi
      .get(ApiEndpoints.SUMMARY, await getCookies())
      .then(response => response)
      .catch(e => e.response);

    const summary = response.status === 200 ? (response.data as SummaryProps) : null;
    !summary && (await clearCookies());
    win.webContents.send(LINK_SUMMARY_ACK, summary);
  };

  ipcMain.on(LINK_SUMMARY, async (_: IpcMainEvent) => await getSummary());

  ipcMain.on(LINK_UNLINK_INSTITUTION, async (_: IpcMainEvent, id: string) => {
    const isUnlinked = await canutinLinkApi
      .post(ApiEndpoints.UNLINK_INSTITUTION, { id }, await getCookies())
      .then(response => response.status === 200)
      .catch(e => false);

    await getSummary();
    win.webContents.send(LINK_UNLINK_INSTITUTION_ACK, {
      status: isUnlinked ? EVENT_SUCCESS : EVENT_ERROR,
    });
  });
};

export default setupLinkEvents;
