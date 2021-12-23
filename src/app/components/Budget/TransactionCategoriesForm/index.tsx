import { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { ipcRenderer, IpcRendererEvent } from 'electron';

import FieldNotice from '@app/components/common/Form/FieldNotice';
import Fieldset from '@app/components/common/Form/Fieldset';
import Form from '@app/components/common/Form/Form';
import SelectField from '@app/components/common/Form/SelectField';
import Field from '@app/components/common/Form/Field';
import FormFooter from '@app/components/common/Form/FormFooter';
import SubmitButton from '@app/components/common/Form/SubmitButton';

import { EntitiesContext } from '@app/context/entitiesContext';
import { CATEGORY_GROUPED_OPTIONS } from '@appConstants/categories';
import { Budget } from '@database/entities';
import BudgetIpc from '@app/data/budget.ipc';
import { EVENT_ERROR, EVENT_SUCCESS } from '@constants/eventStatus';
import { StatusBarContext } from '@app/context/statusBarContext';
import { StatusEnum } from '@app/constants/misc';
import { DB_EDIT_BUDGET_CATEGORY_ACK } from '@constants/events';

import { disabledField } from './styles';

const DisabledField = styled.span`
  ${disabledField}
`;

interface TransactionCategoriesFormProps {
  expenseBudgets?: Budget[];
}

export interface EditBudgetCategorySubmit {
  budgetId: number;
  category: string;
}

const TransactionCategoriesForm = ({ expenseBudgets }: TransactionCategoriesFormProps) => {
  const history = useHistory();
  const { setStatusMessage } = useContext(StatusBarContext);
  const { handleSubmit, control, watch, formState, setValue } = useForm({
    defaultValues: {
      category: 'Uncategorized',
      budgetId: expenseBudgets?.[0].id,
    },
    mode: 'onChange'
  });
  const { category } = watch();
  const { settingsIndex } = useContext(EntitiesContext);
  const autoBudget = settingsIndex?.settings.autoBudget;

  const budgetOptions = expenseBudgets?.map(({ name, id }) => ({ value: id, label: name }));

  const onSubmit = (budgetCategory: EditBudgetCategorySubmit) => {
    BudgetIpc.editBudgetCategory(budgetCategory);
  };

  useEffect(() => {
    ipcRenderer.on(DB_EDIT_BUDGET_CATEGORY_ACK, (_: IpcRendererEvent, { status, message }) => {
      if (status === EVENT_SUCCESS) {
        setStatusMessage({
          message: 'Last budget edited successfully',
          sentiment: StatusEnum.POSITIVE,
          isLoading: false,
        });
        history.push('/budget');
      }

      if (status === EVENT_ERROR) {
        setStatusMessage({ message, sentiment: StatusEnum.NEGATIVE, isLoading: false });
      }
    });
  }, [])

  const isDisabled = !formState.isValid || autoBudget;

  return (
    <Form onSubmit={handleSubmit(onSubmit)} role="form">
      <Fieldset>
        {autoBudget ? (
          <Field name="autobudget" label="Auto-budget">
            <DisabledField>Enabled</DisabledField>
          </Field>
        ) : (
          <SelectField
            name="category"
            label="Category"
            groupedOptions={CATEGORY_GROUPED_OPTIONS}
            control={control}
            required
          />
        )}
        <FieldNotice
          title="Re-assigning categories"
          description={
            <div>
              Assigning a category to a budget group will assign transactions with that category to
              the corresponding budget group.
            </div>
          }
        />
      </Fieldset>
      {!autoBudget ? (
        <Fieldset>
          {category ? (
            <SelectField
              name="budgetId"
              label="Assign to budget group"
              control={control}
              required
              options={budgetOptions}
            />
          ) : (
            <Field name="budgetId" label="Assign to budget group">
              <DisabledField>Select category first</DisabledField>
            </Field>
          )}
        </Fieldset>
      ) : null}
      <FormFooter>
        <SubmitButton disabled={isDisabled}>Save</SubmitButton>
      </FormFooter>
    </Form>
  );
};

export default TransactionCategoriesForm;
