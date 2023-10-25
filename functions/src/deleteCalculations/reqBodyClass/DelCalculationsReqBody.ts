export interface IDelCalculationsReqBody {
   timestamp: string;
}

export default class DelCalculationsReqBody {
   static isValid(body: unknown): body is IDelCalculationsReqBody {
      const reqBody = body as IDelCalculationsReqBody;
      if (!reqBody.timestamp && typeof reqBody.timestamp !== 'string') {
         return false;
      }
      return true;
   }
}
