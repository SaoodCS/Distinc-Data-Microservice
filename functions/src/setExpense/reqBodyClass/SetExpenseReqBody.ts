export interface ISetExpenseReqBody {
   expenseName: string;
   expenseValue: number;
   expenseType: string;
   paused: string;
   hasDistInstruction: string;
   id?: number;
}

export default class SetExpenseReqBody {
   static isValid(body: unknown): body is ISetExpenseReqBody {
      const { expenseName, expenseValue, expenseType, paused, hasDistInstruction } =
         body as ISetExpenseReqBody;
      return (
         typeof expenseName === 'string' &&
         typeof expenseValue === 'number' &&
         typeof expenseType === 'string' &&
         typeof paused === 'string' &&
         typeof hasDistInstruction === 'string'
      );
   }
}
