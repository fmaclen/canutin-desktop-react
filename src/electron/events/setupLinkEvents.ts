import { BrowserWindow, ipcMain, IpcMainEvent } from 'electron';
import settings from 'electron-settings';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

import { EVENT_ERROR, EVENT_SUCCESS } from '@constants/eventStatus';
import {
  ApiEndpoints,
  LINK_COOKIE,
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
  LINK_SYNC,
  LINK_UNLINK_INSTITUTION,
  LINK_UNLINK_INSTITUTION_ACK,
  LINK_UPDATE_INSTITUTION,
  LINK_UPDATE_INSTITUTION_ACK,
  LINK_NEW_INSTITUTION_TOKEN,
  LINK_NEW_INSTITUTION,
  LINK_NEW_INSTITUTION_TOKEN_ACK,
  LINK_NEW_INSTITUTION_ACK,
  LINK_UPDATE_INSTITUTION_TOKEN,
  LINK_UPDATE_INSTITUTION_TOKEN_ACK,
} from '@constants/link';
import {
  UserAuthProps,
  UserAuthResponseProps,
  SyncResponseProps,
} from '@appTypes/canutinLink.type';

import { Asset } from '@database/entities';
import { canutinLinkApi } from '../helpers/link.helper';
import { AssetTypeEnum } from '@enums/assetType.enum';
import {
  handleLinkAssets,
  handleLinkAccounts,
  handleLinkRemovedTransactions,
} from '@database/helpers/canutinLink';
import { PlaidLinkOnSuccessMetadata } from 'react-plaid-link';
import { StatusEnum } from '@app/constants/misc';
import { StatusMessageProps } from '@app/context/statusBarContext';
import { getAssets } from './setupAssetEvents';
import { getAccounts } from './setupAccountEvents';

const setupLinkEvents = async (win: BrowserWindow) => {
  const getHeartbeat = async () => {
    const isOnline = await canutinLinkApi
      .get(ApiEndpoints.HEARTBEAT)
      .then(response => response.status === 200)
      .catch(e => false);

    win.webContents.send(LINK_HEARTBEAT_ACK, { status: isOnline ? EVENT_SUCCESS : EVENT_ERROR });
  };

  ipcMain.on(LINK_HEARTBEAT, async () => await getHeartbeat());

  const setCookies = async (cookieHeader: AxiosResponse['headers']) => {
    await settings.set(LINK_COOKIE, {
      headers: { Cookie: cookieHeader },
    });
  };

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
      await setCookies(response.headers['set-cookie']);
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
      .post(ApiEndpoints.USER_LOGOUT, {}, await getCookies())
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

    if (response.status === 200) {
      response.headers['set-cookie'] && (await setCookies(response.headers['set-cookie']));
      win.webContents.send(LINK_SUMMARY_ACK, response.data);
    } else if (response.status === 401) {
      await clearCookies();
    } else {
      await getHeartbeat();
    }
  };

  ipcMain.on(LINK_SUMMARY, async (_: IpcMainEvent) => await getSummary());

  ipcMain.on(LINK_SYNC, async (_: IpcMainEvent, assets?: Asset[]) => {
    const response = await canutinLinkApi
      .post<SyncResponseProps>(
        ApiEndpoints.SYNC,
        {
          assets: assets?.filter(asset =>
            [AssetTypeEnum.SECURITY, AssetTypeEnum.CRYPTOCURRENCY].includes(asset.assetType.name)
          ),
        },
        await getCookies()
      )
      .then(response => response)
      .catch(e => e.response);

    if (response.status === 200) {
      const { assetPrices, accounts, removedTransactions } = response.data as SyncResponseProps;

      removedTransactions && (await handleLinkRemovedTransactions(removedTransactions));
      const updatedAccounts = accounts && (await handleLinkAccounts(accounts));
      const updatedAssets = assetPrices && (await handleLinkAssets(assetPrices));

      setTimeout(async () => {
        // updatedAccounts && (await getAccounts(win));
        updatedAssets && (await getAssets(win));
      }, 100);
    }

    await getSummary();
  });

  ipcMain.on(LINK_NEW_INSTITUTION, async (_, metadata: PlaidLinkOnSuccessMetadata) => {
    const newInstitutionResponse = await canutinLinkApi
      .post(ApiEndpoints.NEW_INSTITUTION, metadata, await getCookies())
      .then(response => response.status)
      .catch(e => e.response.status);

    let statusMessage: StatusMessageProps;
    if (newInstitutionResponse === 201) {
      statusMessage = {
        sentiment: StatusEnum.POSITIVE,
        message: 'The institution has been linked succesfully',
        isLoading: false,
      };
    } else if (newInstitutionResponse === 204) {
      statusMessage = {
        sentiment: StatusEnum.WARNING,
        message:
          'The institution has been linked but transaction data is not available yet, please try again later',
        isLoading: false,
      };
    } else {
      statusMessage = {
        sentiment: StatusEnum.NEGATIVE,
        message: "Couldn't link the institution, please try again later",
        isLoading: false,
      };
    }
    win.webContents.send(LINK_NEW_INSTITUTION_ACK, statusMessage);
  });

  ipcMain.on(
    LINK_UPDATE_INSTITUTION,
    async (_: IpcMainEvent, metadata: PlaidLinkOnSuccessMetadata) => {
      const updateInstitutionResponse = await canutinLinkApi
        .post(ApiEndpoints.UPDATE_INSTITUTION, metadata, await getCookies())
        .then(response => response.status)
        .catch(e => e.response.status);

      let statusMessage: StatusMessageProps;
      if (updateInstitutionResponse === 200) {
        statusMessage = {
          sentiment: StatusEnum.POSITIVE,
          message: 'The institution is now fixed',
          isLoading: false,
        };
      } else {
        statusMessage = {
          sentiment: StatusEnum.NEGATIVE,
          message: "Couldn't fix the institution, please try again later",
          isLoading: false,
        };
      }
      win.webContents.send(LINK_UPDATE_INSTITUTION_ACK, statusMessage);
    }
  );

  ipcMain.on(LINK_NEW_INSTITUTION_TOKEN, async () => {
    const newInstitutionToken = await canutinLinkApi
      .get(ApiEndpoints.NEW_INSTITUTION_TOKEN, await getCookies())
      .then(response => response.data.linkToken)
      .catch(e => null);

    win.webContents.send(LINK_NEW_INSTITUTION_TOKEN_ACK, newInstitutionToken);
  });

  ipcMain.on(LINK_UPDATE_INSTITUTION_TOKEN, async () => {
    const updateInstitutionToken = await canutinLinkApi
      .get(ApiEndpoints.UPDATE_INSTITUTION_TOKEN, await getCookies())
      .then(response => response.data.linkToken)
      .catch(e => null);

    win.webContents.send(LINK_UPDATE_INSTITUTION_TOKEN_ACK, updateInstitutionToken);
  });

  ipcMain.on(LINK_UNLINK_INSTITUTION, async (_: IpcMainEvent, id: string) => {
    const isUnlinkedResponse = await canutinLinkApi
      .post(ApiEndpoints.UNLINK_INSTITUTION, { id }, await getCookies())
      .then(response => response.status)
      .catch(e => e.response.status);

    await getSummary();

    let statusMessage: StatusMessageProps;
    if (isUnlinkedResponse === 200) {
      statusMessage = {
        sentiment: StatusEnum.POSITIVE,
        message: 'The institution has been unlinked succesfully',
        isLoading: false,
      };
    } else {
      statusMessage = {
        sentiment: StatusEnum.WARNING,
        message: "Couldn't unlink the institution, please try again later",
        isLoading: false,
      };
    }
    win.webContents.send(LINK_UNLINK_INSTITUTION_ACK, statusMessage);
  });
};

export default setupLinkEvents;
