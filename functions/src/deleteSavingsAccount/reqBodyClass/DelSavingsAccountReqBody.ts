export interface IDelSavingsAccountReqBody {
   id: string;
}

export default class DelSavingsAccountReqBody {
   static isValid(body: unknown): body is IDelSavingsAccountReqBody {
      const reqBody = body as IDelSavingsAccountReqBody;
      return typeof reqBody.id === 'number';
   }
}
