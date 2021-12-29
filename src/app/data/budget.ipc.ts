import { ipcRenderer } from 'electron';

import {
  DB_GET_BUDGETS,
  DB_EDIT_BUDGET_GROUPS,
  DB_EDIT_BUDGET_CATEGORY,
  DB_REMOVE_BUDGET_CATEGORY,
} from '@constants/events';
import { EditBudgetCategorySubmit } from '@app/components/Budget/TransactionCategoriesForm';
import { EditBudgetType } from '@app/components/Budget/EditBudgetGroups';

export default class BudgetIpc {
  static getBudgets() {
    ipcRenderer.send(DB_GET_BUDGETS);
  }

  static editBudgetGroups(budgetGroups: EditBudgetType) {
    ipcRenderer.send(DB_EDIT_BUDGET_GROUPS, budgetGroups);
  }

  static editBudgetCategory(budgetCategory: EditBudgetCategorySubmit) {
    ipcRenderer.send(DB_EDIT_BUDGET_CATEGORY, budgetCategory);
  }

  static removeBudgetCategory(budgetCategory: EditBudgetCategorySubmit) {
    ipcRenderer.send(DB_REMOVE_BUDGET_CATEGORY, budgetCategory);
  }
}
