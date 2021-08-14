import { ipcRenderer } from 'electron';

import { DB_GET_ACCOUNTS, DB_NEW_ACCOUNT, DB_EDIT_ACCOUNT_BALANCE, DB_GET_ACCOUNT } from '@constants/events';
import { AccountEditBalanceSubmitType, NewAccountType } from '@appTypes/account.type'

export default class AccountIpc {
  static createAccount(account: NewAccountType) {
    ipcRenderer.send(DB_NEW_ACCOUNT, account);
  }

  static getAccounts() {
    ipcRenderer.send(DB_GET_ACCOUNTS);
  }

  static getAccountById(accountId: number) {
    ipcRenderer.send(DB_GET_ACCOUNT, accountId);
  }

  static editBalance(editBalance: AccountEditBalanceSubmitType) {
    ipcRenderer.send(DB_EDIT_ACCOUNT_BALANCE, editBalance)
  }
}
