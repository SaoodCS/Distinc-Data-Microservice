import type * as express from 'express';
import ErrorChecker from '../../global/helpers/errorCheckers/ErrorChecker';
import ErrorHandler from '../../global/helpers/errorHandlers/ErrorHandler';
import FirebaseHelper from '../../global/helpers/firebaseHelpers/FirebaseHelper';
import ErrorThrower from '../../global/interface/ErrorThrower';
import CollectionRef from '../../global/utils/CollectionRef';
import { resCodes } from '../../global/utils/resCode';
import SetExpenseReqBody from '../reqBodyClass/SetExpenseReqBody';

export default async function setExpense(
   req: express.Request,
   res: express.Response,
): Promise<express.Response> {
   const reqBody = req.body;
   try {
      if (!SetExpenseReqBody.isValid(reqBody)) {
         throw new ErrorThrower('Invalid Body Request', resCodes.BAD_REQUEST.code);
      }

      const { uid, error } = await FirebaseHelper.getUidFromAuthToken(req.headers.authorization);
      if (!uid) {
         throw new ErrorThrower(error!, resCodes.UNAUTHORIZED.code);
      }

      let expenseId: number = 0;
      if (!reqBody.id) {
         const expenseData = (await CollectionRef.expenses.doc(uid).get()).data();
         if (!expenseData) {
            expenseId = Math.floor(Math.random() * 1000000);
         } else {
            do {
               expenseId = Math.floor(Math.random() * 1000000);
            } while (expenseData[expenseId] !== undefined);
         }
      } else {
         expenseId = reqBody.id;
      }

      await CollectionRef.expenses.doc(uid).set(
         {
            [expenseId]: {
               ...reqBody,
               id: expenseId,
            },
         },
         { merge: true },
      );

      return res.status(200).send({ message: 'Successfully set expense' });
   } catch (error: unknown) {
      if (ErrorChecker.isErrorThrower(error)) {
         return ErrorHandler.handleErrorThrower(error, res);
      }

      return res.status(resCodes.INTERNAL_SERVER.code).send({ error: error });
   }
}
