import { ipcRenderer } from 'electron';

import {
  LINK_CREATE_ACCOUNT,
  LINK_HEARTBEAT,
  LINK_LOGIN,
  LINK_LOGOUT,
  LINK_NEW_INSTITUTION,
  LINK_NEW_INSTITUTION_TOKEN,
  LINK_SUMMARY,
  LINK_SYNC,
  LINK_UNLINK_INSTITUTION,
  LINK_UPDATE_INSTITUTION,
  LINK_UPDATE_INSTITUTION_TOKEN,
} from '@constants/link';

import { Asset } from '@database/entities';
import { UserAuthProps } from '@appTypes/canutinLink.type';
import { PlaidLinkOnSuccessMetadata } from 'react-plaid-link';

export default class LinkIpc {
  static getHeartbeat() {
    ipcRenderer.send(LINK_HEARTBEAT);
  }

  static login(userAuth: UserAuthProps) {
    ipcRenderer.send(LINK_LOGIN, userAuth);
  }

  static createAccount(userAuth: UserAuthProps) {
    ipcRenderer.send(LINK_CREATE_ACCOUNT, userAuth);
  }

  static logout() {
    ipcRenderer.send(LINK_LOGOUT);
  }

  static getSummary() {
    ipcRenderer.send(LINK_SUMMARY);
  }

  static sync(assets?: Asset[]) {
    ipcRenderer.send(LINK_SYNC, assets);
  }

  static newInstitutionToken() {
    ipcRenderer.send(LINK_NEW_INSTITUTION_TOKEN);
  }

  static updateInstitutionToken(id: string) {
    ipcRenderer.send(LINK_UPDATE_INSTITUTION_TOKEN, id);
  }

  static createInstitution(metadata: PlaidLinkOnSuccessMetadata) {
    ipcRenderer.send(LINK_NEW_INSTITUTION, metadata);
  }

  static updateInstitution(metadata: PlaidLinkOnSuccessMetadata) {
    ipcRenderer.send(LINK_UPDATE_INSTITUTION, metadata);
  }

  static unlinkInstitution(id: string) {
    ipcRenderer.send(LINK_UNLINK_INSTITUTION, id);
  }
}
