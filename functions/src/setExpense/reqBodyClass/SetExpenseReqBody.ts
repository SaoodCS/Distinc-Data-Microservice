export interface ISetExpenseReqBody {
   expenseName: string;
   expenseValue: number;
   expenseType: string;
   paused: string;
   paymentType: string;
   id?: string;
}

export default class SetExpenseReqBody {
   static isValid(body: unknown): body is ISetExpenseReqBody {
      const { expenseName, expenseValue, expenseType, paused, paymentType } =
         body as ISetExpenseReqBody;
      return (
         typeof expenseName === 'string' &&
         typeof expenseValue === 'number' &&
         typeof expenseType === 'string' &&
         typeof paused === 'string' &&
         typeof paymentType === 'string'
      );
   }
}
