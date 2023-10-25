import type * as express from 'express';
import { FieldValue } from 'firebase-admin/firestore';
import ErrorChecker from '../../global/helpers/errorCheckers/ErrorChecker';
import ErrorHandler from '../../global/helpers/errorHandlers/ErrorHandler';
import FirebaseHelper from '../../global/helpers/firebaseHelpers/FirebaseHelper';
import ErrorThrower from '../../global/interface/ErrorThrower';
import CollectionRef from '../../global/utils/CollectionRef';
import { resCodes } from '../../global/utils/resCode';
import DelSavingsAccountReqBody from '../reqBodyClass/DelSavingsAccountReqBody';

export default async function deleteSavingsAccount(
   req: express.Request,
   res: express.Response,
): Promise<express.Response> {
   const reqBody = req.body;
   try {
      if (!DelSavingsAccountReqBody.isValid(reqBody)) {
         throw new ErrorThrower('Invalid Body Request', resCodes.BAD_REQUEST.code);
      }

      const { uid, error } = await FirebaseHelper.getUidFromAuthToken(req.headers.authorization);
      if (!uid) {
         throw new ErrorThrower(error!, resCodes.UNAUTHORIZED.code);
      }

      await CollectionRef.savingsAccounts.doc(uid).update({
         [reqBody.id]: FieldValue.delete(),
      });

      const currentAcc = (await CollectionRef.currentAccounts.doc(uid).get()).data();
      if (currentAcc) {
         for (const currentAccId in currentAcc) {
            if (currentAcc[currentAccId].transferLeftoversTo === reqBody.id) {
               // eslint-disable-next-line no-await-in-loop
               await CollectionRef.currentAccounts.doc(uid).set(
                  {
                     [currentAccId]: {
                        ...currentAcc[currentAccId],
                        transferLeftoversTo: '',
                     },
                  },

                  { merge: true },
               );
            }
         }
      }

      const expenses = (await CollectionRef.expenses.doc(uid).get()).data();
      if (expenses) {
         for (const expenseId in expenses) {
            if (expenses[expenseId].expenseType.includes(`Savings Transfer:${reqBody.id}`)) {
               // eslint-disable-next-line no-await-in-loop
               await CollectionRef.expenses.doc(uid).update({
                  [expenseId]: FieldValue.delete(),
               });
            }
         }
      }

      return res.status(200).send({ message: 'Successfully Deleted Savings Account' });
   } catch (error: unknown) {
      // Error handling code for caught errors here

      if (ErrorChecker.isErrorThrower(error)) {
         return ErrorHandler.handleErrorThrower(error, res);
      }

      return res.status(resCodes.INTERNAL_SERVER.code).send({ error: error });
   }
}
