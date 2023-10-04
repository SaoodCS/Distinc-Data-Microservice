import type { FirebaseError } from 'firebase-admin';
import ErrorThrower from '../../interface/ErrorThrower';
import type IObjWithErrProp from '../../interface/IObjWithErrProp';

export default class ErrorChecker {
   static isNodemailerError(error: unknown): error is Error {
      if (error instanceof Error) {
         return true;
      }
      return false;
   }

   static isFirebaseError(error: unknown): error is FirebaseError {
      const errorContainsCodeProp = (error as FirebaseError).code !== undefined;
      const errorContainsMessageProp = (error as FirebaseError).message !== undefined;
      if (errorContainsCodeProp && errorContainsMessageProp) {
         return true;
      }
      return false;
   }

   static isErrorThrower(error: unknown): error is ErrorThrower {
      return error instanceof ErrorThrower;
   }

   static hasErrorProp(result: unknown): result is IObjWithErrProp {
      const resultContainsErrorProp = (result as { error: string }).error !== undefined;
      const resultContainsOtherProps = Object.keys(result as object).length > 1;

      if (resultContainsErrorProp && !resultContainsOtherProps) {
         return true;
      }
      return false;
   }
}
