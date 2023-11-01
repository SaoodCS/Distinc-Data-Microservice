import type * as express from 'express';
import { FieldValue } from 'firebase-admin/firestore';
import ArrayOfObjects from '../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import DateHelper from '../../global/helpers/dataTypes/date/DateHelper';
import ErrorChecker from '../../global/helpers/errorCheckers/ErrorChecker';
import ErrorHandler from '../../global/helpers/errorHandlers/ErrorHandler';
import FirebaseHelper from '../../global/helpers/firebaseHelpers/FirebaseHelper';
import ErrorThrower from '../../global/interface/ErrorThrower';
import CollectionRef from '../../global/utils/CollectionRef';
import { resCodes } from '../../global/utils/resCode';
import { ISetCalculationsReqBody } from '../../setCalculations/reqBodyClass/SetCalculationsReqBody';
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

      // Set the savingsAccountId if it is not provided in the request body (i.e. if it is a new savings account)
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

      // Update the matching date object's current balance in the savingsAccHistory array in the calculations document:
      type ISavingsAccHistory = ISetCalculationsReqBody['savingsAccHistory'];
      const calcData = (await CollectionRef.calculations.doc(uid).get()).data();
      const savingsAccHistory: ISavingsAccHistory | undefined = calcData?.savingsAccHistory;
      if (savingsAccHistory && reqBody.currentBalance) {
         // Find the matching date and savings acc id object in the savingsAccHistory array:
         const currentDate = DateHelper.toDDMMYYYY(new Date());
         const matchingIdObjects = ArrayOfObjects.getObjectsWithKeyValuePair(
            savingsAccHistory,
            'id',
            savingsAccountId,
         );
         if (matchingIdObjects) {
            const matchingDateObj = ArrayOfObjects.getObjWithKeyValuePair(
               matchingIdObjects,
               'timestamp',
               currentDate,
            );
            // If the matching date and id obj exists, then update the currentBalance if it is different from the reqBody currentBalance:   
            if (matchingDateObj) {
               const isReqBodyBalanceDifferent = matchingDateObj.balance !== reqBody.currentBalance;
               if (isReqBodyBalanceDifferent) {
                  const updatedMatchingDateObj: ISavingsAccHistory[0] = {
                     balance: reqBody.currentBalance,
                     id: savingsAccountId,
                     timestamp: matchingDateObj.timestamp,
                  };
                  await CollectionRef.calculations.doc(uid).update({
                     savingsAccHistory: FieldValue.arrayRemove(matchingDateObj),
                  });
                  await CollectionRef.calculations.doc(uid).update({
                     savingsAccHistory: FieldValue.arrayUnion(updatedMatchingDateObj),
                  });
               }
            }
            //TODO: if it doesn't exist and tracking is set to true, then add the reqBody currentBalance, id, and timestamp as a new object in the savingsAccHistory array:
         }
      }

      // Update the savings account in the savingsAccounts document:
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
