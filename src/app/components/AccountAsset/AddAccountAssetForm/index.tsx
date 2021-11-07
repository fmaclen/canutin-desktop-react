import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';

import Form from '@components/common/Form/Form';
import Fieldset from '@components/common/Form/Fieldset';
import Field from '@components/common/Form/Field';
import RadioGroupField from '@components/common/Form/RadioGroupField';
import SelectField from '@components/common/Form/SelectField';
import InputTextField from '@components/common/Form/InputTextField';
import InlineCheckbox from '@components/common/Form/Checkbox';
import FormFooter from '@components/common/Form/FormFooter';
import SubmitButton from '@components/common/Form/SubmitButton';
import InputCurrency from '@components/common/Form/InputCurrency';
import InputCurrencyField from '@components/common/Form/InputCurrencyField';

import { ACCOUNT, ASSET } from '@appConstants/misc';
import { accountGroupedValues } from '@constants/accountTypes';
import { assetTypesWithSymbol, assetTypesValues } from '@constants/assetTypes';
import AssetIpc from '@app/data/asset.ipc';
import AccountIpc from '@app/data/account.ipc';

import { NewAssetType } from '../../../../types/asset.type';
import { NewAccountType } from '../../../../types/account.type';
import { toggableInputContainer } from './styles';

const ToggableInputContainer = styled.div`
  ${toggableInputContainer}
`;

export interface AddAccountAssetFormProps {
  onRadioButtonChange: (_: string) => void;
}

const AddAccountAssetForm = ({ onRadioButtonChange }: AddAccountAssetFormProps) => {
  const [accountOrAsset, setAccountOrAsset] = useState('');
  const {
    handleSubmit: handleAssetSubmit,
    register: registerAssetField,
    watch: watchAssetField,
    formState: assetFormState,
    control: controlAssetField,
    setValue: setValueAssetForm,
  } = useForm({ mode: 'onChange' });
  const {
    handleSubmit: handleAccountSubmit,
    register: registerAccountField,
    watch: watchAccountField,
    control: controlAccountField,
  } = useForm({ mode: 'onChange' });

  const onSubmitAsset = async (asset: NewAssetType) => {
    AssetIpc.createAsset(asset);
  };

  const onSubmitAccount = async (account: NewAccountType) => {
    AccountIpc.createAccount(account);
  };

  const shouldDisplay = accountOrAsset !== '';
  const shouldDisplayAccount = shouldDisplay && accountOrAsset === ACCOUNT;
  const shouldDisplayAsset = shouldDisplay && accountOrAsset === ASSET;

  const { isValid: isValidAsset } = assetFormState;
  const submitAssetDisabled = !shouldDisplay || !isValidAsset;
  const cost = watchAssetField('cost');
  const quantity = watchAssetField('quantity');
  const assetTypeSelected = watchAssetField('assetType');
  const symbol: string = watchAssetField('symbol');
  const shouldDisplayAssetWithSymbolFields = assetTypesWithSymbol.includes(assetTypeSelected);

  useEffect(() => {
    if (cost && quantity) {
      setValueAssetForm('value', cost * quantity, { shouldValidate: true });
    } else {
      setValueAssetForm('value', 0, { shouldValidate: true });
    }
  }, [cost, quantity]);

  useEffect(() => {
    if (symbol) {
      setValueAssetForm('symbol', symbol.toUpperCase());
    }
  }, [symbol]);

  const autoCalculated = watchAccountField('autoCalculated');
  const accountName = watchAccountField('name');
  const balance = watchAccountField('balance');
  const submitAccountEnabled = shouldDisplay && !!accountName && (autoCalculated || !!balance);

  const formSubmit = shouldDisplayAccount
    ? handleAccountSubmit(onSubmitAccount)
    : handleAssetSubmit(onSubmitAsset);
  const submitDisabled = shouldDisplayAccount ? !submitAccountEnabled : submitAssetDisabled;

  return (
    <Form onSubmit={formSubmit} role="form">
      <Fieldset>
        <RadioGroupField
          label="Add new"
          name="accountOrAsset"
          values={[ACCOUNT, ASSET]}
          onSelectOption={(value: string) => {
            setAccountOrAsset(value);
            onRadioButtonChange(value);
            setValueAssetForm('value', 0, { shouldValidate: true });
          }}
        />
        {shouldDisplayAsset && (
          <>
            <SelectField
              label="Asset type"
              name="assetType"
              groupedOptions={assetTypesValues}
              control={controlAssetField}
              required
            />
            <InputTextField label="Name" name="name" register={registerAssetField} required />
            {shouldDisplayAssetWithSymbolFields && (
              <InputTextField optional label="Symbol" name="symbol" register={registerAssetField} />
            )}
          </>
        )}
      </Fieldset>
      {shouldDisplayAccount && (
        <Fieldset>
          <SelectField
            label="Account type"
            name="accountType"
            groupedOptions={accountGroupedValues}
            required
            control={controlAccountField}
          />
          <InputTextField label="Name" name="name" register={registerAccountField} />
          <InputTextField
            label="Official name"
            name="officialName"
            optional
            register={registerAccountField}
          />
          <InputTextField
            label="Institution"
            name="institution"
            optional
            register={registerAccountField}
          />
          <Field label="Balance" name="balance">
            <ToggableInputContainer>
              <InputCurrency
                name="balance"
                control={controlAccountField}
                disabled={autoCalculated}
                rules={{ validate: v => autoCalculated || v !== '' }}
              />
              <InlineCheckbox
                name="autoCalculated"
                id="autoCalculated"
                label="Auto-calculate from transactions"
                register={registerAccountField}
              />
            </ToggableInputContainer>
          </Field>
        </Fieldset>
      )}
      {shouldDisplayAsset && (
        <Fieldset>
          {shouldDisplayAssetWithSymbolFields && (
            <>
              <InputTextField
                label="Quantity"
                type="number"
                name="quantity"
                register={registerAssetField}
                required
              />
              <InputCurrencyField
                label="Cost"
                name="cost"
                allowNegative={false}
                control={controlAssetField}
                rules={{ required: true }}
              />
            </>
          )}
          <InputCurrencyField
            label="Value"
            name="value"
            allowNegative={!shouldDisplayAssetWithSymbolFields}
            control={controlAssetField}
            disabled={shouldDisplayAssetWithSymbolFields}
            rules={{ required: !shouldDisplayAssetWithSymbolFields }}
          />
        </Fieldset>
      )}
      <FormFooter>
        <SubmitButton disabled={submitDisabled}>Continue</SubmitButton>
      </FormFooter>
    </Form>
  );
};

export default AddAccountAssetForm;
