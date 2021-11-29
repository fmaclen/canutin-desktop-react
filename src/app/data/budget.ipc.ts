import { ipcRenderer } from 'electron';

import { DB_GET_BUDGETS, DB_EDIT_BUDGET_GROUPS } from '@constants/events';
import { EditBudgetSubmit } from '@app/components/Budget/EditBudgetGroups';

export default class BudgetIpc {
  static createBudget() {
    // TODO
  }

  static getBudgets() {
    ipcRenderer.send(DB_GET_BUDGETS);
  }

  static getBudgetById(budgetId: number) {
    // TODO
  }

  static deleteBudget() {
    // TODO
  }

  static editBudgetGroups(budgetGroups: EditBudgetSubmit) {
    // TODO
    ipcRenderer.send(DB_EDIT_BUDGET_GROUPS, budgetGroups)
  }
}
