import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import styled from 'styled-components';
import { useHistory } from 'react-router';
import { ipcRenderer, IpcRendererEvent } from 'electron';

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
import InputCurrency from '@app/components/common/Form/InputCurrency';
import Field from '@app/components/common/Form/Field';

import InputText from '@app/components/common/Form/InputText';
import { DB_EDIT_BUDGET_GROUPS_ACK } from '@constants/events';
import { EVENT_ERROR, EVENT_SUCCESS } from '@constants/eventStatus';
import { StatusBarContext } from '@app/context/statusBarContext';
import { StatusEnum } from '@app/constants/misc';

import { buttonFieldContainer, buttonFieldset } from './styles';

const ButtonFieldContainer = styled.div`
  ${buttonFieldContainer}
`;

const ButtonFieldset = styled.div`
  ${buttonFieldset}
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
  addExpenseGroups?: { name: string; targetAmount: number }[];
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
  const history = useHistory();
  const { setStatusMessage } = useContext(StatusBarContext);
  const [addExpenseGroups, setAddExpenseGroups] = useState<
    { name: string; targetAmount: number }[]
  >([]);
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
      expense: [],
    },
  });
  const { autoBudget, group, targetIncome: targetIncomeForm, expense, targetSavings: savings } = watch();
  const isAutoBudget = autoBudget === 'Enable';

  useEffect(() => {
    ipcRenderer.on(DB_EDIT_BUDGET_GROUPS_ACK, (_: IpcRendererEvent, { status, message }) => {
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
    setAddExpenseGroups([]);
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
    let totalTargetsExpenses = group
      ? Object.keys(group).reduce(
          (acc, key) => (group[key].targetAmount ? acc + Number(group[key].targetAmount) : acc),
          0
        )
      : 0;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    totalTargetsExpenses += expense ? Object.keys(expense).reduce((acc, key) => expense?.[key]?.targetAmount ? acc + Number(expense[key].targetAmount) : acc, 0) : 0;
    setValue('targetSavings', Number(targetIncomeForm) + totalTargetsExpenses);
  }, [targetIncomeForm, JSON.stringify(group), isAutoBudget, JSON.stringify(expense)]);

  useEffect(() => {
    setValue('targetSavings', targetSavings);
  }, [targetSavings]);

  
  const submitIsDisabled = savings < 0 || !formState.isValid;
  
  const onSubmit = (editBudgetSubmit: EditBudgetSubmit) => {
    BudgetIpc.editBudgetGroups({ ...editBudgetSubmit, removeGroupIds, addExpenseGroups: expense });
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
            rules={{ required: true }}
            required
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
                      required
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
                    rules={{ required: true }}
                  />
                </Field>
              </Fieldset>
            ) : null
        )}
        {!isAutoBudget &&
          addExpenseGroups.map((_, index) => (
            <Fieldset key={index}>
              <Field name="expense" label="Expense group">
                <ButtonFieldContainer>
                  <InputText
                    name={`expense.${index}.name`}
                    disabled={isAutoBudget}
                    register={register}
                    placeholder="My budget"
                    required
                  />
                  <Button
                    onClick={() => {
                      setAddExpenseGroups(prev => {
                        const newPrev = [...prev];
                        newPrev.splice(index, 1);
                        return newPrev;
                      });
                    }}
                    disabled={isAutoBudget}
                  >
                    Remove
                  </Button>
                </ButtonFieldContainer>
              </Field>
              <Field label="Target" name="expense">
                <InputCurrency
                  name={`expense.${index}.targetAmount`}
                  control={control}
                  onlyNegative
                  rules={{ required: true }}
                  disabled={isAutoBudget}
                />
              </Field>
            </Fieldset>
          ))}
        {!isAutoBudget && (
          <Fieldset>
            <Field name="addGroup" label="Expense group">
              <ButtonFieldset>
                <Button
                  onClick={() => {
                    setAddExpenseGroups(prev => [...prev, { name: '', targetAmount: 0 }]);
                  }}
                  disabled={isAutoBudget}
                >
                  Add new
                </Button>
              </ButtonFieldset>
            </Field>
          </Fieldset>
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
