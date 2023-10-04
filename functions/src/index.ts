import * as express from 'express';
import * as functions from 'firebase-functions';
import Middleware from './global/middleware/Middleware';
import subRouteName from './subRouteName/endpoint/endpoint';

const app = express();
Middleware.initAdminSDK();
app.use(Middleware.corsSetup);
app.use(Middleware.verifyHeaders);
app.use(Middleware.verifyApiKey);

// API Endpoints:
app.post('/subRouteName', subRouteName);

// Export to Firebase Cloud Functions:
const routePrefixName = functions.https.onRequest(app);
export { routePrefixName };
