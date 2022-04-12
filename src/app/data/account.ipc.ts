import { ipcRenderer } from 'electron';

import {
  DB_GET_ACCOUNTS,
  DB_NEW_ACCOUNT,
  DB_NEW_LINKED_ACCOUNT,
  DB_EDIT_ACCOUNT_BALANCE,
  DB_EDIT_ACCOUNT_DETAILS,
  DB_DELETE_ACCOUNT,
} from '@constants/repositories';
import {
  AccountEditBalanceSubmitType,
  AccountEditDetailsSubmitType,
  NewAccountType,
} from '@appTypes/account.type';

export default class AccountIpc {
  static getAccounts() {
    ipcRenderer.send(DB_GET_ACCOUNTS);
  }

  static createAccount(account: NewAccountType) {
    ipcRenderer.send(DB_NEW_ACCOUNT, account);
  }

  static async createLinkedAccount(account: NewAccountType) {
    return await ipcRenderer.invoke(DB_NEW_LINKED_ACCOUNT, account);
  }

  static editBalance(editBalance: AccountEditBalanceSubmitType) {
    ipcRenderer.send(DB_EDIT_ACCOUNT_BALANCE, editBalance);
  }

  static editDetails(editDetails: AccountEditDetailsSubmitType) {
    ipcRenderer.send(DB_EDIT_ACCOUNT_DETAILS, editDetails);
  }

  static deleteAccount(accountId: number) {
    ipcRenderer.send(DB_DELETE_ACCOUNT, accountId);
  }
}
