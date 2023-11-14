import type * as express from 'express';
import { FieldValue } from 'firebase-admin/firestore';
import ArrayOfObjects from '../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import ErrorChecker from '../../global/helpers/errorCheckers/ErrorChecker';
import ErrorHandler from '../../global/helpers/errorHandlers/ErrorHandler';
import FirebaseHelper from '../../global/helpers/firebaseHelpers/FirebaseHelper';
import ErrorThrower from '../../global/interface/ErrorThrower';
import CollectionRef from '../../global/utils/CollectionRef';
import { resCodes } from '../../global/utils/resCode';
import type { ISetCalculationsReqBody } from '../../setCalculations/reqBodyClass/SetCalculationsReqBody';
import { objectsWithMonthYear } from '../helpers/helpers';
import DelCalculationsReqBody from '../reqBodyClass/DelCalculationsReqBody';

export default async function deleteCalculations(
   req: express.Request,
   res: express.Response,
): Promise<express.Response> {
   const reqBody = req.body;
   try {
      if (!DelCalculationsReqBody.isValid(reqBody)) {
         throw new ErrorThrower('Invalid Body Request', resCodes.BAD_REQUEST.code);
      }

      const { uid, error } = await FirebaseHelper.getUidFromAuthToken(req.headers.authorization);
      if (!uid) {
         throw new ErrorThrower(error!, resCodes.UNAUTHORIZED.code);
      }

      // -- "DELETE THIS" Option on the Front-End -- //
      if (DelCalculationsReqBody.isDelCalcDistItemReq(reqBody)) {
         if (DelCalculationsReqBody.isValidDistStepsObj(reqBody.data)) {
            // Delete the distSteps object from the distSteps array in the calculations collection
            await CollectionRef.calculations.doc(uid).update({
               distSteps: FieldValue.arrayRemove(reqBody.data),
            });
         } else if (DelCalculationsReqBody.isValidAnalyticsObj(reqBody.data)) {
            // Delete the analytics object from the distSteps array in the calculations collection
            await CollectionRef.calculations.doc(uid).update({
               analytics: FieldValue.arrayRemove(reqBody.data),
            });
         } else if (DelCalculationsReqBody.isValidSavingsAccHistoryObj(reqBody.data)) {
            // Delete the savingsAccHistory object from the savingsAccHistory array in the calculations collection
            await CollectionRef.calculations.doc(uid).update({
               savingsAccHistory: FieldValue.arrayRemove(reqBody.data),
            });
         }
         return res.status(200).send({ message: 'Successfully updated calculations' });
      }

      // -- "DELETE ALL FOR MONTH" Option on the Front-End -- //
      if (DelCalculationsReqBody.isDelCalcDistMonthReq(reqBody)) {
         const monthYear = reqBody.monthYear;
         const calcDataFirestore = (await CollectionRef.calculations.doc(uid).get()).data();
         if (!calcDataFirestore) {
            throw new ErrorThrower('No calculations data found', resCodes.NOT_FOUND.code);
         }
         const distStepsArr: ISetCalculationsReqBody['distSteps'] | undefined =
            calcDataFirestore.distSteps;
         if (distStepsArr) {
            const distStepsArrFiltered = objectsWithMonthYear(distStepsArr || [], monthYear);
            if (distStepsArrFiltered.length > 0) {
               await CollectionRef.calculations.doc(uid).update({
                  distSteps: FieldValue.arrayRemove(...distStepsArrFiltered),
               });
            }
         }

         const analyticsArr: ISetCalculationsReqBody['analytics'] | undefined =
            calcDataFirestore.analytics;
         if (analyticsArr) {
            const analyticsArrFiltered = objectsWithMonthYear(analyticsArr || [], monthYear);
            if (analyticsArrFiltered.length > 0) {
               await CollectionRef.calculations.doc(uid).update({
                  analytics: FieldValue.arrayRemove(...analyticsArrFiltered),
               });
            }
         }

         const savingsAccHistoryArr: ISetCalculationsReqBody['savingsAccHistory'] | undefined =
            calcDataFirestore.savingsAccHistory;
         if (savingsAccHistoryArr) {
            const savingsAccHistoryArrFiltered = objectsWithMonthYear(
               savingsAccHistoryArr || [],
               monthYear,
            );
            if (savingsAccHistoryArrFiltered.length > 0) {
               await CollectionRef.calculations.doc(uid).update({
                  savingsAccHistory: FieldValue.arrayRemove(...savingsAccHistoryArrFiltered),
               });
            }
         }

         return res.status(200).send({ message: 'Successfully updated calculations' });
      }

      // -- "DELETE ALL FOR SAVINGS ACC ID" Option on the Front-End -- //
      if (DelCalculationsReqBody.isDelCalcDistAllSavingsAccIdHistroyReq(reqBody)) {
         const calcDataFirestore = (await CollectionRef.calculations.doc(uid).get()).data();
         if (!calcDataFirestore) {
            throw new ErrorThrower('No calculations data found', resCodes.NOT_FOUND.code);
         }
         const savingsAccHistoryArr =
            calcDataFirestore.savingsAccHistory as ISetCalculationsReqBody['savingsAccHistory'];
         const savingsAccHistoryArrFiltered = ArrayOfObjects.getObjectsWithKeyValuePair(
            savingsAccHistoryArr,
            'id',
            reqBody.savingsAccId,
         );
         // Remove objects with the same savingsAccId from the savingsAccHistory array
         await CollectionRef.calculations.doc(uid).update({
            savingsAccHistory: FieldValue.arrayRemove(...savingsAccHistoryArrFiltered),
         });
         return res.status(200).send({ message: 'Successfully updated calculations' });
      }

      return res.status(200).send({ message: 'Successfully updated calculations' });
   } catch (error: unknown) {
      if (ErrorChecker.isErrorThrower(error)) {
         return ErrorHandler.handleErrorThrower(error, res);
      }
      return res.status(resCodes.INTERNAL_SERVER.code).send({ error: error });
   }
}
