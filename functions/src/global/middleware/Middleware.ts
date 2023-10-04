import * as cors from 'cors';
import type * as express from 'express';
import * as admin from 'firebase-admin';
import { isRunningLocally } from '../helpers/isRunningLocally';
import type IObjWithErrProp from '../interface/IObjWithErrProp';
import { resCodes } from '../utils/resCode';

class Middleware {
   static initAdminSDK(): void {
      if (!admin.apps.length) {
         admin.initializeApp();
      }
   }

   static corsSetup(
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
   ): express.Response | void {
      return cors({ origin: false })(req, res, next);
   }

   static verifyHeaders(
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
   ): express.Response<IObjWithErrProp> | void {
      if (isRunningLocally()) return next();

      const contentType = req.headers['content-type'];
      if (!contentType) {
         return res.status(resCodes.BAD_GATEWAY.code).send({
            error: `${resCodes.BAD_GATEWAY.prefix}: Missing Content-Type Header In Gateway`,
         });
      }
      if (contentType !== 'application/json') {
         return res.status(resCodes.BAD_GATEWAY.code).send({
            error: `${resCodes.BAD_GATEWAY.prefix}: Invalid Content-Type Header In Gateway`,
         });
      }

      const apiKeyHeader = req.headers['api-key'];
      if (!apiKeyHeader) {
         return res
            .status(resCodes.BAD_GATEWAY.code)
            .send({ error: `${resCodes.BAD_GATEWAY.prefix}: Missing API Key In Gateway` });
      }

      if (typeof apiKeyHeader !== 'string') {
         return res
            .status(resCodes.BAD_GATEWAY.code)
            .send({ error: `${resCodes.BAD_GATEWAY.prefix}: Invalid API Key In Gateway` });
      }

      return next();
   }

   static verifyApiKey(
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
   ): express.Response<IObjWithErrProp> | void {
      try {
         const apiKeyHeader = req.headers['api-key'] as string;
         const apiKeySecret = process.env.API_KEY;
         if (!apiKeySecret) {
            return res
               .status(resCodes.INTERNAL_SERVER.code)
               .send({ error: `${resCodes.INTERNAL_SERVER.prefix}: No API Key In Back-End` });
         }

         if (apiKeyHeader !== apiKeySecret) {
            return res
               .status(resCodes.BAD_GATEWAY.code)
               .send({ error: `${resCodes.BAD_GATEWAY.prefix}: Unauthorized API Key` });
         }
         return next();
      } catch (err) {
         return res.status(500).send({ error: err });
      }
   }
}

export default Middleware;
