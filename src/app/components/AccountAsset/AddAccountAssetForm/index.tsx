import React, { useState } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';

import Field from 'app/components/common/Form/Field';
import RadioGroupField from 'app/components/common/Form/RadioGroupField';
import SelectField, { SelectFieldValue } from 'app/components/common/Form/SelectField';
import InputTextField from 'app/components/common/Form/InputTextField';
import InputText from 'app/components/common/Form/InputText';
import InlineCheckbox from 'app/components/common/Form/Checkbox';
import {
  formContainer,
  form,
  formFooter,
  formSubmitButton,
  toggableInputContainer
} from './styles';
import { ACCOUNT, ASSET } from 'app/constants/misc';
import { AssetTypeEnum } from 'enums/assetType.enum';
import { accountTypes } from 'constants/accountTypes';
import { NewAssetType } from 'types/asset.type';
import { NewAccountType } from 'types/account.type';
import AssetIpc from 'app/data/asset.ipc';
import AccountIpc from 'app/data/account.ipc';

const accountTypesUnflattened = accountTypes.map(({ accountTypes }) => accountTypes);
const accountTypesValues: SelectFieldValue[] = accountTypesUnflattened.flat();

const assetTypesValues: SelectFieldValue[] = [];
const assetTypes = Object.values(AssetTypeEnum);
assetTypes.forEach(assetType => assetTypesValues.push({ name: assetType, label: assetType }));

const FormContainer = styled.div`${formContainer}`;
const Form = styled.form`${form}`;
const FormFooter = styled.div`${formFooter}`;
const FormSubmitButton = styled.button`${formSubmitButton}`;
const ToggableInputContainer = styled.div`${toggableInputContainer}`;

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
  } = useForm({ mode: 'onChange' });
  const {
    handleSubmit: handleAccountSubmit,
    register: registerAccountField,
    watch: watchAccountField,
  } = useForm({ mode: 'onChange' });

  const onSubmitAsset = async (asset: NewAssetType) => {
    AssetIpc.createAsset(asset);
  };

  const onSubmitAccount = async (account: NewAccountType) => {
    AccountIpc.createAccount(account);
    console.log(account);
  };

  const shouldDisplay = accountOrAsset !== '';
  const shouldDisplayAccount = shouldDisplay && accountOrAsset === ACCOUNT;
  const shouldDisplayAsset = shouldDisplay && accountOrAsset === ASSET;

  const { isValid: isValidAsset } = assetFormState;
  const submitAssetDisabled = !shouldDisplay || !isValidAsset;
  const cost = watchAssetField('cost');
  const quantity = watchAssetField('quantity');
  let assetValue = 0;

  if (cost && quantity) assetValue = cost * quantity;

  const autoCalculate = watchAccountField('autoCalculate');
  const accountName = watchAccountField('name');
  const balance = watchAccountField('balance');
  const submitAccountEnabled = shouldDisplay && !!accountName && (autoCalculate || !!balance);

  const formSubmit = shouldDisplayAccount ? handleAccountSubmit(onSubmitAccount) : handleAssetSubmit(onSubmitAsset);
  const submitDisabled = shouldDisplayAccount ? !submitAccountEnabled : submitAssetDisabled;

  return (
    <FormContainer>
      <Form onSubmit={formSubmit}>
        <RadioGroupField
          label="Add new"
          name="accountOrAsset"
          values={[ACCOUNT, ASSET]}
          onSelectOption={(value) => {
            setAccountOrAsset(value);
            onRadioButtonChange(value);
            assetValue = 0;
          }}
        />
        {shouldDisplayAccount && (
          <>
            <SelectField
              label="Account type"
              name="accountType"
              values={accountTypesValues}
              register={registerAccountField}
              required
            />
            <InputTextField label="Name" name="name" register={registerAccountField} />
            <InputTextField label="Official name" name="officialName" optional register={registerAccountField} />
            <InputTextField label="Institution" name="institution" optional register={registerAccountField} />
            <Field label="Balance" name="balance">
              <ToggableInputContainer>
                <InputText
                  name="balance"
                  disabled={autoCalculate}
                  setRef={registerAccountField({ validate: (v) => autoCalculate || (v !== '') })}
                />
                <InlineCheckbox
                  name="autoCalculate"
                  id="autoCalculate"
                  label="Auto-calculate from transactions"
                  register={registerAccountField}
                />
              </ToggableInputContainer>
            </Field>
          </>
        )}
        {shouldDisplayAsset && (
          <>
            <SelectField
              label="Asset Type"
              name="assetType"
              values={assetTypesValues}
              register={registerAssetField}
              required
            />
            <InputTextField label="Name" name="name" register={registerAssetField} required />
            <InputTextField label="Quantity" name="quantity" register={registerAssetField} required />
            <InputTextField label="Cost" name="cost" register={registerAssetField} required />
            <InputTextField label="Value" name="value" value={`$ ${assetValue}`} disabled />
          </>
        )}
      </Form>
      <FormFooter>
        <FormSubmitButton disabled={submitDisabled} onClick={formSubmit}>
          Continue
        </FormSubmitButton>
      </FormFooter>
    </FormContainer>
  );
}

export default AddAccountAssetForm;
