export interface IDelIncomeReqBody {
   id: number;
}

export default class DelIncomeReqBody {
   static isValid(body: unknown): body is IDelIncomeReqBody {
      const reqBody = body as IDelIncomeReqBody;
      return typeof reqBody.id === 'number';
   }
}
