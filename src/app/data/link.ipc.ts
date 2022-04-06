import { ipcRenderer } from 'electron';

import {
  LINK_CREATE_ACCOUNT,
  LINK_HEARTBEAT,
  LINK_LOGIN,
  LINK_LOGOUT,
  LINK_SUMMARY,
  LINK_UNLINK_INSTITUTION,
  UserAuthProps,
} from '@constants/link';

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

  static unlinkInstitution(id: string) {
    ipcRenderer.send(LINK_UNLINK_INSTITUTION, id);
  }
}
