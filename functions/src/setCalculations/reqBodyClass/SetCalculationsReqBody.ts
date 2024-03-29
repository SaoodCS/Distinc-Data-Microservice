export interface ISetCalculationsReqBody {
   distSteps: {
      timestamp: string;
      list: string[];
   }[];
   savingsAccHistory: {
      id: number;
      balance: number;
      timestamp: string;
   }[];
   analytics: {
      totalIncomes: number;
      totalExpenses: number;
      prevMonth: {
         totalSpendings: number;
         totalDisposableSpending: number;
         totalSavings: number;
      };
      timestamp: string;
   }[];
}

export default class SetCalculationsReqBody {
   static isValid(body: unknown): body is ISetCalculationsReqBody {
      if (typeof body !== 'object' || body === null) return false;
      const distSteps = (body as ISetCalculationsReqBody)['distSteps'];
      const savingsAccHistory = (body as ISetCalculationsReqBody)['savingsAccHistory'];
      const analytics = (body as ISetCalculationsReqBody)['analytics'];
      if (!SetCalculationsReqBody.isValidDistSteps(distSteps)) return false;
      if (!SetCalculationsReqBody.isValidSavingsAccHistory(savingsAccHistory)) return false;
      if (!SetCalculationsReqBody.isValidAnalytics(analytics)) return false;
      return true;
   }

   private static isValidDistSteps(
      distSteps: unknown,
   ): distSteps is ISetCalculationsReqBody['distSteps'] {
      if (!Array.isArray(distSteps)) return false;
      for (const item of distSteps) {
         if (typeof item !== 'object') return false;
         const timestamp = item['timestamp'];
         const list = item['list'];
         if (typeof timestamp !== 'string' || !Array.isArray(list)) return false;
         for (const listItem of list) {
            if (typeof listItem !== 'string') return false;
         }
      }
      return true;
   }

   private static isValidSavingsAccHistory(
      savingsAccHistory: unknown,
   ): savingsAccHistory is ISetCalculationsReqBody['savingsAccHistory'] {
      if (!Array.isArray(savingsAccHistory)) return false;
      for (const item of savingsAccHistory) {
         if (typeof item !== 'object') return false;
         const id = item['id'];
         const balance = item['balance'];
         const timestamp = item['timestamp'];
         if (typeof id !== 'number' || typeof balance !== 'number' || typeof timestamp !== 'string')
            return false;
      }
      return true;
   }

   private static isValidAnalytics(
      analytics: unknown,
   ): analytics is ISetCalculationsReqBody['analytics'] {
      if (!Array.isArray(analytics)) return false;
      for (const item of analytics) {
         if (typeof item !== 'object') return false;
         const totalIncomes = item['totalIncomes'];
         const totalExpenses = item['totalExpenses'];
         const prevMonth = item['prevMonth'];
         const timestamp = item['timestamp'];
         if (
            typeof totalIncomes !== 'number' ||
            typeof totalExpenses !== 'number' ||
            typeof timestamp !== 'string' ||
            !SetCalculationsReqBody.isValidPrevMonth(prevMonth)
         )
            return false;
      }
      return true;
   }

   static isValidPrevMonth(
      prevMonth: unknown,
   ): prevMonth is ISetCalculationsReqBody['analytics'][0]['prevMonth'] {
      if (typeof prevMonth !== 'object') return false;
      const totalSpendings = (prevMonth as ISetCalculationsReqBody['analytics'][0]['prevMonth'])[
         'totalSpendings'
      ];
      const totalDisposableSpending = (
         prevMonth as ISetCalculationsReqBody['analytics'][0]['prevMonth']
      )['totalDisposableSpending'];
      const totalSavings = (prevMonth as ISetCalculationsReqBody['analytics'][0]['prevMonth'])[
         'totalSavings'
      ];
      if (
         typeof totalSpendings !== 'number' ||
         typeof totalDisposableSpending !== 'number' ||
         typeof totalSavings !== 'number'
      )
         return false;
      return true;
   }
}
