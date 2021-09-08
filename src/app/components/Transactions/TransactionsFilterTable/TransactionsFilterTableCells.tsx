import React from 'react';
import { CellProps } from 'react-table';
import styled from 'styled-components';

import { formatDate } from '@app/utils/date.utils';
import { Transaction } from '@database/entities';

import NumberFormat from '@components/common/NumberFormat';
import TextLink from '@components/common/TextLink';
import Tag from '@components/common/Tag';
import { amountCell, dateCell, linkCell, descriptionCellContainer } from './styles';

const AmountCellField = styled(NumberFormat)`
  ${amountCell}
`;
const DateCellField = styled.span`
  ${dateCell}
`;
const LinkCellField = styled.p`
  ${linkCell}
`;
const DescriptionCellContainer = styled.div`
  ${descriptionCellContainer};
`;

export const DateCell = ({ value }: CellProps<Transaction>) => (
  <DateCellField>{formatDate(value)}</DateCellField>
);

export const AmountCell = ({
  value,
  row: {
    original: { pending, excludeFromTotals },
  },
}: CellProps<Transaction>) => {
  const isExcluded = pending || excludeFromTotals;
  return (
    <AmountCellField
      title={isExcluded ? 'This transaction is excluded from totals' : undefined}
      displayType="text"
      value={value}
      excludeFromTotals={isExcluded}
    />
  );
};

export const DescriptionCell = ({ value, ...props }: CellProps<Transaction>) => (
  <DescriptionCellContainer>
    {props.row.original.pending && (
      <Tag title="The transaction has been authorized by your financial institution but hasn't been finalized">
        Pending
      </Tag>
    )}
    <TextLink
      pathname={`transactions/${props.row.original.category.name}/${props.row.original.account.name}/Edit`}
      state={{ transaction: props.row.original }}
      label={value}
      disabled={props.row.original.pending}
    />
  </DescriptionCellContainer>
);

export const LinkCell = ({ value }: CellProps<Transaction>) => (
  <LinkCellField>{value}</LinkCellField>
);
