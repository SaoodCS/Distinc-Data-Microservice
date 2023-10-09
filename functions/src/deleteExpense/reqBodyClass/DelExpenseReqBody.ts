export interface IDelExpenseReqBody {
   id: string;
}

export default class DelExpenseReqBody {
   static isValid(body: unknown): body is IDelExpenseReqBody {
      const reqBody = body as IDelExpenseReqBody;
      return typeof reqBody.id === 'number';
   }
}
