import { useEffect, useState } from 'react';
import { format } from 'date-fns';

import useBudgetInfo from '@app/hooks/useBudgetInfo';
import { Budget } from '@database/entities';

import ScrollView from '@app/components/common/ScrollView';
import EditBudgetGroups from '@app/components/Budget/EditBudgetGroups';
import TransactionCategories from '@app/components/Budget/TransactionCategories';

const EditBudget = () => {
  const {
    expenseBudgets,
    targetIncome,
    targetSavings,
    isLoading,
  } = useBudgetInfo(true);

  const [editBudgetSections, setEditBudgetSections] = useState([
    {
      label: 'Budgets groups',
      component: !isLoading && expenseBudgets?.length !== 0 ? (
        <EditBudgetGroups
          date={new Date()}
          expenseBudgets={expenseBudgets as Budget[]}
          targetIncome={targetIncome}
          targetSavings={targetSavings}
        />
      ) : null,
    },
    {
      label: 'Transaction categories',
      component: <TransactionCategories expenseBudgets={expenseBudgets} />,
    },
  ]);

  useEffect(() => {
    setEditBudgetSections([
      {
        label: 'Budgets groups',
        component: !isLoading && expenseBudgets?.length !== 0 ? (
          <EditBudgetGroups
            date={new Date()}
            expenseBudgets={expenseBudgets as Budget[]}
            targetIncome={targetIncome}
            targetSavings={targetSavings}
          />
        ) : null,
      },
      {
        label: 'Transaction categories',
        component: <TransactionCategories expenseBudgets={expenseBudgets} />,
      },
    ]);
  }, [JSON.stringify(expenseBudgets), isLoading]);

  return (
    <ScrollView
      title="Edit budget"
      subTitle={format(new Date(), 'MMMM yyyy')}
      sections={editBudgetSections}
    />
  );
};

export default EditBudget;
