import type * as express from 'express';
import ErrorChecker from '../../global/helpers/errorCheckers/ErrorChecker';
import ErrorHandler from '../../global/helpers/errorHandlers/ErrorHandler';
import FirebaseHelper from '../../global/helpers/firebaseHelpers/FirebaseHelper';
import ErrorThrower from '../../global/interface/ErrorThrower';
import CollectionRef from '../../global/utils/CollectionRef';
import { resCodes } from '../../global/utils/resCode';
import SetCreditAccountReqBody from '../reqBodyClass/SetCreditAccountReqBody';

export default async function setCreditAccount(
   req: express.Request,
   res: express.Response,
): Promise<express.Response> {
   const reqBody = req.body;
   try {
      if (!SetCreditAccountReqBody.isValid(reqBody)) {
         throw new ErrorThrower('Invalid Body Request', resCodes.BAD_REQUEST.code);
      }

      const { uid, error } = await FirebaseHelper.getUidFromAuthToken(req.headers.authorization);
      if (!uid) {
         throw new ErrorThrower(error!, resCodes.UNAUTHORIZED.code);
      }

      let creditAccountId: number = 0;
      if (!reqBody.id) {
         const creditAccountsData = (await CollectionRef.creditAccounts.doc(uid).get()).data();
         if (!creditAccountsData) {
            creditAccountId = Math.floor(Math.random() * 1000000);
         } else {
            do {
               creditAccountId = Math.floor(Math.random() * 1000000);
            } while (creditAccountsData[creditAccountId] !== undefined);
         }
      } else {
         creditAccountId = reqBody.id;
      }

      await CollectionRef.creditAccounts.doc(uid).set(
         {
            [creditAccountId]: {
               ...reqBody,
               id: creditAccountId,
            },
         },
         { merge: true },
      );

      return res.status(200).send({ message: 'Successfully set credit account' });
   } catch (error: unknown) {
      if (ErrorChecker.isErrorThrower(error)) {
         return ErrorHandler.handleErrorThrower(error, res);
      }
      return res.status(resCodes.INTERNAL_SERVER.code).send({ error: error });
   }
}
