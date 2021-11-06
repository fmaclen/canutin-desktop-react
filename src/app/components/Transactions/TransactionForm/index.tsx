import React, { useMemo, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { CATEGORY_GROUPED_OPTIONS } from '@appConstants/categories';
import { yearsList, monthList, dayList, getCurrentDateInformation } from '@appConstants/dates';
import { dateInUTC } from '@app/utils/date.utils';
import { DB_EDIT_TRANSACTION_ACK, DB_NEW_TRANSACTION_ACK } from '@constants/events';
import { StatusBarContext } from '@app/context/statusBarContext';
import TransactionIpc from '@app/data/transaction.ipc';
import { StatusEnum } from '@app/constants/misc';
import { EVENT_SUCCESS, EVENT_ERROR } from '@constants/eventStatus';

import Form from '@components/common/Form/Form';
import Fieldset from '@components/common/Form/Fieldset';
import InputTextField from '@components/common/Form/InputTextField';
import Field from '@components/common/Form/Field';
import SelectField from '@components/common/Form/SelectField';
import Select from '@components/common/Form/Select';
import InputCurrency from '@components/common/Form/InputCurrency';
import FormFooter from '@components/common/Form/FormFooter';
import SubmitButton from '@components/common/Form/SubmitButton';
import InlineCheckbox from '@components/common/Form/Checkbox';
import ToggleInputField from '@components/common/Form/ToggleInputField';

import { dateField } from './styles';
import { EntitiesContext } from '@app/context/entitiesContext';

const DateField = styled.div`
  ${dateField}
`;

interface TransactionFormProps {
  initialState?: TransactionSubmitType;
}

type TransactionSubmitType = {
  account: string | null;
  balance: string | null;
  category: string;
  year: number;
  month: number;
  day: number;
  description: string | null;
  excludeFromTotals: boolean;
  id?: number;
};

const DATE_INFORMATION = getCurrentDateInformation();

const TransactionForm = ({ initialState }: TransactionFormProps) => {
  const history = useHistory();
  const { setStatusMessage } = useContext(StatusBarContext);
  const { accountsIndex } = useContext(EntitiesContext);
  const accountOptions = useMemo(
    () =>
      accountsIndex?.accounts?.map(account => ({
        label: account.name,
        value: account.id.toString(),
      })),
    [accountsIndex?.lastUpdate]
  );
  const { handleSubmit, control, register, watch, formState } = useForm({
    mode: 'onChange',
    defaultValues: initialState
      ? initialState
      : {
          account: accountsIndex?.accounts[0].id.toString() ?? null,
          description: null,
          category: 'Uncategorized',
          day: DATE_INFORMATION.day,
          month: DATE_INFORMATION.month,
          year: DATE_INFORMATION.year,
          balance: '',
          excludeFromTotals: false,
        },
  });

  const excludeFromTotals = watch('excludeFromTotals');
  const description = watch('description');
  const balance = watch('balance');

  useEffect(() => {
    ipcRenderer.on(DB_NEW_TRANSACTION_ACK, (_: IpcRendererEvent, { status, message }) => {
      if (status === EVENT_SUCCESS) {
        setStatusMessage({
          message: 'The transaction was successfully created',
          sentiment: StatusEnum.POSITIVE,
          isLoading: false,
        });
        history.goBack();
      }

      if (status === EVENT_ERROR) {
        setStatusMessage({ message, sentiment: StatusEnum.NEGATIVE, isLoading: false });
      }
    });

    ipcRenderer.on(DB_EDIT_TRANSACTION_ACK, (_: IpcRendererEvent, { status, message }) => {
      if (status === EVENT_SUCCESS) {
        setStatusMessage({
          message: 'The transaction was successfully updated',
          sentiment: StatusEnum.POSITIVE,
          isLoading: false,
        });
        history.goBack();
      }

      if (status === EVENT_ERROR) {
        setStatusMessage({ message, sentiment: StatusEnum.NEGATIVE, isLoading: false });
      }
    });

    return () => {
      ipcRenderer.removeAllListeners(DB_NEW_TRANSACTION_ACK);
      ipcRenderer.removeAllListeners(DB_EDIT_TRANSACTION_ACK);
    };
  }, []);

  const onSubmit = ({
    account,
    balance,
    category,
    year,
    month,
    day,
    description,
    excludeFromTotals,
  }: TransactionSubmitType) => {
    const date = new Date(year, month, day);
    const transaction = {
      accountId: Number(account),
      balance: Number(balance),
      categoryName: category,
      date: dateInUTC(date),
      description,
      excludeFromTotals,
      id: initialState?.id,
    };

    if (initialState) {
      TransactionIpc.editTransaction(transaction);
    } else {
      TransactionIpc.addTransaction(transaction);
    }
  };

  const submitIsDisabled = description === '' || !formState.isValid;

  return (
    <Form onSubmit={handleSubmit(onSubmit)} role="form">
      <Fieldset>
        <SelectField
          label="Account"
          name="account"
          options={accountOptions}
          control={control}
          required
        />
      </Fieldset>
      <Fieldset>
        <InputTextField label="Description" name="description" register={register} />
        <Field label="Date" name="date">
          <DateField>
            <Select name="year" options={yearsList} control={control} required />
            <Select name="month" options={monthList} control={control} required />
            <Select name="day" options={dayList} control={control} required />
          </DateField>
        </Field>
        <SelectField
          name="category"
          label="Category"
          groupedOptions={CATEGORY_GROUPED_OPTIONS}
          control={control}
          required
        />
        <Field label="Amount" name="balance">
          <ToggleInputField>
            <InputCurrency
              value={balance && Number(balance)}
              rules={{ validate: v => excludeFromTotals || v !== '' }}
              name="balance"
              control={control}
              required
            />
            <InlineCheckbox
              name="excludeFromTotals"
              id="excludeFromTotals"
              label="Exclude from totals"
              register={register}
            />
          </ToggleInputField>
        </Field>
      </Fieldset>
      <FormFooter>
        <SubmitButton disabled={submitIsDisabled}>
          {initialState ? 'Save changes' : 'Add transaction'}
        </SubmitButton>
      </FormFooter>
    </Form>
  );
};

export default TransactionForm;
