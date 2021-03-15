import React, { useState } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';

import RadioInputGroup from 'app/components/common/RadioInputGroup';
import SelectInput from 'app/components/common/SelectInput';
import Input from 'app/components/common/Input';
import { formContainer, form, formFooter, formSubmitButton } from './styles';
import { ACCOUNT, ASSET } from 'app/constants/misc';
import { AssetTypeEnum } from 'app/constants/assets';

const FormContainer = styled.div`${formContainer}`;
const Form = styled.form`${form}`;
const FormFooter = styled.div`${formFooter}`;
const FormSubmitButton = styled.button`${formSubmitButton}`;

const AddAccountAssetForm = () => {
  const { handleSubmit, register, errors } = useForm();
  const [accountOrAsset, setAccountOrAsset] = useState('');

  const onSubmit = async (data: any) => {
  };

  const shouldDisplay = accountOrAsset !== '';
  const shouldDisplayAccount = shouldDisplay && accountOrAsset === ACCOUNT;
  const shouldDisplayAsset = shouldDisplay && accountOrAsset === ASSET;
  const assetTypes = Object.values(AssetTypeEnum);
  const submitDisabled = !shouldDisplay || !!Object.keys(errors).length;

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <RadioInputGroup
          label="Add new"
          name="accountOrAsset"
          values={[ACCOUNT, ASSET]}
          onSelectOption={(value) => setAccountOrAsset(value)}
          required
        />
        {shouldDisplayAccount && <div>Account</div>}
        {shouldDisplayAsset && (
          <>
            <SelectInput
              label="Asset Type"
              name="assetType"
              values={assetTypes}
              register={register}
              required
            />
            <Input label="Name" name="name" register={register} required />
            <Input label="Value" name="value" register={register} required />
          </>
        )}
      </Form>
      <FormFooter>
        <FormSubmitButton disabled={submitDisabled} onClick={handleSubmit(onSubmit)}>Continue</FormSubmitButton>
      </FormFooter>
    </FormContainer>
  );
}

export default AddAccountAssetForm;
