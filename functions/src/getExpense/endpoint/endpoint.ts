import type * as express from 'express';
import ErrorChecker from '../../global/helpers/errorCheckers/ErrorChecker';
import ErrorHandler from '../../global/helpers/errorHandlers/ErrorHandler';
import { resCodes } from '../../global/utils/resCode';

export default async function getExpenses(
   req: express.Request,
   res: express.Response,
): Promise<express.Response> {
   try {
      return res.status(200).send({ message: 'Empty Cloud Function' });
   } catch (error: unknown) {
      // Error handling code for caught errors here

      if (ErrorChecker.isErrorThrower(error)) {
         return ErrorHandler.handleErrorThrower(error, res);
      }

      return res.status(resCodes.INTERNAL_SERVER.code).send({ error: error });
   }
}
