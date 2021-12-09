import { CategoryRepository } from '@database/repositories/category.repository';
import { BudgetTypeEnum } from '@enums/budgetType.enum';
import { BudgetRepository } from '../repositories/budget.repository';

const seedBudget = async () => {
    await BudgetRepository.createBudget('Income', 7500, BudgetTypeEnum.INCOME, []);

    const entertainmentCategory = await CategoryRepository.getOrCreateSubCategory('Entertainment & recreation');
    const museumsCategory = await CategoryRepository.getOrCreateSubCategory('Museums');
    await BudgetRepository.createBudget('Wants', -2250, BudgetTypeEnum.EXPENSE, [entertainmentCategory, museumsCategory]);

    const musicCategory = await CategoryRepository.getOrCreateSubCategory('Music');
    const nightlifeCategory = await CategoryRepository.getOrCreateSubCategory('Nightlife');
    await BudgetRepository.createBudget('Needs', -3750, BudgetTypeEnum.EXPENSE, [musicCategory, nightlifeCategory]);
};

export default seedBudget;
