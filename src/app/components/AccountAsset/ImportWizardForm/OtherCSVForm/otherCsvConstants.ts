import categoryList from '@database/seed/categories';

export const SUPPORTED_DATE_FORMAT = ['DD/MM/YYYY', 'MM/DD/YYYY'];

export const SUPPORTED_DATE_FORMAT_OPTIONS = SUPPORTED_DATE_FORMAT.map(dateFormat => ({
  label: dateFormat,
  value: dateFormat,
}));

export const CATEGORY_GROUPED_OPTIONS = categoryList.categories.map(({ name, subcategories }) => {
  const subCategoriesOptions = subcategories.map(({ name: subCategoryName }) => ({
    value: subCategoryName,
    label: subCategoryName,
  }));

  return { label: name, options: subCategoriesOptions };
});

export const NEW_ACCOUNT_VALUE = 'newAccount';
export const NEW_ACCOUNT_OPTION = { label: 'New account', value: NEW_ACCOUNT_VALUE };
