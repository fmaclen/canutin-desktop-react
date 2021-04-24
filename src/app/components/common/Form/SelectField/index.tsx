import React from 'react';
import { Controller, Control } from 'react-hook-form';
import styled from 'styled-components';
import Select from 'react-select';

import Field from '@components/common/Form/Field';

import { selectInput } from './styles';

const CustomSelect = styled(Select)`
  ${selectInput}
`;

export type SelectFieldValue = {
  value: string;
  label: string;
};

export interface SelectFieldProps {
  label: string;
  name: string;
  options: SelectFieldValue[];
  control: Control<Record<string, any>>;
  required?: boolean;
  optional?: boolean;
}

const SelectField = ({
  label,
  name,
  options,
  control,
  required = false,
  optional = false,
}: SelectFieldProps) => (
  <Field label={label} name={name} optional={optional}>
    <Controller
      name={name}
      control={control}
      render={({ ref, onChange, value, ...field }) => (
        <CustomSelect
          {...field}
          inputRef={ref}
          classNamePrefix="select"
          options={options}
          onChange={(e: SelectFieldValue) => onChange(e?.value)}
          isClearable={false}
          value={options.find(c => c.value === value)}
        />
      )}
      defaultValue={options[0].value}
      rules={{ required }}
    />
  </Field>
);

export default SelectField;
