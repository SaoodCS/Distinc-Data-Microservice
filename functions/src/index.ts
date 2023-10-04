import * as express from 'express';
import * as functions from 'firebase-functions';
import setSavingsAccount from './SetSavingsAccount/endpoint/endpoint';
import Middleware from './global/middleware/Middleware';

const app = express();
Middleware.initAdminSDK();
app.use(Middleware.corsSetup);
app.use(Middleware.verifyHeaders);
app.use(Middleware.verifyApiKey);

// API Endpoints:
app.post('/setSavingsAccount', setSavingsAccount);

// Export to Firebase Cloud Functions:
const dataService = functions.https.onRequest(app);
export { dataService };
