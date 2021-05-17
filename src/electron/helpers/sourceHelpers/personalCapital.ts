import { format, parse } from 'date-fns';

import { CanutinJsonType } from '@appTypes/canutin';
import { BalanceGroupEnum } from '@enums/balancegGroup.enum';
import mapCategories from '@database/helpers/importResources/mapCategories';

export interface PersonalCapitalCsvEntryType {
  Date: string;
  Description: string;
  Amount: number;
  Category: keyof typeof mapCategories;
  Account: string;
  Tags: string;
}

export const personalCapitalCsvToJson = (personalCapitalCsv: PersonalCapitalCsvEntryType[]) => {
  let countAccounts = 0;
  const finalJson = personalCapitalCsv.reduce<CanutinJsonType>(
    (acc, personalCapEntry) => {
      const accountIndex = acc.accounts.findIndex(
        account => account.name === personalCapEntry.Account
      );

      if (!personalCapEntry.Amount) {
        throw Error('Not supported');
      }

      const transaction = {
        description: personalCapEntry.Description,
        date: format(parse(personalCapEntry.Date, 'yyyy-dd-MM', new Date()), 'MM/dd/yyyy'),
        amount: personalCapEntry.Amount,
        excludeFromTotals: false,
        category: mapCategories(personalCapEntry.Category),
      };

      if (accountIndex > -1) {
        acc.accounts[accountIndex].transactions.push(transaction);
      } else {
        countAccounts++;
        if (!personalCapEntry.Account) {
          throw Error('Not supported');
        }

        acc.accounts.push({
          name: personalCapEntry.Account,
          balanceGroup: BalanceGroupEnum.CASH,
          accountType: 'checking',
          transactions: [transaction],
        });
      }

      return acc;
    },
    { accounts: [] }
  );

  return { data: finalJson, metadata: { countAccounts } };
};
