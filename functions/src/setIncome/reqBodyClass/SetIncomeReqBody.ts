export interface ISetIncomeReqBody {
   incomeName: string;
   incomeValue: number;
   id?: number;
}

export default class SetIncomeReqBody {
   static isValid(body: unknown): body is ISetIncomeReqBody {
      const { incomeName, incomeValue } = body as ISetIncomeReqBody;
      return typeof incomeName === 'string' && typeof incomeValue === 'number';
   }
}
