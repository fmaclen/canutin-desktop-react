import React, { useState, useEffect, useContext } from 'react';
import { useAsyncDebounce } from 'react-table';
import styled from 'styled-components';

import SelectButton from '@app/components/common/SelectButton';
import { Transaction } from '@database/entities';
import { TransactionsContext, filterOptions } from '@app/context/transactionsContext';

import { container } from './styles';
import { inputElement } from '@components/common/Form/InputText/styles';

const Container = styled.div`
  ${container}
`;
const GlobalInput = styled.input`
  ${inputElement};
`;

interface TransactionsGlobalFilterProps {
  globalFilter: string;
  setGlobalFilter: (e: any) => void;
  transactionsData: Transaction[];
}

const TransactionsGlobalFilter = ({
  globalFilter,
  setGlobalFilter,
  transactionsData,
}: TransactionsGlobalFilterProps) => {
  const { filterOption, setFilterOption } = useContext(TransactionsContext);
  const [value, setValue] = useState(globalFilter);
  const onChange = useAsyncDebounce(value => {
    setGlobalFilter(value || undefined);
  }, 200);

  useEffect(() => {
    setGlobalFilter(value || undefined);
  }, [transactionsData]);

  return (
    <Container>
      <GlobalInput
        value={value || ''}
        onChange={e => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder="Search by date, description, category, account or amount"
      />
      <SelectButton options={filterOptions} onChange={setFilterOption} value={filterOption} />
    </Container>
  );
};

export default TransactionsGlobalFilter;
