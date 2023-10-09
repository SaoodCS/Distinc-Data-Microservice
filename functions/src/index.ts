import * as express from 'express';
import * as functions from 'firebase-functions';
import setSavingsAccount from './SetSavingsAccount/endpoint/endpoint';
import deleteCurrentAccount from './deleteCurrentAccount/endpoint/endpoint';
import deleteSavingsAccount from './deleteSavingsAccount/endpoint/endpoint';
import getCurrentAccount from './getCurrentAccount/endpoint/endpoint';
import getSavingsAccount from './getSavingsAccount/endpoint/endpoint';
import Middleware from './global/middleware/Middleware';
import setCurrentAccount from './setCurrentAccount/endpoint/endpoint';
import setExpense from './setExpense/endpoint/endpoint';

const app = express();
Middleware.initAdminSDK();
app.use(Middleware.corsSetup);
app.use(Middleware.verifyHeaders);
app.use(Middleware.verifyApiKey);

// API Endpoints:
app.post('/setSavingsAccount', setSavingsAccount);
app.post('/deleteSavingsAccount', deleteSavingsAccount);
app.get('/getSavingsAccount', getSavingsAccount);
app.post('/setCurrentAccount', setCurrentAccount);
app.post('/deleteCurrentAccount', deleteCurrentAccount);
app.get('/getCurrentAccount', getCurrentAccount);

app.post('/setExpense', setExpense);

// Export to Firebase Cloud Functions:
const dataService = functions.https.onRequest(app);
export { dataService };
