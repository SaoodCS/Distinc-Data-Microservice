import Middleware from '../middleware/Middleware';
import firestore from './firestore';

Middleware.initAdminSDK();

class CollectionRef {
   static userDetails = firestore.collection('userDetails');
   static expenses = firestore.collection('expenses');
   static income = firestore.collection('income');
   static bankAccounts = firestore.collection('bankAccounts');
   static savingsAccounts = firestore.collection('savingsAccounts');
   static currentAccounts = firestore.collection('currentAccounts');
   static calculations = firestore.collection('calculations');
}

export default CollectionRef;
