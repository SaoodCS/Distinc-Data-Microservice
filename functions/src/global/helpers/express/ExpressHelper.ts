/* eslint-disable @typescript-eslint/ban-types */
import type * as express from 'express';

export default class ExpressHelper {
   isExpressResponseType(value: unknown): value is express.Response {
      return (
         typeof (value as { send: Function }).send === 'function' &&
         typeof (value as { status: Function }).status === 'function'
      );
   }
}
