import type * as express from 'express';
import ErrorChecker from '../../global/helpers/errorCheckers/ErrorChecker';
import ErrorHandler from '../../global/helpers/errorHandlers/ErrorHandler';
import FirebaseHelper from '../../global/helpers/firebaseHelpers/FirebaseHelper';
import ErrorThrower from '../../global/interface/ErrorThrower';
import CollectionRef from '../../global/utils/CollectionRef';
import { resCodes } from '../../global/utils/resCode';
import SetCurrentAccountReqBody from '../reqBodyClass/SetCurrentAccountReqBody';

export default async function setCurrentAccount(
   req: express.Request,
   res: express.Response,
): Promise<express.Response> {
   const reqBody = req.body;
   try {
      if (!SetCurrentAccountReqBody.isValid(reqBody)) {
         throw new ErrorThrower('Invalid Body Request', resCodes.BAD_REQUEST.code);
      }

      const { uid, error } = await FirebaseHelper.getUidFromAuthToken(req.headers.authorization);
      if (!uid) {
         throw new ErrorThrower(error!, resCodes.UNAUTHORIZED.code);
      }

      let currentAccountId: number = 0;
      if (!reqBody.id) {
         const currentAccountsData = (await CollectionRef.currentAccounts.doc(uid).get()).data();
         if (!currentAccountsData) {
            currentAccountId = Math.floor(Math.random() * 1000000);
         } else {
            do {
               currentAccountId = Math.floor(Math.random() * 1000000);
            } while (currentAccountsData[currentAccountId] !== undefined);
         }
      } else {
         currentAccountId = reqBody.id;
      }

      await CollectionRef.currentAccounts.doc(uid).set(
         {
            [currentAccountId]: {
               ...reqBody,
               id: currentAccountId,
            },
         },
         { merge: true },
      );

      return res.status(200).send({ message: 'Successfully set current account' });
   } catch (error: unknown) {
      if (ErrorChecker.isErrorThrower(error)) {
         return ErrorHandler.handleErrorThrower(error, res);
      }
      return res.status(resCodes.INTERNAL_SERVER.code).send({ error: error });
   }
}
