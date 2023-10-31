import { FieldValue } from 'firebase-admin/firestore';
import CollectionRef from '../../global/utils/CollectionRef';
import { ISetCalculationsReqBody } from '../reqBodyClass/SetCalculationsReqBody';

export default async function updateCalcArrayField(
   reqBodyFieldData:
      | ISetCalculationsReqBody['analytics']
      | ISetCalculationsReqBody['distributer']
      | ISetCalculationsReqBody['savingsAccHistory'],
   fieldKey: 'analytics' | 'distributer' | 'savingsAccHistory',
   uid: string,
): Promise<{ error: string | undefined }> {
   try {
      const calculationsDoc = CollectionRef.calculations.doc(uid);
      const calcData = (await calculationsDoc.get()).data();
      const firestoreFieldData = calcData ? calcData[fieldKey] : undefined;
      const reqBodyFieldDataObj = reqBodyFieldData[0];

      if (!calcData || !firestoreFieldData) {
         await CollectionRef.calculations.doc(uid).update({ [fieldKey]: reqBodyFieldData });
      }
      if (firestoreFieldData) {
         const matchingMonthItem = firestoreFieldData.find(
            (item: typeof reqBodyFieldDataObj) =>
               item.timestamp.split('/')[1] === reqBodyFieldDataObj.timestamp.split('/')[1],
         );
         if (matchingMonthItem) {
            await CollectionRef.calculations.doc(uid).update({
               [fieldKey]: FieldValue.arrayRemove(matchingMonthItem),
            });
            await CollectionRef.calculations.doc(uid).update({
               [fieldKey]: FieldValue.arrayUnion(reqBodyFieldDataObj),
            });
         } else {
            await CollectionRef.calculations.doc(uid).update({
               [fieldKey]: FieldValue.arrayUnion(...reqBodyFieldData),
            });
         }
      }
      return { error: undefined };
   } catch (error: unknown) {
      return { error: JSON.stringify(error) };
   }
}
