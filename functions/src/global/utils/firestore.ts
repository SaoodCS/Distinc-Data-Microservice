import * as admin from 'firebase-admin';
import Middleware from '../middleware/Middleware';

Middleware.initAdminSDK();

const firestore = admin.firestore();

export default firestore;
