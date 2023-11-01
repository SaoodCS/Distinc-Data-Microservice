export default class DateHelper {

    static toDDMMYYYY = (date: Date): string => {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    static fromDDMMYYYY = (date: string): Date => {
        const [day, month, year] = date.split('/');
        return new Date(Number(year), Number(month) - 1, Number(day));
    }
}