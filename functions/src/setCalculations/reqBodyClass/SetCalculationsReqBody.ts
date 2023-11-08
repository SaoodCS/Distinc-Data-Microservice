export interface ISetCalculationsReqBody {
   distributer: {
      timestamp: string;
      msgs: string[];
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
      const distributer = (body as ISetCalculationsReqBody)['distributer'];
      const savingsAccHistory = (body as ISetCalculationsReqBody)['savingsAccHistory'];
      const analytics = (body as ISetCalculationsReqBody)['analytics'];
      if (!SetCalculationsReqBody.isValidDistributer(distributer)) return false;
      if (!SetCalculationsReqBody.isValidSavingsAccHistory(savingsAccHistory)) return false;
      if (!SetCalculationsReqBody.isValidAnalytics(analytics)) return false;
      return true;
   }

   private static isValidDistributer(
      distributer: unknown,
   ): distributer is ISetCalculationsReqBody['distributer'] {
      if (!Array.isArray(distributer)) return false;
      for (const item of distributer) {
         if (typeof item !== 'object') return false;
         const timestamp = item['timestamp'];
         const msgs = item['msgs'];
         if (typeof timestamp !== 'string' || !Array.isArray(msgs)) return false;
         for (const msg of msgs) {
            if (typeof msg !== 'string') return false;
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
