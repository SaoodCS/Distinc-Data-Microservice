export interface ISetIncomeReqBody {
   incomeName: string;
   id?: number;
}

export default class SetIncomeReqBody {
   static isValid(body: unknown): body is ISetIncomeReqBody {
      const { incomeName } = body as ISetIncomeReqBody;
      return typeof incomeName === 'string';
   }
}
