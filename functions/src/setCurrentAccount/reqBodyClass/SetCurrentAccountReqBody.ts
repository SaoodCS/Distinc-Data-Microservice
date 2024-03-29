import type { OptionalNumberInput } from '../../SetSavingsAccount/reqBodyClass/SetSavingsAccountReqBody';

export interface ISetCurrentAccountReqBody {
   accountName: string;
   minCushion: number | '';
   accountType: string;
   transferLeftoversTo: OptionalNumberInput;
   id?: number;
}

export default class SetCurrentAccountReqBody {
   static isValid(body: unknown): body is ISetCurrentAccountReqBody {
      const { accountName, minCushion, accountType, transferLeftoversTo } =
         body as ISetCurrentAccountReqBody;
      const isValidSalaryExpAccount =
         typeof accountName === 'string' &&
         typeof minCushion === 'number' &&
         typeof accountType === 'string' &&
         (transferLeftoversTo === '' || typeof transferLeftoversTo === 'number');

      const validSpendingAccount =
         typeof accountName === 'string' &&
         (minCushion === '' || minCushion === 0) &&
         typeof accountType === 'string' &&
         (transferLeftoversTo === '' || typeof transferLeftoversTo === 'number');

      if (accountType === 'Salary & Expenses') return isValidSalaryExpAccount;
      if (accountType === 'Spending') return validSpendingAccount;

      return false;
   }
}
