import DateHelper from '../../global/helpers/dataTypes/date/DateHelper';

export function objectsWithMonthYear<
   T extends {
      timestamp: string;
   },
>(arrayField: T[], monthYear: string): T[] {
   return arrayField.filter((obj) => {
      const timestampMonthYear = DateHelper.fromDDMMYYYYToMonthYear(obj.timestamp);
      return timestampMonthYear === monthYear;
   });
}
