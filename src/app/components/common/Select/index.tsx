import React from 'react';
import { Controller, Control } from 'react-hook-form';
import styled from 'styled-components';
import ReactSelect from 'react-select';

import { selectInput } from './styles';

const CustomSelect = styled(ReactSelect)`
  ${selectInput}
`;

export type GroupedValue = {
  label: string;
  options: SelectFieldValue[];
};

export type SelectFieldValue = {
  value: string;
  label: string;
};

export interface SelectProps {
  name: string;
  options?: SelectFieldValue[];
  groupedOptions?: GroupedValue[];
  control: Control<Record<string, any>>;
  required?: boolean;
  optional?: boolean;
}

const Select = ({
  name,
  options,
  groupedOptions,
  control,
  required = false,
  optional = false,
}: SelectProps) => {
  const defaultValue = groupedOptions
    ? groupedOptions[0]?.options[0]?.value
    : options && options[0]?.value;

  const optionValue = (value: string) => options?.find(c => c.value === value);

  const groupedValue = (value: string) =>
    groupedOptions
      ?.find(({ options }) => {
        return options.find(c => c.value === value);
      })
      ?.options.find(c => c.value === value);

  return (
    <Controller
      name={name}
      control={control}
      render={({ ref, onChange, value, ...field }) => (
        <CustomSelect
          {...field}
          inputRef={ref}
          classNamePrefix="select"
          options={groupedOptions ? groupedOptions : options}
          onChange={(e: SelectFieldValue) => {
            onChange(e?.value);
          }}
          isClearable={false}
          value={groupedOptions ? groupedValue(value) : optionValue(value)}
        />
      )}
      defaultValue={optional ? null : defaultValue}
      rules={{ required }}
    />
  );
};

export default Select;
