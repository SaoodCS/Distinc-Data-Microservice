import type * as express from 'express';
import ErrorChecker from '../../global/helpers/errorCheckers/ErrorChecker';
import ErrorHandler from '../../global/helpers/errorHandlers/ErrorHandler';
import ErrorThrower from '../../global/interface/ErrorThrower';
import { resCodes } from '../../global/utils/resCode';
import DelCurrentAccountReqBody from '../reqBodyClass/DelCurrentAccountReqBody';
import FirebaseHelper from '../../global/helpers/firebaseHelpers/FirebaseHelper';
import CollectionRef from '../../global/utils/CollectionRef';
import { FieldValue } from 'firebase-admin/firestore';

export default async function deleteCurrentAccount(
   req: express.Request,
   res: express.Response,
): Promise<express.Response> {
   const reqBody = req.body;
   try {
      if (!DelCurrentAccountReqBody.isValid(reqBody)) {
         throw new ErrorThrower('Invalid Body Request', resCodes.BAD_REQUEST.code);
      }
      const { uid, error } = await FirebaseHelper.getUidFromAuthToken(req.headers.authorization);
      if (!uid) {
         throw new ErrorThrower(error!, resCodes.UNAUTHORIZED.code);
      }

      await CollectionRef.currentAccounts.doc(uid).update({
         [reqBody.id]: FieldValue.delete(),
      });

      return res.status(200).send({ message: 'Successfully Deleted Current Account' });
   } catch (error: unknown) {
      if (ErrorChecker.isErrorThrower(error)) {
         return ErrorHandler.handleErrorThrower(error, res);
      }

      return res.status(resCodes.INTERNAL_SERVER.code).send({ error: error });
   }
}
