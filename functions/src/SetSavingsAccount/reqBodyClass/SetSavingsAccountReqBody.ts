export type OptionalNumberInput = number | '';

export interface ISetSavingsAccountReqBody {
   accountName: string;
   notes: string;
   targetToReach: OptionalNumberInput;
   currentBalance: OptionalNumberInput;
   isTracked: 'true' | 'false';
   coversShortfall: 'true' | 'false';
   id?: number;
}

export default class SetSavingsAccountReqBody {
   static isValid(body: unknown): body is ISetSavingsAccountReqBody {
      const { accountName, targetToReach, currentBalance, isTracked, coversShortfall, notes } =
         body as ISetSavingsAccountReqBody;
      return (
         typeof accountName === 'string' &&
         typeof notes === 'string' &&
         (typeof targetToReach === 'number' || targetToReach === '') &&
         (typeof currentBalance === 'number' || currentBalance === '') &&
         (isTracked === 'true' || isTracked === 'false') &&
         (coversShortfall === 'true' || coversShortfall === 'false')
      );
   }
}
