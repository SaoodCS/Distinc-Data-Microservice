import type * as express from 'express';
import ErrorChecker from '../../global/helpers/errorCheckers/ErrorChecker';
import ErrorHandler from '../../global/helpers/errorHandlers/ErrorHandler';
import FirebaseHelper from '../../global/helpers/firebaseHelpers/FirebaseHelper';
import ErrorThrower from '../../global/interface/ErrorThrower';
import CollectionRef from '../../global/utils/CollectionRef';
import { resCodes } from '../../global/utils/resCode';
import SetIncomeReqBody from '../reqBodyClass/SetIncomeReqBody';

export default async function setIncome(
   req: express.Request,
   res: express.Response,
): Promise<express.Response> {
   const reqBody = req.body;
   try {
      if (!SetIncomeReqBody.isValid(reqBody)) {
         throw new ErrorThrower('Invalid Body Request', resCodes.BAD_REQUEST.code);
      }

      const { uid, error } = await FirebaseHelper.getUidFromAuthToken(req.headers.authorization);
      if (!uid) {
         throw new ErrorThrower(error!, resCodes.UNAUTHORIZED.code);
      }

      let incomeId: number = 0;
      if (!reqBody.id) {
         const incomeData = (await CollectionRef.income.doc(uid).get()).data();
         if (!incomeData) {
            incomeId = Math.floor(Math.random() * 1000000);
         } else {
            do {
               incomeId = Math.floor(Math.random() * 1000000);
            } while (incomeData[incomeId] !== undefined);
         }
      } else {
         incomeId = reqBody.id;
      }

      await CollectionRef.income.doc(uid).set(
         {
            [incomeId]: {
               ...reqBody,
               id: incomeId,
            },
         },
         { merge: true },
      );

      return res.status(200).send({ message: 'Successfully set income' });
   } catch (error: unknown) {
      if (ErrorChecker.isErrorThrower(error)) {
         return ErrorHandler.handleErrorThrower(error, res);
      }
      return res.status(resCodes.INTERNAL_SERVER.code).send({ error: error });
   }
}
