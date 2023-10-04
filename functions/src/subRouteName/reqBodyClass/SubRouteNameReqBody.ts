export interface ISubRouteNameReqBody {
   uid: string;
}

export default class SubRouteNameReqBody {
   static isValid(body: unknown): body is ISubRouteNameReqBody {
      return true;
   }
}
