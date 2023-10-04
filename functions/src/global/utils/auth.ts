import * as admin from 'firebase-admin';
import Middleware from '../middleware/Middleware';

Middleware.initAdminSDK();

const auth = admin.auth();

export default auth;
