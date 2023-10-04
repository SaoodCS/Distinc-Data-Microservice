import type * as express from 'express';
import type { FirebaseError } from 'firebase-admin';
import type ErrorThrower from '../../interface/ErrorThrower';
import type IObjWithErrProp from '../../interface/IObjWithErrProp';
import { resCodes } from '../../utils/resCode';
import ObjectOfObjects from '../dataTypes/objectOfObjects/objectOfObjects';
import ErrorChecker from '../errorCheckers/ErrorChecker';

export default class ErrorHandler {
   static handleNodemailerError(error: Error): string {
      if (error.message.includes('Invalid login')) {
         return 'Nodemailer: Invalid login credentials';
      }
      if (error.message.includes('Invalid email address')) {
         return 'Nodemailer: Invalid email address';
      }
      if (error.message.includes('Invalid password')) {
         return 'Nodemailer: Invalid password';
      }
      return error.message;
   }

   static handleFirebaseError(
      error: FirebaseError,
      res: express.Response<IObjWithErrProp>,
   ): express.Response {
      let constructedMsg: string;
      const firebaseErrorCodeToMessage: Record<string, string> = {
         'auth/email-already-exists': 'Email already exists',
         'auth/invalid-email': 'Invalid email',
         'auth/invalid-password': 'Invalid password',
         'auth/id-token-expired': 'Token expired',
         'auth/user-not-found': 'User not found',
         'auth/wrong-password': 'Wrong password',
         'auth/invalid-verification-code': 'Invalid verification code',
         'auth/invalid-verification-id': 'Invalid verification ID',
         'auth/missing-verification-code': 'Missing verification code',
         'auth/missing-verification-id': 'Missing verification ID',
         'auth/invalid-credential': 'Invalid credential',
      };
      if (error.code in firebaseErrorCodeToMessage) {
         constructedMsg = firebaseErrorCodeToMessage[error.code];
      } else {
         constructedMsg = error.message;
      }
      return res.status(resCodes.BAD_REQUEST.code).send({ error: constructedMsg });
   }

   static handleErrorThrower(
      error: ErrorThrower,
      res: express.Response<IObjWithErrProp>,
   ): express.Response {
      const foundCode = ObjectOfObjects.findObjectByKeyValue(resCodes, 'code', error.resCode);

      if (ErrorChecker.hasErrorProp(foundCode)) {
         return res
            .status(resCodes.INTERNAL_SERVER.code)
            .send({ error: `${resCodes.INTERNAL_SERVER.prefix}: Invalid resCode Thrown` });
      }
      return res
         .status(error.resCode)
         .send({ error: `${(foundCode as typeof resCodes.NOT_FOUND).prefix}: ${error.message}` });
   }
}
