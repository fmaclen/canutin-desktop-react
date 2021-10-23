import React, { Dispatch, SetStateAction } from 'react';

import { SelectFieldValue } from '@components/common/Form/Select';
import { filterOptions } from '@app/constants/filters';

import ButtonRow from '@components/common/ButtonRow';
import ButtonSelect from '@components/common/ButtonSelect';

interface AccountOverviewHeaderProps {
  filterOption: SelectFieldValue;
  setFilterOption: Dispatch<SetStateAction<SelectFieldValue>>;
}

const TrendsHeader = ({ filterOption, setFilterOption }: AccountOverviewHeaderProps) => {
  return (
    <ButtonRow>
      <ButtonSelect
        options={filterOptions}
        value={filterOption}
        onChange={setFilterOption}
        isSearchable={false}
        classNamePrefix="select"
      />
    </ButtonRow>
  );
};

export default TrendsHeader;
