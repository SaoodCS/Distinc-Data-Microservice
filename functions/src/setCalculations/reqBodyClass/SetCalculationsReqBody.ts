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
      totalDisposableIncome: number;
      incomeEarnings: {
         name: string;
         earned: number;
      }[];
      actualExpenses: number;
      totalMonthlyExpenses: number;
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
         const totalDisposableIncome = item['totalDisposableIncome'];
         const actualExpenses = item['actualExpenses'];
         const totalMonthlyExpenses = item['totalMonthlyExpenses'];
         const timestamp = item['timestamp'];
         if (
            typeof totalIncomes !== 'number' ||
            typeof totalDisposableIncome !== 'number' ||
            typeof actualExpenses !== 'number' ||
            typeof totalMonthlyExpenses !== 'number' ||
            typeof timestamp !== 'string'
         )
            return false;
      }
      return true;
   }
}
