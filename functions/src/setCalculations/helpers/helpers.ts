import { FieldValue } from 'firebase-admin/firestore';
import ArrayOfObjects from '../../global/helpers/dataTypes/arrayOfObjects/arrayOfObjects';
import CollectionRef from '../../global/utils/CollectionRef';
import type { ISetCalculationsReqBody } from '../reqBodyClass/SetCalculationsReqBody';

export default async function updateCalcArrayField(
   reqBodyFieldData:
      | ISetCalculationsReqBody['analytics']
      | ISetCalculationsReqBody['distributer']
      | ISetCalculationsReqBody['savingsAccHistory'],
   fieldKey: 'analytics' | 'distributer' | 'savingsAccHistory',
   uid: string,
   matchSavingAccDateBy?: 'month' | 'day',
): Promise<{ error: string | undefined }> {
   try {
      const calculationsDoc = CollectionRef.calculations.doc(uid);
      const calcData = (await calculationsDoc.get()).data();
      const firestoreFieldData = calcData ? calcData[fieldKey] : undefined;
      const reqBodyFieldDataObj = reqBodyFieldData[0];

      // If the doc containing calcData doesn't exist, then create it and set the fieldKey to the reqBodyFieldData:
      if (!calcData) {
         await CollectionRef.calculations.doc(uid).set({ [fieldKey]: reqBodyFieldData });
         return { error: undefined };
      }

      // if the field doesn't exist in the calcData, then update the document and set the field:
      if (!firestoreFieldData) {
         await CollectionRef.calculations.doc(uid).update({ [fieldKey]: reqBodyFieldData });
         return { error: undefined };
      }

      // If the field does exist in the calcData, then search the field array for a matching month item:
      let matchingDateObj: typeof reqBodyFieldDataObj | undefined = undefined;
      // if the fieldKey is savingsAccHistory, then firstly we need to find the matching id items if any and then the matching month/day item:
      if (fieldKey === 'savingsAccHistory') {
         const objectsWithMatchingIds = ArrayOfObjects.getObjectsWithKeyValuePair(
            firestoreFieldData as ISetCalculationsReqBody['savingsAccHistory'],
            'id',
            (reqBodyFieldDataObj as ISetCalculationsReqBody['savingsAccHistory'][0]).id,
         );
         if (objectsWithMatchingIds.length > 0) {
            if (matchSavingAccDateBy === 'month') {
               matchingDateObj = objectsWithMatchingIds.find(
                  (item: typeof reqBodyFieldDataObj) =>
                     item.timestamp.split('/')[1] === reqBodyFieldDataObj.timestamp.split('/')[1],
               );
            }
            if (matchSavingAccDateBy === 'day') {
               matchingDateObj = ArrayOfObjects.getObjWithKeyValuePair(
                  objectsWithMatchingIds,
                  'timestamp',
                  reqBodyFieldDataObj.timestamp,
               );
            }
         }
      } else {
         matchingDateObj = firestoreFieldData.find(
            (item: typeof reqBodyFieldDataObj) =>
               item.timestamp.split('/')[1] === reqBodyFieldDataObj.timestamp.split('/')[1],
         );
      }

      // Update the matching month object in the field array if it exists, otherwise update the field array by adding the reqBodyFieldData as a new object in the array:
      if (matchingDateObj) {
         await CollectionRef.calculations.doc(uid).update({
            [fieldKey]: FieldValue.arrayRemove(matchingDateObj),
         });
         await CollectionRef.calculations.doc(uid).update({
            [fieldKey]: FieldValue.arrayUnion(reqBodyFieldDataObj),
         });
      } else {
         await CollectionRef.calculations.doc(uid).update({
            [fieldKey]: FieldValue.arrayUnion(...reqBodyFieldData),
         });
      }
      return { error: undefined };
   } catch (error: unknown) {
      return { error: JSON.stringify(error) };
   }
}
