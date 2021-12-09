import { ipcRenderer } from 'electron';

import { DB_GET_BUDGETS, DB_EDIT_BUDGET_GROUPS, DB_EDIT_BUDGET_CATEGORY } from '@constants/events';
import { EditBudgetSubmit } from '@app/components/Budget/EditBudgetGroups';
import { EditBudgetCategorySubmit } from '@app/components/Budget/TransactionCategoriesForm';

export default class BudgetIpc {
  static getBudgets() {
    ipcRenderer.send(DB_GET_BUDGETS);
  }

  static editBudgetGroups(budgetGroups: EditBudgetSubmit) {
    ipcRenderer.send(DB_EDIT_BUDGET_GROUPS, budgetGroups);
  }

  static editBudgetCategory(budgetCategory: EditBudgetCategorySubmit) {
    ipcRenderer.send(DB_EDIT_BUDGET_CATEGORY, budgetCategory);
  }
}
