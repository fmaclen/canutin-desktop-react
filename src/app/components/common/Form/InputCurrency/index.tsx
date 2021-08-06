/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import { Controller, Control, FieldError, RegisterOptions } from 'react-hook-form';
import styled from 'styled-components';
import { NumberFormatPropsBase } from 'react-number-format';

import FieldStatus from '@components/common/Form/FieldStatus';
import NumberFormat from '@components/common/NumberFormat';

import { StatusEnum } from '@appConstants/misc';

import { inputElement } from './styles';

const CustomNumberFormat = styled.input`
  ${inputElement}
`;

export interface InputCurrencyProps extends NumberFormatPropsBase {
  name: string;
  control: Control<Record<string, any>>;
  disabled?: boolean;
  defaultFormValue?: string | null;
  error?: FieldError;
  rules?: Exclude<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs'>;
  allowNegative?: boolean;
}

const InputCurrency = ({
  name,
  control,
  disabled = false,
  defaultFormValue,
  error,
  rules,
  allowNegative = true,
  ...numberFormatProps
}: InputCurrencyProps) => (
  <>
    <Controller
      render={({ value, onChange, name }) => {
        return (
          <NumberFormat
            allowNegative={allowNegative}
            decimalScale={2}
            thousandSeparator
            prefix="$"
            value={value}
            id={name}
            onValueChange={values => {
              onChange(values.value);
            }}
            disabled={disabled}
            // @ts-ignore
            name={name}
            customInput={CustomNumberFormat}
            {...numberFormatProps}
            placeholder="$0.00"
          />
        );
      }}
      name={name}
      control={control}
      defaultValue={defaultFormValue ? defaultFormValue : null}
      rules={rules}
    />
    {error && <FieldStatus status={StatusEnum.NEGATIVE}>{error.message}</FieldStatus>}
  </>
);

export default InputCurrency;
