import type IHelperError from '../../../interface/IObjWithErrProp';
import ErrorChecker from '../../errorCheckers/ErrorChecker';

class ArrayOfObjects {
   public static objectsWithVal<T>(array: T[], propertyValue: T[keyof T]): T[] | IHelperError {
      const obj = array.filter((item) => {
         for (const key in item) {
            if (item[key] === propertyValue) {
               return item;
            }
         }
      });
      if (obj.length === 0) {
         return {
            error: `No Objects Found With Val: ${propertyValue}.`,
         };
      }
      return obj;
   }

   static objectWithVal<T>(
      array: T[],
      propertyValue: T[keyof T],
   ): T | undefined | { error: string } {
      const object = this.objectsWithVal(array, propertyValue);
      if (ErrorChecker.hasErrorProp(object)) return object;
      if (object.length > 1) {
         return {
            error: `Multiple Objects Found With Val: ${propertyValue}.`,
         };
      }
      return object[0];
   }

   static getObjWithKeyValuePair<T>(arr: T[], key: keyof T, value: T[keyof T]): T {
      return arr.find((obj) => obj[key] === value) as T;
   }

   static getObjectsWithKeyValuePair<T>(arr: T[], key: keyof T, value: T[keyof T]): T[] {
      return arr.filter((obj) => obj[key] === value) as T[];
   }

   static filterOut<T>(arr: T[], key: keyof T, value: T[keyof T]): T[] {
      return arr.filter((obj) => obj[key] !== value);
   }

   static filterIn<T>(arr: T[], key: keyof T, value: T[keyof T]): T[] {
      return arr.filter((obj) => obj[key] === value);
   }

   static deleteDuplicates<T>(arr: T[], key: keyof T): T[] {
      return arr.filter((obj, index, self) => self.findIndex((o) => o[key] === obj[key]) === index);
   }

   static combine<T>(arr1: T[], arr2: T[]): T[] {
      return arr1.concat(arr2);
   }

   static isEmpty<T>(arr: T[]): boolean {
      return arr.length === 0;
   }
}

export default ArrayOfObjects;
