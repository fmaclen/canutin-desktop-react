import { ipcRenderer } from 'electron';

import {
  DB_GET_TRANSACTIONS,
  DB_DELETE_LINKED_TRANSACTION,
  DB_NEW_TRANSACTION,
  DB_EDIT_TRANSACTION,
  DB_DELETE_TRANSACTION,
  FILTER_TRANSACTIONS,
} from '@constants/events';
import { FilterTransactionInterface, NewTransactionType } from '@appTypes/transaction.type';

export default class TransactionIpc {
  static addTransaction(newTransaction: NewTransactionType) {
    ipcRenderer.send(DB_NEW_TRANSACTION, newTransaction);
  }

  static editTransaction(newTransaction: NewTransactionType) {
    ipcRenderer.send(DB_EDIT_TRANSACTION, newTransaction);
  }

  static deleteTransaction(transactionId: number) {
    ipcRenderer.send(DB_DELETE_TRANSACTION, transactionId);
  }

  static deleteLinkedTransaction(linkId: string) {
    ipcRenderer.send(DB_DELETE_LINKED_TRANSACTION, linkId);
  }

  static getTransactions() {
    ipcRenderer.send(DB_GET_TRANSACTIONS);
  }

  static getFilterTransactions(filter: FilterTransactionInterface) {
    ipcRenderer.send(FILTER_TRANSACTIONS, filter);
  }
}
