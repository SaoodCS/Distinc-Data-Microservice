import type * as express from 'express';
import ErrorChecker from '../../global/helpers/errorCheckers/ErrorChecker';
import ErrorHandler from '../../global/helpers/errorHandlers/ErrorHandler';
import FirebaseHelper from '../../global/helpers/firebaseHelpers/FirebaseHelper';
import ErrorThrower from '../../global/interface/ErrorThrower';
import CollectionRef from '../../global/utils/CollectionRef';
import { resCodes } from '../../global/utils/resCode';
import SetSavingsAccountReqBody from '../reqBodyClass/SetSavingsAccountReqBody';

export default async function setSavingsAccount(
   req: express.Request,
   res: express.Response,
): Promise<express.Response> {
   const reqBody = req.body;
   try {
      if (!SetSavingsAccountReqBody.isValid(reqBody)) {
         throw new ErrorThrower('Invalid Body Request', resCodes.BAD_REQUEST.code);
      }
      const { uid, error } = await FirebaseHelper.getUidFromAuthToken(req.headers.authorization);
      if (!uid) {
         throw new ErrorThrower(error!, resCodes.UNAUTHORIZED.code);
      }

      let savingsAccountId: number = 0;
      if (!reqBody.id) {
         const savingsAccountsData = (await CollectionRef.savingsAccounts.doc(uid).get()).data();
         if (!savingsAccountsData) {
            savingsAccountId = Math.floor(Math.random() * 1000000);
         } else {
            do {
               savingsAccountId = Math.floor(Math.random() * 1000000);
            } while (savingsAccountsData[savingsAccountId] !== undefined);
         }
      } else {
         savingsAccountId = reqBody.id;
      }

      await CollectionRef.savingsAccounts.doc(uid).set(
         {
            [savingsAccountId]: {
               ...reqBody,
               id: savingsAccountId,
            },
         },
         { merge: true },
      );

      return res.status(200).send({ message: 'Successfully set savings account' });
   } catch (error: unknown) {
      // Error handling code for caught errors here

      if (ErrorChecker.isErrorThrower(error)) {
         return ErrorHandler.handleErrorThrower(error, res);
      }

      return res.status(resCodes.INTERNAL_SERVER.code).send({ error: error });
   }
}
