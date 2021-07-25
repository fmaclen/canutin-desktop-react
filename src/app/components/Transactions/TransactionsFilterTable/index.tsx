import React from 'react';

import { Transaction } from '@database/entities';

interface TransactionsFilterTableProps {
  transactions: Transaction[]
}

const TransactionsFilterTable = ({ transactions }: TransactionsFilterTableProps) => <div/>;

export default TransactionsFilterTable;
