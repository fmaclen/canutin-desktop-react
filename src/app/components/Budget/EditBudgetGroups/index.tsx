import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import styled from 'styled-components';

import { EntitiesContext } from '@app/context/entitiesContext';
import { Budget } from '@database/entities';

import Fieldset from '@app/components/common/Form/Fieldset';
import Form from '@app/components/common/Form/Form';
import FormFooter from '@app/components/common/Form/FormFooter';
import RadioGroupField from '@app/components/common/Form/RadioGroupField';
import FieldNotice from '@app/components/common/Form/FieldNotice';
import SubmitButton from '@app/components/common/Form/SubmitButton';
import Section from '@app/components/common/Section';
import InputTextField from '@app/components/common/Form/InputTextField';
import InputCurrencyField from '@app/components/common/Form/InputCurrencyField';
import BudgetIpc from '@app/data/budget.ipc';
import Button from '@app/components/common/Button';
import ToggleInputField from '@app/components/common/Form/ToggleInputField';
import InlineCheckbox from '@app/components/common/Form/Checkbox';
import InputCurrency from '@app/components/common/Form/InputCurrency';
import Field from '@app/components/common/Form/Field';

import { buttonFieldContainer } from './styles';
import InputText from '@app/components/common/Form/InputText';

const ButtonFieldContainer = styled.div`
  ${buttonFieldContainer}
`;

interface EditBudgetGroupsProps {
  date: Date;
  expenseBudgets: Budget[];
  targetIncome: number;
  targetSavings: number;
}

export type EditBudgetSubmit = {
  autoBudget: 'Enable' | 'Disabled';
  targetIncome: number;
  group: { [id: string]: { targetAmount: number; name?: string } };
  removeGroupIds: number[];
};

const AUTO_BUDGET_GROUPS = [
  {
    id: '-1',
    name: 'Needs',
    targetAmount: -3750,
  },
  {
    id: '-2',
    name: 'Wants',
    targetAmount: -2250,
  },
];

const EditBudgetGroups = ({
  date,
  expenseBudgets,
  targetIncome,
  targetSavings,
}: EditBudgetGroupsProps) => {
  const [removeGroupIds, setRemoveGroupIds] = useState<number[]>([]);
  const { settingsIndex } = useContext(EntitiesContext);
  const { handleSubmit, register, watch, formState, control, setValue } = useForm({
    mode: 'onChange',
    defaultValues: {
      autoBudget: settingsIndex?.settings.budgetAuto ? 'Enable' : 'Disabled',
      targetIncome,
      targetSavings,
      group: expenseBudgets.reduce(
        (accGroup, expandedGroup) => ({
          ...accGroup,
          [expandedGroup.id]: {
            targetAmount: expandedGroup.targetAmount,
            name: expandedGroup.name,
          },
        }),
        {}
      ) as { [id: string]: { targetAmount: number; name?: string } },
    },
  });
  const { autoBudget, group, targetIncome: targetIncomeForm } = watch();
  const isAutoBudget = autoBudget === 'Enable';

  useEffect(() => {
    if (isAutoBudget) {
      setValue(
        'group',
        AUTO_BUDGET_GROUPS.reduce(
          (acc, { id, name, targetAmount }) => ({ ...acc, [id]: { name, targetAmount } }),
          {}
        )
      );

      setValue('targetIncome', 7800);
    }
  }, [isAutoBudget]);

  useEffect(() => {
    setValue(
      'group',
      expenseBudgets.reduce(
        (accGroup, expandedGroup) => ({
          ...accGroup,
          [expandedGroup.id]: {
            targetAmount: expandedGroup.targetAmount,
            name: expandedGroup.name,
          },
        }),
        {}
      )
    );
  }, [JSON.stringify(expenseBudgets)]);

  useEffect(() => {
    const totalTargetsExpenses = group
      ? Object.keys(group).reduce((acc, key) => acc + Number(group[key].targetAmount), 0)
      : 0;
    setValue('targetSavings', Number(targetIncomeForm) + totalTargetsExpenses);
  }, [targetIncomeForm, JSON.stringify(group), isAutoBudget]);

  useEffect(() => {
    setValue('targetSavings', targetSavings);
  }, [targetSavings]);

  const submitIsDisabled = !formState.isDirty;

  const onSubmit = (editBudgetSubmit: EditBudgetSubmit) => {
    BudgetIpc.editBudgetGroups({ ...editBudgetSubmit, removeGroupIds });
  };

  const onRemove = (id: number) => {
    setRemoveGroupIds(prev => [...prev, id]);
  };

  return (
    <Section title="Budget groups">
      <Form onSubmit={handleSubmit(onSubmit)} role="form">
        <Fieldset>
          <RadioGroupField
            label="Auto-budget"
            name="autoBudget"
            register={register}
            values={['Enable', 'Disabled']}
          />
          {!isAutoBudget && (
            <FieldNotice
              title="Custom budget"
              description={
                <div>{`By manually updating the following values you’ll be setting a new budget for the current month (${format(
                  date,
                  'MMM yyyy'
                )}). This budget will also be used for future months until it’s updated again.`}</div>
              }
            />
          )}
        </Fieldset>
        <Fieldset>
          <InputCurrencyField
            label="Target income"
            name="targetIncome"
            control={control}
            disabled={isAutoBudget}
            allowNegative={false}
          />
        </Fieldset>
        {(isAutoBudget ? ((AUTO_BUDGET_GROUPS as unknown) as Budget[]) : expenseBudgets).map(
          ({ id, name }) =>
            !removeGroupIds.includes(id) ? (
              <Fieldset key={id}>
                <Field name="group" label="Expense group">
                  <ButtonFieldContainer>
                    <InputText
                      name={`group.${id}.name`}
                      disabled={isAutoBudget}
                      register={register}
                    />
                    <Button
                      onClick={() => {
                        onRemove(id);
                      }}
                      disabled={isAutoBudget}
                    >
                      Remove
                    </Button>
                  </ButtonFieldContainer>
                </Field>
                <Field label={`${name} target`} name="group">
                  <InputCurrency
                    name={`group.${id}.targetAmount`}
                    control={control}
                    onlyNegative
                    disabled={isAutoBudget}
                  />
                </Field>
              </Fieldset>
            ) : null
        )}
        <Fieldset>
          <InputTextField name="savings" disabled={true} label="Group" value="Savings" />
          <InputCurrencyField
            label="Savings target"
            name="targetSavings"
            control={control}
            disabled={true}
          />
        </Fieldset>
        <FormFooter>
          <SubmitButton disabled={submitIsDisabled}>Save</SubmitButton>
        </FormFooter>
      </Form>
    </Section>
  );
};

export default EditBudgetGroups;
