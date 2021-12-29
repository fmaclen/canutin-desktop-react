import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { useTable, useSortBy, Column, SortingRule } from 'react-table';
import styled from 'styled-components';

import { Budget } from '@database/entities';

import {
  tableHeaderRow,
  tableHeaderItem,
  tableContainer,
  tableSortIcon,
  row,
  rowItem,
} from './styles';
import EmptyCard from '@components/common/EmptyCard';
import { CategoryCell } from '@app/components/Transactions/TransactionsFilterTable/TransactionsFilterTableCells';

const TableContainer = styled.table`
  ${tableContainer}
`;
const TableHeaderRow = styled.tr`
  ${tableHeaderRow}
`;
const TableHeaderItem = styled.th`
  ${tableHeaderItem}
`;
const TableSortIcon = styled.div`
  ${tableSortIcon}
`;
const Row = styled.tr`
  ${row};
`;
const RowItem = styled.td`
  ${rowItem}
`;

interface CategoriesTableProps {
  expenseBudgets?: Budget[];
}

const CategoriesTable = ({ expenseBudgets }: CategoriesTableProps) => {
  const [sortBy, setSortBy] = useState<SortingRule<{ name: string; categoryName: string }>[]>([
    { id: 'categoryName', desc: true },
  ]);
  const budgetData = useMemo(
    () =>
      expenseBudgets
        ? expenseBudgets.reduce((acc, { name, categories }) => {
            return [...acc, ...categories.map(category => ({ name, categoryName: category.name }))];
          }, [] as { name: string; categoryName: string }[])
        : [],
    [expenseBudgets]
  );
  const columns = useMemo(
    () =>
      ([
        {
          Header: 'Category',
          accessor: 'categoryName',
          Cell: CategoryCell,
        },
        {
          Header: 'Budget group',
          accessor: 'name',
          Cell: CategoryCell,
        },
      ] as unknown) as Column<{ name: string; categoryName: string }>[],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, state } = useTable(
    {
      columns,
      data: budgetData,
      disableSortRemove: true,
      initialState: {
        sortBy,
      },
    },
    useSortBy
  );

  useEffect(() => {
    setSortBy(state.sortBy);
  }, [state]);

  const RenderRow = React.useCallback(
    () =>
      rows.map(row => {
        prepareRow(row);
        return (
          <Row {...row.getRowProps()}>
            {row.cells.map(cell => {
              return <RowItem {...cell.getCellProps()}>{cell.render('Cell')}</RowItem>;
            })}
          </Row>
        );
      }),
    [prepareRow, rows]
  );
  const RenderHeader = useCallback(
    () =>
      headerGroups.map(headerGroup => (
        <TableHeaderRow {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map(column => (
            // Add the sorting props to control sorting. For this example
            // we can add them into the header props
            <TableHeaderItem
              isSorted={column.isSorted}
              {...column.getHeaderProps(column.getSortByToggleProps())}
            >
              <div>
                {column.render('Header')}
                <TableSortIcon>
                  {column.isSorted ? (column.isSortedDesc ? '▼' : '▲') : ''}
                </TableSortIcon>
              </div>
              {/* Add a sort direction indicator */}
            </TableHeaderItem>
          ))}
        </TableHeaderRow>
      )),
    [headerGroups]
  );

  return (
    <>
      {rows.length === 0 && <EmptyCard message="No categories are assigned to any expense group" />}
      {rows.length !== 0 && (
        <TableContainer {...getTableProps()}>
          <thead>{RenderHeader()}</thead>
          <tbody {...getTableBodyProps()}>{RenderRow()}</tbody>
        </TableContainer>
      )}
    </>
  );
};

export default CategoriesTable;
