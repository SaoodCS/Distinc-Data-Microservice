export interface ISetCreditAccountReqBody {
   accountName: string;
   payBalanceFrom: number;
   id?: number;
}

export default class SetCreditAccountReqBody {
   static isValid(body: unknown): body is ISetCreditAccountReqBody {
      const { accountName, payBalanceFrom } = body as ISetCreditAccountReqBody;
      return typeof accountName === 'string' && typeof payBalanceFrom === 'number';
   }
}
