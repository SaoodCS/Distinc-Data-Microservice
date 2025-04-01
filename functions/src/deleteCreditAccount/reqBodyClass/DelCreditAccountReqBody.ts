export interface IDelCreditAccountReqBody {
   id: string;
}

export default class DelCreditAccountReqBody {
   static isValid(body: unknown): body is IDelCreditAccountReqBody {
      const reqBody = body as IDelCreditAccountReqBody;
      return typeof reqBody.id === 'number';
   }
}
