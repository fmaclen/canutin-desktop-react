import { useContext, useEffect, useState } from 'react';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { useHistory } from 'react-router';
import { Control, RegisterOptions, useForm } from 'react-hook-form';
import styled from 'styled-components';

import { EntitiesContext } from '@app/context/entitiesContext';
import { DB_EDIT_BUDGET_GROUPS_ACK } from '@constants/events';
import { EVENT_ERROR, EVENT_SUCCESS } from '@constants/eventStatus';
import { StatusBarContext } from '@app/context/statusBarContext';
import { StatusEnum } from '@app/constants/misc';
import useBudget from '@app/hooks/useBudget';
import BudgetIpc from '@app/data/budget.ipc';

import Section from '@app/components/common/Section';
import Form from '@app/components/common/Form/Form';
import Fieldset from '@app/components/common/Form/Fieldset';
import Field from '@app/components/common/Form/Field';
import InputText from '@app/components/common/Form/InputText';
import InputCurrency from '@app/components/common/Form/InputCurrency';
import FormFooter from '@app/components/common/Form/FormFooter';
import SubmitButton from '@app/components/common/Form/SubmitButton';
import RadioGroupField from '@app/components/common/Form/RadioGroupField';
import Button from '@app/components/common/Button';
import PercentageField from '@app/components/common/Form/PercentageField';
import { BudgetTypeEnum } from '@enums/budgetType.enum';
import { proportionBetween } from '@app/utils/balance.utils';
import { percentageFieldContainer, buttonFieldContainer, buttonFieldset } from './styles';
import { TransactionSubCategory } from '@database/entities';

const PercentageFieldContainer = styled.div`
  ${percentageFieldContainer}
`;
const ButtonFieldContainer = styled.div`
  ${buttonFieldContainer}
`;
const ButtonFieldset = styled.div`
  ${buttonFieldset}
`;

export type EditBudgetType = {
  autoBudgetField: 'Enabled' | 'Disabled';
  editedBudgets?: {
    name: string;
    targetAmount: number;
    type: BudgetTypeEnum;
    categories?: TransactionSubCategory[];
  }[];
};

type EditBudgetGroupSubmit = {
  autoBudgetField: 'Enabled' | 'Disabled';
  targetIncomeField: string;
  expenseGroupFields: [
    { targetAmount: number; name: string; id: number; categories?: TransactionSubCategory[] }
  ];
  newExpenseGroupFields: [{ targetAmount: number; name: string }];
  autoBudgetExpenseGroupFields: [{ targetAmount: number; name: string }];
};

const EditBudgetGroups = () => {
  const history = useHistory();
  const { setStatusMessage } = useContext(StatusBarContext);
  const { budgetsIndex } = useContext(EntitiesContext);
  const { targetIncomeAmount, targetSavingsAmount, budgetExpenseGroups, autoBudget } = useBudget();
  const [removeGroupIds, setRemoveGroupIds] = useState<number[]>([]);
  const [newExpenseGroups, setNewExpenseGroups] = useState<
    { name: string; targetAmount: number }[]
  >([]);

  const autoBudgetTargetIncome = budgetsIndex?.autoBudgets[0]?.targetAmount;
  const autoBudgetExpenseGroups = budgetsIndex?.autoBudgets.filter(
    ({ type }) => type === BudgetTypeEnum.EXPENSE
  );

  const { handleSubmit, register, watch, setValue, control, formState } = useForm({
    mode: 'onChange',
    defaultValues: {
      autoBudgetField: autoBudget ? 'Enabled' : 'Disabled',
      targetIncomeField: targetIncomeAmount,
      targetSavingsField: targetSavingsAmount,
      expenseGroupFields: budgetExpenseGroups.reduce(
        (accGroup, expenseGroup) => ({
          ...accGroup,
          [expenseGroup.id]: {
            id: expenseGroup.id,
            targetAmount: expenseGroup.targetAmount,
            name: expenseGroup.name,
            categories: expenseGroup.categories,
            categoriesCount: expenseGroup.categories.length,
          },
        }),
        {}
      ) as {
        [id: string]: {
          id: number;
          name?: string;
          targetAmount: number;
          categories?: TransactionSubCategory[];
          categoriesCount: number;
        };
      },
      newExpenseGroupFields: [] as { [id: string]: { name: string; targetAmount: number } }[],
    },
  });

  const {
    autoBudgetField,
    targetIncomeField,
    targetSavingsField,
    expenseGroupFields,
    newExpenseGroupFields,
  } = watch();
  const isAutoBudget = autoBudgetField === 'Enabled';
  const submitIsDisabled =
    targetSavingsField < 0 || !formState.isValid || (autoBudget && isAutoBudget);

  const getPercentageOfTargetIncome = (fieldTargetAmount: number) => {
    return Math.round(proportionBetween(fieldTargetAmount, targetIncomeField));
  };

  useEffect(() => {
    let totalTargetsExpenses = expenseGroupFields
      ? Object.keys(expenseGroupFields).reduce(
          (acc, key) =>
            expenseGroupFields[parseInt(key)].targetAmount
              ? acc + Number(expenseGroupFields[parseInt(key)].targetAmount)
              : acc,
          0
        )
      : 0;
    totalTargetsExpenses += newExpenseGroupFields
      ? Object.keys(newExpenseGroupFields).reduce(
          (acc, key) =>
            newExpenseGroupFields[parseInt(key)].targetAmount
              ? acc + Number(newExpenseGroupFields[parseInt(key)].targetAmount)
              : acc,
          0
        )
      : 0;
    setValue('targetSavingsField', Number(targetIncomeField) + totalTargetsExpenses);
  }, [
    targetIncomeField,
    isAutoBudget,
    JSON.stringify(expenseGroupFields),
    JSON.stringify(newExpenseGroupFields),
  ]);

  useEffect(() => {
    ipcRenderer.on(DB_EDIT_BUDGET_GROUPS_ACK, (_: IpcRendererEvent, { status, message }) => {
      switch (status) {
        case EVENT_SUCCESS:
          setStatusMessage({
            message: 'Budget edited successfully',
            sentiment: StatusEnum.POSITIVE,
            isLoading: false,
          });
          history.push('/budget');
          break;
        case EVENT_ERROR:
          setStatusMessage({ message, sentiment: StatusEnum.NEGATIVE, isLoading: false });
          break;
      }
    });
  }, []);

  const onRemove = (id: number) => {
    setRemoveGroupIds(prev => [...prev, id]);
  };

  const onSubmit = (EditBudgetType: EditBudgetGroupSubmit) => {
    const {
      autoBudgetField,
      targetIncomeField,
      expenseGroupFields,
      newExpenseGroupFields,
    } = EditBudgetType;

    const editedBudgets = [];
    if (autoBudgetField === 'Disabled') {
      editedBudgets.push({
        name: 'Income',
        targetAmount: parseInt(targetIncomeField),
        type: BudgetTypeEnum.INCOME,
      });

      expenseGroupFields &&
        expenseGroupFields.forEach(expenseGroup => {
          editedBudgets.push({
            name: expenseGroup.name,
            targetAmount: expenseGroup.targetAmount,
            type: BudgetTypeEnum.EXPENSE,
            categories: expenseGroup.categories ? expenseGroup.categories : [],
          });
        });

      newExpenseGroupFields &&
        newExpenseGroupFields.forEach(expenseGroup => {
          editedBudgets.push({
            name: expenseGroup.name,
            targetAmount: expenseGroup.targetAmount,
            type: BudgetTypeEnum.EXPENSE,
          });
        });
    }

    BudgetIpc.editBudgetGroups({ autoBudgetField, editedBudgets });
  };

  return (
    <Section title="Budget groups">
      <Form onSubmit={handleSubmit(onSubmit)} role="form">
        <Fieldset>
          <RadioGroupField
            label="Auto-budget"
            name="autoBudgetField"
            register={register}
            values={['Enabled', 'Disabled']}
          />
        </Fieldset>

        {!isAutoBudget && (
          <>
            <Fieldset>
              <Field label="Target income" name="targetIncomeField">
                <PercentageFieldContainer>
                  <InputCurrency name="targetIncomeField" control={control} />
                  <PercentageField percentage={100} />
                </PercentageFieldContainer>
              </Field>
            </Fieldset>

            {budgetExpenseGroups.map(expenseGroup =>
              !removeGroupIds.includes(expenseGroup.id) ? (
                <Fieldset key={expenseGroup.id}>
                  <input {...register(`expenseGroupFields.${expenseGroup.id}.id`)} type="hidden" />
                  <Field
                    label="Expense group name"
                    name={`expenseGroupFields.${expenseGroup.id}.name`}
                  >
                    <ButtonFieldContainer>
                      <InputText
                        name={`expenseGroupFields.${expenseGroup.id}.name`}
                        register={register}
                      />
                      <Button disabled={isAutoBudget} onClick={() => onRemove(expenseGroup.id)}>
                        Remove
                      </Button>
                    </ButtonFieldContainer>
                  </Field>
                  <Field
                    label="Target amount"
                    name={`expenseGroupFields.${expenseGroup.id}.targetAmount`}
                  >
                    <PercentageFieldContainer>
                      <InputCurrency
                        name={`expenseGroupFields.${expenseGroup.id}.targetAmount`}
                        control={control}
                        onlyNegative
                      />
                      <PercentageField
                        percentage={
                          expenseGroupFields?.[expenseGroup.id]
                            ? Math.abs(
                                getPercentageOfTargetIncome(
                                  expenseGroupFields?.[expenseGroup.id].targetAmount
                                )
                              )
                            : 0
                        }
                      />
                    </PercentageFieldContainer>
                  </Field>
                  <Field
                    label="Categories"
                    name={`expenseGroupFields.${expenseGroup.id}.categoriesCount`}
                  >
                    <input
                      {...register(`expenseGroupFields.${expenseGroup.id}.categories`)}
                      type="hidden"
                    />
                    <InputText
                      name={`expenseGroupFields.${expenseGroup.id}.categoriesCount`}
                      value={expenseGroup.categories.length.toString()}
                      disabled
                      readOnly
                    />
                  </Field>
                </Fieldset>
              ) : null
            )}

            {!isAutoBudget &&
              newExpenseGroups.map((_, index) => {
                const indexOffset = index + 100;
                if (!removeGroupIds.includes(indexOffset)) {
                  return (
                    <Fieldset key={indexOffset}>
                      <Field
                        label="Expense group name"
                        name={`newExpenseGroupFields.${indexOffset}.name`}
                      >
                        <ButtonFieldContainer>
                          <InputText
                            name={`newExpenseGroupFields.${indexOffset}.name`}
                            register={register}
                          />
                          <Button disabled={isAutoBudget} onClick={() => onRemove(indexOffset)}>
                            Remove
                          </Button>
                        </ButtonFieldContainer>
                      </Field>
                      <Field
                        label="Target amount"
                        name={`newExpenseGroupFields.${indexOffset}.targetAmount`}
                      >
                        <PercentageFieldContainer>
                          <InputCurrency
                            name={`newExpenseGroupFields.${indexOffset}.targetAmount`}
                            control={control}
                            onlyNegative
                          />
                          <PercentageField
                            percentage={Math.abs(
                              newExpenseGroupFields?.[indexOffset]
                                ? getPercentageOfTargetIncome(
                                    Number(newExpenseGroupFields?.[indexOffset].targetAmount)
                                  )
                                : 0
                            )}
                          />
                        </PercentageFieldContainer>
                      </Field>
                      <Field
                        label="Categories"
                        name={`newExpenseGroupFields.${indexOffset}.categoriesCount`}
                      >
                        <InputText
                          name={`newExpenseGroupFields.${indexOffset}.categoriesCount`}
                          value="0"
                          disabled
                          readOnly
                        />
                      </Field>
                    </Fieldset>
                  );
                }
                return null;
              })}

            {!isAutoBudget && (
              <Fieldset>
                <Field name="addGroup" label="Expense group">
                  <ButtonFieldset>
                    <Button
                      disabled={isAutoBudget}
                      onClick={() => {
                        setNewExpenseGroups(prev => [...prev, { name: '', targetAmount: 0 }]);
                      }}
                    >
                      Add new
                    </Button>
                  </ButtonFieldset>
                </Field>
              </Fieldset>
            )}

            <Fieldset>
              <Field label="Target savings" name="targetSavingsField">
                <PercentageFieldContainer>
                  <InputCurrency name="targetSavingsField" control={control} disabled={true} />
                  <PercentageField percentage={getPercentageOfTargetIncome(targetSavingsField)} />
                </PercentageFieldContainer>
              </Field>
            </Fieldset>
          </>
        )}

        {isAutoBudget && (
          <>
            <Fieldset>
              <Field label="Target income" name="targetIncomeField">
                <PercentageFieldContainer>
                  <InputCurrency
                    name="targetIncomeField"
                    control={control}
                    value={autoBudgetTargetIncome}
                    readOnly={true}
                    disabled={true}
                  />
                  <PercentageField percentage={100} />
                </PercentageFieldContainer>
              </Field>
            </Fieldset>

            {autoBudgetExpenseGroups?.map(expenseGroup => (
              <Fieldset key={expenseGroup.id}>
                <Field
                  label="Expense group name"
                  name={`autoBudgetExpenseGroupFields.${expenseGroup.id}.name`}
                >
                  <InputText
                    name={`autoBudgetExpenseGroupFields.${expenseGroup.id}.name`}
                    value={expenseGroup.name.toString()}
                    readOnly={true}
                    disabled={true}
                    register={register}
                  />
                </Field>
                <Field
                  label="Target amount"
                  name={`autoBudgetExpenseGroupFields.${expenseGroup.id}.targetAmount`}
                >
                  <PercentageFieldContainer>
                    <InputCurrency
                      name={`autoBudgetExpenseGroupFields.${expenseGroup.id}.targetAmount`}
                      value={expenseGroup.targetAmount}
                      readOnly={true}
                      disabled={true}
                      control={control}
                      onlyNegative
                    />
                    <PercentageField
                      percentage={Math.abs(getPercentageOfTargetIncome(expenseGroup.targetAmount))}
                    />
                  </PercentageFieldContainer>
                </Field>
                <Field
                  label="Categories"
                  name={`autoBudgetExpenseGroupFields.${expenseGroup.id}.categoriesCount`}
                >
                  <InputText
                    name={`autoBudgetExpenseGroupFields.${expenseGroup.id}.categoriesCount`}
                    value={expenseGroup.categories.length.toString()}
                    disabled
                    readOnly
                  />
                </Field>
              </Fieldset>
            ))}
            <Fieldset>
              <Field label="Target savings" name="targetSavingsField">
                <PercentageFieldContainer>
                  <InputCurrency
                    name="targetSavingsField"
                    control={control}
                    readOnly={true}
                    disabled={true}
                    value={targetSavingsAmount}
                  />
                  <PercentageField percentage={getPercentageOfTargetIncome(targetSavingsAmount)} />
                </PercentageFieldContainer>
              </Field>
            </Fieldset>
          </>
        )}
        <FormFooter>
          <SubmitButton disabled={submitIsDisabled}>Save</SubmitButton>
        </FormFooter>
      </Form>
    </Section>
  );
};

export default EditBudgetGroups;
