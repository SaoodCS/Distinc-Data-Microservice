export type OptionalNumberInput = number | '';

export interface ISetSavingsAccountReqBody {
   accountName: string;
   targetToReach: OptionalNumberInput;
   currentBalance: OptionalNumberInput;
   isTracked: 'true' | 'false';
   id?: number;
}

export default class SetSavingsAccountReqBody {
   static isValid(body: unknown): body is ISetSavingsAccountReqBody {
      const { accountName, targetToReach, currentBalance, isTracked } =
         body as ISetSavingsAccountReqBody;
      return (
         typeof accountName === 'string' &&
         (typeof targetToReach === 'number' || targetToReach === '') &&
         (typeof currentBalance === 'number' || currentBalance === '') &&
         (isTracked === 'true' || isTracked === 'false')
      );
   }
}
