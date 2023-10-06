import * as admin from 'firebase-admin';

interface IGetUidFromAuthTokenReturn {
   uid?: string;
   error?: string;
}

export default class FirebaseHelper {
   static async getUidFromAuthToken(
      authHeader: string | undefined,
   ): Promise<IGetUidFromAuthTokenReturn> {
      if (!authHeader) {
         return { error: 'Missing auth header in request' };
      }
      const token = authHeader.split(' ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);
      if (!decodedToken) {
         return { error: 'Invalid auth token' };
      }
      return {
         uid: decodedToken.uid,
      };
   }
}
