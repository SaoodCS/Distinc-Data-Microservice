export interface IDelSavingsAccountReqBody {
   id: number;
}

export default class DelSavingsAccountReqBody {
   static isValid(body: unknown): body is IDelSavingsAccountReqBody {
      const reqBody = body as IDelSavingsAccountReqBody;
      return typeof reqBody.id === 'number';
   }
}
