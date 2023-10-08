export interface IDelCurrentAccountReqBody {
   id: string;
}

export default class DelCurrentAccountReqBody {
   static isValid(body: unknown): body is IDelCurrentAccountReqBody {
      const reqBody = body as IDelCurrentAccountReqBody;
      return typeof reqBody.id === 'number';
   }
}
