import * as express from 'express';
import * as functions from 'firebase-functions';
import setSavingsAccount from './SetSavingsAccount/endpoint/endpoint';
import deleteCalculations from './deleteCalculations/endpoint/endpoint';
import deleteCurrentAccount from './deleteCurrentAccount/endpoint/endpoint';
import deleteExpense from './deleteExpense/endpoint/endpoint';
import deleteIncome from './deleteIncome/endpoint/endpoint';
import deleteSavingsAccount from './deleteSavingsAccount/endpoint/endpoint';
import getCalculations from './getCalculations/endpoint/endpoint';
import getCurrentAccount from './getCurrentAccount/endpoint/endpoint';
import getExpenses from './getExpense/endpoint/endpoint';
import getIncomes from './getIncomes/endpoint/endpoint';
import getSavingsAccount from './getSavingsAccount/endpoint/endpoint';
import Middleware from './global/middleware/Middleware';
import setCalculations from './setCalculations/endpoint/endpoint';
import setCurrentAccount from './setCurrentAccount/endpoint/endpoint';
import setExpense from './setExpense/endpoint/endpoint';
import setIncome from './setIncome/endpoint/endpoint';

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
app.post('/deleteExpense', deleteExpense);
app.get('/getExpenses', getExpenses);

app.post('/setIncome', setIncome);
app.post('/deleteIncome', deleteIncome);
app.get('/getIncomes', getIncomes);

app.post('/setCalculations', setCalculations);
app.post('/deleteCalculations', deleteCalculations);
app.get('/getCalculations', getCalculations);

// Export to Firebase Cloud Functions:
const dataService = functions.https.onRequest(app);
export { dataService };
