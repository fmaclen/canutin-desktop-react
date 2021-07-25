import React, { useState, useContext, useEffect } from 'react';
import { ipcRenderer, IpcRendererEvent } from 'electron';

import Section from '@components/common/Section';
import { SegmentedControl, Segment } from '@components/common/SegmentedControl';
import TransactionsFilterTable from '@components/Transactions/TransactionsFilterTable';

import { TransactionsContext } from '@app/context/transactionsContext';
import TransactionIpc from '@app/data/transaction.ipc';
import { FILTER_TRANSACTIONS_ACK } from '@constants/events';
import { Transaction } from '@database/entities';

export enum TransactionOverviewSegmentsEnum {
  ALL = 'all',
  CREDITS = 'credits',
  DEBITS = 'debits',
}

const TransactionsOverviewSection = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedSegment, setSelectedSegment] = useState(TransactionOverviewSegmentsEnum.ALL);
  const { filterOption } = useContext(TransactionsContext);

  useEffect(() => {
    TransactionIpc.getFilterTransactions(filterOption?.value);

    ipcRenderer.on(FILTER_TRANSACTIONS_ACK, (_: IpcRendererEvent, transactions: Transaction[]) => {
      setTransactions(transactions);
    });

    return () => {
      ipcRenderer.removeAllListeners(FILTER_TRANSACTIONS_ACK);
    };
  }, [filterOption?.value]);

  const balanceSheetSegments = (
    <SegmentedControl>
      {Object.values(TransactionOverviewSegmentsEnum).map((balanceSheetSegmentTitle, key) => (
        <Segment
          onClick={() => setSelectedSegment(balanceSheetSegmentTitle)}
          isActive={balanceSheetSegmentTitle === selectedSegment}
          key={key}
          label={balanceSheetSegmentTitle}
        />
      ))}
    </SegmentedControl>
  );

  return (
    <Section title="Filter transactions" scope={balanceSheetSegments}>
      <TransactionsFilterTable transactions={transactions} />
    </Section>
  );
};

export default TransactionsOverviewSection;
