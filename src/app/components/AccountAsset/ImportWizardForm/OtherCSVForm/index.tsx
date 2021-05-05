import React, { useEffect, useState, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { ipcRenderer, IpcRendererEvent } from 'electron';

import FormAlert from '@components/common/FormAlert';
import SelectField from '@components/common/Form/SelectField';
import Select from '@components/common/Select';
import InlineCheckbox from '@components/common/Form/Checkbox';
import Field from '@components/common/Form/Field';
import InputText from '@components/common/Form/InputText';
import InputTextField from '@components/common/Form/InputTextField';
import { AnalyzeSourceMetadataType } from '@components/AccountAsset/ImportWizardForm';
import { accountGroupedValues } from '@components/AccountAsset/AddAccountAssetForm/index';

import { DB_GET_ACCOUNTS_ACK } from '@constants/events';
import AccountIpc from '@app/data/account.ipc';
import { Account } from '@database/entities';

import { container, optionList, option, toggleInputContainer } from './styles';
import {
  CATEGORY_GROUPED_OPTIONS,
  SUPPORTED_DATE_FORMAT_OPTIONS,
  NEW_ACCOUNT_OPTION,
  NEW_ACCOUNT_VALUE,
} from './otherCsvConstants';

const Container = styled.div`
  ${container}
`;

const OptionList = styled.div`
  ${optionList}
`;

const Option = styled.div`
  ${option}
`;

const ToggleInputContainer = styled.div`
  ${toggleInputContainer}
`;

export interface OtherCSVFormProps {
  data: any;
  metadata: AnalyzeSourceMetadataType;
}

const OtherCSVForm = ({ data, metadata }: OtherCSVFormProps) => {
  const [accounts, setAccounts] = useState<null | Account[]>(null);
  const { handleSubmit, register, watch, formState, control, setValue } = useForm({
    mode: 'onChange',
  });

  useEffect(() => {
    AccountIpc.getAccounts();

    ipcRenderer.on(DB_GET_ACCOUNTS_ACK, (_: IpcRendererEvent, accounts: Account[]) => {
      setAccounts(accounts);
    });

    return () => {
      ipcRenderer.removeAllListeners(DB_GET_ACCOUNTS_ACK);
    };
  }, []);

  // Watch form values
  const autoCalculate = watch('account.autoCalculate');
  const selectedAccount = watch('account.importAccount');
  const accountColumn = watch('accountColumn');
  const selectedCategoryColumn = watch('categoryColumn');

  // Set values
  useEffect(() => {
    if (selectedAccount === NEW_ACCOUNT_VALUE) {
      setValue('account.autoCalculate', false);
      setValue('account.balance', '');
    }

    if (selectedAccount && accounts && selectedAccount !== NEW_ACCOUNT_VALUE) {
      const account = accounts.find(account => account.id === Number.parseInt(selectedAccount));
      setValue(
        'account.autoCalculate',
        account?.balanceStatements ? account.balanceStatements[0].autoCalculate : false
      );
      setValue(
        'account.balance',
        account?.balanceStatements ? account.balanceStatements[0].value : false
      );
    }
  }, [accounts, selectedAccount, setValue]);

  // Calculated Options
  const columnsOptions = useMemo(
    () => metadata.fields?.map(field => ({ label: field, value: field })),
    [metadata]
  );
  const accountOptions = useMemo(
    () => accounts?.map(account => ({ label: account.name, value: account.id.toString() })),
    [accounts]
  );
  const newAccountOptions = accountOptions
    ? [NEW_ACCOUNT_OPTION, ...accountOptions]
    : [NEW_ACCOUNT_OPTION];
  const columnOptions = useCallback(
    columnName =>
      data
        .map((value: { [x: string]: any }) => value[columnName])
        .filter((column: string, pos: number, self: [string]) => {
          return self.indexOf(column) === pos;
        }),
    [data]
  );

  return (
    <>
      <Container>
        <FormAlert
          title="Interpreting your CSV file"
          description={
            <div>
              To properly import the data we need you to match each of the fields below with the
              corresponding columns from your CSV.
            </div>
          }
          label="Match columns"
        />
        <SelectField
          label="Date column"
          name="dateColumn"
          options={columnsOptions}
          required
          control={control}
        />
        <SelectField
          label="Date format"
          name="dateFormat"
          options={SUPPORTED_DATE_FORMAT_OPTIONS}
          required
          control={control}
        />
        <SelectField
          label="Description column"
          name="descriptionColumn"
          options={columnsOptions}
          required
          control={control}
        />
        <SelectField
          label="Amount column"
          name="amountColumn"
          options={columnsOptions}
          required
          control={control}
        />
        <SelectField
          label="Account column"
          name="accountColumn"
          options={columnsOptions}
          control={control}
          placeholder={''}
          optional
        />
        <SelectField
          label="Category column"
          name="categoryColumn"
          options={columnsOptions}
          control={control}
          placeholder={''}
          optional
        />
      </Container>
      {accountColumn && accountOptions && (
        <Container>
          <Field name="Choose types for new accounts" label="Choose types for new accounts">
            <OptionList>
              {columnOptions(accountColumn).map((accountName: string) => (
                <Option key={accountName}>
                  <label>{accountName}</label>
                  <Select
                    name={`accounts.${accountName.toString()}`}
                    options={accountOptions}
                    control={control}
                  />
                </Option>
              ))}
            </OptionList>
          </Field>
        </Container>
      )}
      {selectedCategoryColumn && (
        <Container>
          <Field name="Match Categories" label="Match Categories">
            <OptionList>
              {columnOptions(selectedCategoryColumn).map((categoryName: string) => (
                <Option key={categoryName}>
                  <label>{categoryName}</label>
                  <Select
                    name={`categories.${categoryName.toString()}`}
                    groupedOptions={CATEGORY_GROUPED_OPTIONS}
                    control={control}
                    defaultFormValue={'Uncategorized'}
                    placeholder={''}
                  />
                </Option>
              ))}
            </OptionList>
          </Field>
        </Container>
      )}
      {!accountColumn && (
        <Container>
          <SelectField
            label="Import to account"
            name="account.importAccount"
            options={newAccountOptions}
            control={control}
            required
          />
          {selectedAccount === NEW_ACCOUNT_VALUE && (
            <>
              <InputTextField label="Name" name="account.name" register={register} required />
              <SelectField
                label="Type"
                name="account.accountType"
                groupedOptions={accountGroupedValues}
                control={control}
                required
              />
              <InputTextField
                label="Institution"
                name="account.institution"
                register={register}
                optional
              />
            </>
          )}
          <Field label="Account balance" name="balance">
            <ToggleInputContainer>
              <InputText
                name="account.balance"
                disabled={autoCalculate}
                setRef={register({ validate: v => autoCalculate || v !== '' })}
              />
              <InlineCheckbox
                name="account.autoCalculate"
                id="autoCalculate"
                label="Auto-calculate from transactions"
                register={register}
              />
            </ToggleInputContainer>
          </Field>
          {!autoCalculate && (
            <FormAlert
              title="Balance history"
              description={
                <div>
                  Every time you manually update the balance of an account, a new balance statement
                  will be created (or updated) for the current week period. You can see past balance
                  statements in the “Overview” tab.
                </div>
              }
              label="Match columns"
            />
          )}
        </Container>
      )}
    </>
  );
};

export default OtherCSVForm;
