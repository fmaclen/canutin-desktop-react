import { useEffect, useState } from 'react';
import { format } from 'date-fns';

import useBudgetInfo from '@app/hooks/useBudgetInfo';
import { Budget } from '@database/entities';

import ScrollView from '@app/components/common/ScrollView';
import EditBudgetGroups from '@app/components/Budget/EditBudgetGroups';

const EditBudget = () => {
  const {
    budgetFilterOption,
    expenseBudgets,
    targetIncome,
    targetSavings,
    isLoading,
  } = useBudgetInfo();

  const [editBudgetSections, setEditBudgetSections] = useState([
    {
      label: 'Budgets groups',
      component: !isLoading && expenseBudgets?.length !== 0 ? (
        <EditBudgetGroups
          date={budgetFilterOption?.value?.dateFrom}
          expenseBudgets={expenseBudgets as Budget[]}
          targetIncome={targetIncome}
          targetSavings={targetSavings}
        />
      ) : null,
    },
    {
      label: 'Transaction categories',
      component: <div />,
    },
  ]);

  useEffect(() => {
    console.log(expenseBudgets);
    setEditBudgetSections([
      {
        label: 'Budgets groups',
        component: !isLoading && expenseBudgets?.length !== 0 ? (
          <EditBudgetGroups
            date={budgetFilterOption?.value?.dateFrom}
            expenseBudgets={expenseBudgets as Budget[]}
            targetIncome={targetIncome}
            targetSavings={targetSavings}
          />
        ) : null,
      },
      {
        label: 'Transaction categories',
        component: <div />,
      },
    ]);
  }, [JSON.stringify(expenseBudgets), isLoading]);

  return (
    <ScrollView
      title="Edit budget"
      subTitle={format(budgetFilterOption?.value?.dateFrom, 'MMMM yyyy')}
      sections={editBudgetSections}
    ></ScrollView>
  );
};

export default EditBudget;
