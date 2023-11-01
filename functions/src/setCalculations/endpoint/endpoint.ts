import type * as express from 'express';
import ErrorChecker from '../../global/helpers/errorCheckers/ErrorChecker';
import ErrorHandler from '../../global/helpers/errorHandlers/ErrorHandler';
import FirebaseHelper from '../../global/helpers/firebaseHelpers/FirebaseHelper';
import ErrorThrower from '../../global/interface/ErrorThrower';
import CollectionRef from '../../global/utils/CollectionRef';
import { resCodes } from '../../global/utils/resCode';
import updateCalcArrayField from '../helpers/helpers';
import SetCalculationsReqBody from '../reqBodyClass/SetCalculationsReqBody';

export default async function setCalculations(
   req: express.Request,
   res: express.Response,
): Promise<express.Response> {
   const reqBody = req.body;
   try {
      if (!SetCalculationsReqBody.isValid(reqBody)) {
         throw new ErrorThrower('Invalid Body Request', resCodes.BAD_REQUEST.code);
      }
      const { uid, error } = await FirebaseHelper.getUidFromAuthToken(req.headers.authorization);
      if (!uid) {
         throw new ErrorThrower(error!, resCodes.UNAUTHORIZED.code);
      }

      const { savingsAccHistory, analytics, distributer } = reqBody;

      const savingsAccountsData = (await CollectionRef.savingsAccounts.doc(uid).get()).data();
      if (savingsAccountsData) {
         for (const savingsAcc of savingsAccHistory) {
            const { id, balance } = savingsAcc;
            savingsAccountsData[id].currentBalance = balance;
         }
         await CollectionRef.savingsAccounts
            .doc(uid)
            .set({ ...savingsAccountsData }, { merge: true });
      }

      const { error: analyticsUpdateErr } = await updateCalcArrayField(analytics, 'analytics', uid);
      if (analyticsUpdateErr) {
         throw new ErrorThrower(analyticsUpdateErr, resCodes.INTERNAL_SERVER.code);
      }

      const { error: distributerUpdateErr } = await updateCalcArrayField(
         distributer,
         'distributer',
         uid,
      );
      if (distributerUpdateErr) {
         throw new ErrorThrower(distributerUpdateErr, resCodes.INTERNAL_SERVER.code);
      }

      const { error: savingsAccHistoryErr } = await updateCalcArrayField(
         savingsAccHistory,
         'savingsAccHistory',
         uid,
         'month',
      );
      if (savingsAccHistoryErr) {
         throw new ErrorThrower(savingsAccHistoryErr, resCodes.INTERNAL_SERVER.code);
      }
      return res.status(200).send({ message: 'Successfully Set Calculation' });
   } catch (error: unknown) {
      // Error handling code for caught errors here

      if (ErrorChecker.isErrorThrower(error)) {
         return ErrorHandler.handleErrorThrower(error, res);
      }

      return res.status(resCodes.INTERNAL_SERVER.code).send({ error: error });
   }
}
