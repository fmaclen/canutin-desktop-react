import { format } from 'date-fns';

import useBudget from '@app/hooks/useBudget';

import ScrollView from '@app/components/common/ScrollView';
import EditBudgetGroups from '@app/components/Budget/EditBudgetGroups';

const EditBudget = () => {
  const { isLoading } = useBudget();

  const editBudgetSections = [
    {
      label: 'Budgets groups',
      component: !isLoading ? <EditBudgetGroups /> : null,
    },
    {
      label: 'Transaction categories',
      component: <p>Transactions Categories go here</p>,
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
