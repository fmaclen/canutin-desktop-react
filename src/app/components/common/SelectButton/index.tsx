import React from 'react';

import { SelectFieldValue, CustomSelect } from '@components/common/Form/Select';
import { grey70, borderGrey, whitePlain } from '@appConstants/colors';

interface SelectButtonProps {
  options: SelectFieldValue[];
  onChange: (e: SelectFieldValue | null) => void;
  value: SelectFieldValue | null;
}

const customStyles = {
  container: (base: any) => ({
    ...base,
    display: 'grid',
    gridAutoFlow: 'column',
    gridGap: '8px',
    borderRadius: '3px',
  }),
  control: (base: any) => ({
    ...base,
    borderWidth: 2,
    borderColor: `${borderGrey}`,
    height: 40,
    minHeight: 40,
    width: 196,
    background: `${whitePlain}`,
  }),
  singleValue: (base: any) => ({
    ...base,
    fontSize: '12px',
    color: grey70,
  }),
  indicatorsContainer: () => ({
    fontSize: '8px',
    paddingRight: '12px',
  }),
};

const DropdownIndicator = () => <>▼</>;

const SelectButton = ({ options, value, onChange }: SelectButtonProps) => (
  <CustomSelect
    options={options}
    value={value}
    onChange={onChange}
    isSearchable={false}
    styles={customStyles}
    components={{ DropdownIndicator, IndicatorSeparator: null }}
  />
);

export default SelectButton;
