export interface ISetIncomeReqBody {
   incomeName: string;
   notes: string;
   id?: number;
}

export default class SetIncomeReqBody {
   static isValid(body: unknown): body is ISetIncomeReqBody {
      const { incomeName, notes } = body as ISetIncomeReqBody;
      return typeof incomeName === 'string' && typeof notes === 'string';
   }
}
