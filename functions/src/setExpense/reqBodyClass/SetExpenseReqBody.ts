export interface ISetExpenseReqBody {
   expenseName: string;
   notes: string;
   expenseValue: number;
   expenseType: string;
   frequency: string;
   paused: string;
   hasDistInstruction: string;
   paymentMethod: string;
   id?: number;
}

export default class SetExpenseReqBody {
   static isValid(body: unknown): body is ISetExpenseReqBody {
      const {
         expenseName,
         notes,
         expenseValue,
         expenseType,
         frequency,
         paused,
         hasDistInstruction,
         paymentMethod,
      } = body as ISetExpenseReqBody;
      return (
         typeof expenseName === 'string' &&
         typeof expenseValue === 'number' &&
         typeof expenseType === 'string' &&
         typeof frequency === 'string' &&
         typeof paymentMethod === 'string' &&
         typeof paused === 'string' &&
         typeof hasDistInstruction === 'string' &&
         typeof notes === 'string'
      );
   }
}
