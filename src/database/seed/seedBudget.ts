import { CategoryRepository } from '@database/repositories/category.repository';
import { BudgetTypeEnum } from '@enums/budgetType.enum';
import { BudgetRepository } from '../repositories/budget.repository';

const seedBudget = async () => {
    const entertainmentCategory = await CategoryRepository.getOrCreateSubCategory('Entertainment & recreation');
    const museumsCategory = await CategoryRepository.getOrCreateSubCategory('Museums');
    await BudgetRepository.createBudget('Wants', 0, BudgetTypeEnum.EXPANSE, [entertainmentCategory, museumsCategory]);

    const musicCategory = await CategoryRepository.getOrCreateSubCategory('Music');
    const nightlifeCategory = await CategoryRepository.getOrCreateSubCategory('Nightlife');
    await BudgetRepository.createBudget('Needs', 0, BudgetTypeEnum.EXPANSE, [musicCategory, nightlifeCategory]);
};

export default seedBudget;
