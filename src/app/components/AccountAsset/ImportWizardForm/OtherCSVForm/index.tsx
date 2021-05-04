import React from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';

import FormAlert from '@components/common/FormAlert';
import SelectField from '@components/common/Form/SelectField';
import Select from '@components/common/Select';
import InlineCheckbox from '@components/common/Form/Checkbox';
import Field from '@components/common/Form/Field';
import InputText from '@components/common/Form/InputText';

import { container, categoryList, category, toggableInputContainer } from './styles';

const Container = styled.div`
  ${container}
`;

const CategoryList = styled.div`
  ${categoryList}
`;

const Category = styled.div`
  ${category}
`;

const ToggableInputContainer = styled.div`
  ${toggableInputContainer}
`;
// Remove

const OtherCSVForm = () => {
  const { handleSubmit, register, watch, formState, control } = useForm({ mode: 'onChange' });

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
          name="Date column"
          groupedOptions={[]}
          required
          control={control}
        />
        <SelectField
          label="Date format"
          name="Date format"
          groupedOptions={[]}
          required
          control={control}
        />
        <SelectField
          label="Description column"
          name="Description column"
          groupedOptions={[]}
          required
          control={control}
        />
        <SelectField
          label="Amount column"
          name="Amount column"
          groupedOptions={[]}
          required
          control={control}
        />
        <SelectField
          label="Account column"
          name="Account column"
          groupedOptions={[]}
          control={control}
          optional
        />
        <SelectField
          label="Category column"
          name="Category column"
          groupedOptions={[]}
          control={control}
          optional
        />
      </Container>
      <Container>
        <Field name="Match Categories" label="Match Categories">
          <CategoryList>
            <Category>
              <label>Groceries</label>
              <Select name="Groceries" groupedOptions={[]} control={control} />
            </Category>
            <Category>
              <label>Groceries</label>
              <Select name="Groceries" groupedOptions={[]} control={control} />
            </Category>
          </CategoryList>
        </Field>
      </Container>
      <Container>
        <SelectField
          label="Import to account"
          name="Import to account"
          groupedOptions={[]}
          control={control}
          required
        />
        <SelectField label="Type" name="Type" groupedOptions={[]} control={control} required />
        <Field label="Balance" name="balance">
          <ToggableInputContainer>
            <InputText
              name="balance"
              setRef={register}
            />
            <InlineCheckbox
              name="autoCalculate"
              id="autoCalculate"
              label="Auto-calculate from transactions"
              register={register}
            />
          </ToggableInputContainer>
        </Field>
      </Container>
    </>
  );
};

export default OtherCSVForm;
