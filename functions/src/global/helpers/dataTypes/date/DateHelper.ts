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
}
