import DateHelper from '../../global/helpers/dataTypes/date/DateHelper';
import type { ISetCalculationsReqBody } from '../../setCalculations/reqBodyClass/SetCalculationsReqBody';
import SetCalculationsReqBody from '../../setCalculations/reqBodyClass/SetCalculationsReqBody';

interface IDelCalcDistItem {
   type: 'analyticsItem' | 'distributerItem' | 'savingsAccHistoryItem';
   data:
      | ISetCalculationsReqBody['analytics'][0]
      | ISetCalculationsReqBody['distributer'][0]
      | ISetCalculationsReqBody['savingsAccHistory'][0];
}

interface IDelCalcDistMonth {
   type: 'month';
   monthYear: string;
}

interface IDelCalcDistAllSavingsAccIdHistory {
   type: 'allSavingsAccIdHistory';
   savingsAccId: number;
}

export type IDelCalculationsReqBody =
   | IDelCalcDistItem
   | IDelCalcDistMonth
   | IDelCalcDistAllSavingsAccIdHistory;

export default class DelCalculationsReqBody {
   static isValid(body: unknown): body is IDelCalculationsReqBody {
      if (DelCalculationsReqBody.isDelCalcDistItemReq(body)) return true;
      if (DelCalculationsReqBody.isDelCalcDistMonthReq(body)) return true;
      if (DelCalculationsReqBody.isDelCalcDistAllSavingsAccIdHistroyReq(body)) return true;
      return false;
   }

   static isDelCalcDistItemReq(body: unknown): body is IDelCalcDistItem {
      const bodyAsCalcDistItem = body as IDelCalcDistItem;

      const isBodyTypeAnalytics = bodyAsCalcDistItem['type'] === 'analyticsItem';
      const isBodyDataAnalytics = DelCalculationsReqBody.isValidAnalyticsObj(
         bodyAsCalcDistItem.data,
      );
      if (isBodyTypeAnalytics && isBodyDataAnalytics) return true;

      const isBodyTypeDistributer = bodyAsCalcDistItem['type'] === 'distributerItem';
      const isBodyDataDistributer = DelCalculationsReqBody.isValidDistributerObj(
         bodyAsCalcDistItem.data,
      );
      if (isBodyTypeDistributer && isBodyDataDistributer) return true;

      const isBodyTypeSavingsAccHistory = bodyAsCalcDistItem['type'] === 'savingsAccHistoryItem';
      const isBodyDataSavingsAccHistory = DelCalculationsReqBody.isValidSavingsAccHistoryObj(
         bodyAsCalcDistItem.data,
      );
      if (isBodyTypeSavingsAccHistory && isBodyDataSavingsAccHistory) return true;

      return false;
   }

   static isDelCalcDistMonthReq(body: unknown): body is IDelCalcDistMonth {
      const bodyAsCalcDistMonth = body as IDelCalcDistMonth;
      const isBodyTypeMonthStr = bodyAsCalcDistMonth['type'] === 'month';
      const isMonthYearStrValid = DateHelper.isStringMMYYYY(bodyAsCalcDistMonth['monthYear'] || '');
      return isBodyTypeMonthStr && isMonthYearStrValid;
   }

   static isDelCalcDistAllSavingsAccIdHistroyReq(
      body: unknown,
   ): body is IDelCalcDistAllSavingsAccIdHistory {
      const bodyAsCalcDistAllSavingsAccIdHistory = body as IDelCalcDistAllSavingsAccIdHistory;
      const isTypeStr = bodyAsCalcDistAllSavingsAccIdHistory['type'] === 'allSavingsAccIdHistory';
      const isSavingsAccIdValid =
         typeof bodyAsCalcDistAllSavingsAccIdHistory['savingsAccId'] === 'number';
      return isTypeStr && isSavingsAccIdValid;
   }

   static isValidDistributerObj(
      bodyDataField: unknown,
   ): bodyDataField is ISetCalculationsReqBody['distributer'][0] {
      if (typeof bodyDataField !== 'object' || bodyDataField === null) return false;

      const timestamp = (bodyDataField as ISetCalculationsReqBody['distributer'][0])['timestamp'];
      const msgs = (bodyDataField as ISetCalculationsReqBody['distributer'][0])['msgs'];
      if (typeof timestamp !== 'string' || !Array.isArray(msgs)) return false;
      for (const msg of msgs) {
         if (typeof msg !== 'string') return false;
      }
      return true;
   }

   static isValidAnalyticsObj(
      bodyDataField: unknown,
   ): bodyDataField is ISetCalculationsReqBody['analytics'][0] {
      if (typeof bodyDataField !== 'object' || bodyDataField === null) return false;

      const totalIncomes = (bodyDataField as ISetCalculationsReqBody['analytics'][0])[
         'totalIncomes'
      ];
      const totalExpenses = (bodyDataField as ISetCalculationsReqBody['analytics'][0])[
         'totalExpenses'
      ];
      const prevMonth = (bodyDataField as ISetCalculationsReqBody['analytics'][0])['prevMonth'];
      const timestamp = (bodyDataField as ISetCalculationsReqBody['analytics'][0])['timestamp'];
      if (
         typeof totalIncomes !== 'number' ||
         typeof totalExpenses !== 'number' ||
         typeof timestamp !== 'string' ||
         !SetCalculationsReqBody.isValidPrevMonth(prevMonth)
      )
         return false;
      return true;
   }

   static isValidSavingsAccHistoryObj(
      bodyDataField: unknown,
   ): bodyDataField is ISetCalculationsReqBody['savingsAccHistory'][0] {
      if (typeof bodyDataField !== 'object' || bodyDataField === null) return false;

      const id = (bodyDataField as ISetCalculationsReqBody['savingsAccHistory'][0])['id'];
      const balance = (bodyDataField as ISetCalculationsReqBody['savingsAccHistory'][0])['balance'];
      const timestamp = (bodyDataField as ISetCalculationsReqBody['savingsAccHistory'][0])[
         'timestamp'
      ];
      if (typeof id !== 'number' || typeof balance !== 'number' || typeof timestamp !== 'string')
         return false;
      return true;
   }
}
