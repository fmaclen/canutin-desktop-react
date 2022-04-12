import React from 'react';

import { StatusEnum } from '@app/constants/misc';

import Field from '@components/common/Form/Field';
import InputText from '@components/common/Form/InputText';
import FieldStatus from '../FieldStatus';

type RefReturn =
  | string
  | ((instance: HTMLInputElement | null) => void)
  | React.RefObject<HTMLInputElement>
  | null
  | undefined;

interface FieldStatusProps {
  status: StatusEnum;
  message?: string;
}

export interface InputTextFieldProps {
  label?: string;
  name: string;
  value?: string;
  type?: string;
  register?: ({ required }: { required?: boolean }) => RefReturn;
  required?: boolean;
  disabled?: boolean;
  optional?: boolean;
  upperCase?: boolean;
  setRef?: any;
  status?: FieldStatusProps;
}

const InputTextField = ({
  label,
  name,
  value,
  register,
  type = 'text',
  required = false,
  disabled = false,
  optional = false,
  setRef = null,
  status,
}: InputTextFieldProps) => (
  <Field label={label} name={name} optional={optional}>
    <div>
      <InputText
        name={name}
        setRef={setRef ? setRef : register ? register({ required }) : null}
        type={type}
        value={value}
        disabled={disabled}
      />

      {status && <FieldStatus status={status.status}>{status.message}</FieldStatus>}
    </div>
  </Field>
);

export default InputTextField;
