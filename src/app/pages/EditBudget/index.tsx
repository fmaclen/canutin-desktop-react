import { format } from 'date-fns';

import useBudget from '@app/hooks/useBudget';

import ScrollView from '@app/components/common/ScrollView';
import EditBudgetGroups from '@app/components/Budget/EditBudgetGroups';
import TransactionCategories from '@app/components/Budget/TransactionCategories';

const EditBudget = () => {
  const { isLoading, budgetExpenseGroups } = useBudget();

  const editBudgetSections = [
    {
      label: 'Budgets groups',
      component: !isLoading ? <EditBudgetGroups /> : null,
    },
    {
      label: 'Transaction categories',
      component: <TransactionCategories expenseBudgets={budgetExpenseGroups} />,
    },
  ];

  return (
    <ScrollView
      title="Edit budget"
      subTitle={format(new Date(), 'MMMM yyyy')}
      sections={editBudgetSections}
    />
  );
};

export default EditBudget;
