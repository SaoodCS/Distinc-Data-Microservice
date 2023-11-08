import NumberHelpers from '../numberHelpers/numberHelpers';

export default class DateHelper {
   static toDDMMYYYY = (date: Date): string => {
      let day: number | string = date.getDate();
      let month: number | string = date.getMonth() + 1;
      const year = date.getFullYear();
      if (day < 10) day = `0${day}`;
      if (month < 10) month = `0${month}`;
      return `${day}/${month}/${year}`;
   };

   static fromDDMMYYYY = (date: string): Date => {
      const [day, month, year] = date.split('/');
      return new Date(Number(year), Number(month) - 1, Number(day));
   };

   static isStringMMYYYY = (str: string): boolean => {
      const monthYearStrHasSlash = str.includes('/');
      const strLength = str.length === 7;
      const strSlashIndex = str.indexOf('/') === 2;
      const isstrDigits = NumberHelpers.isStringNumber(str.replace('/', '0'));
      return monthYearStrHasSlash && strLength && strSlashIndex && isstrDigits;
   };

   static fromDDMMYYYYToMonthYear(date: string): string {
      return date.slice(3);
   }
}
