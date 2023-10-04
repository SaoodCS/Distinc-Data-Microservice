import Middleware from '../middleware/Middleware';
import firestore from './firestore';

Middleware.initAdminSDK();

class CollectionRef {
   static userDetails = firestore.collection('userDetails');
   static accountNumbers = firestore.collection('accountNumbers');
   static units = firestore.collection('units');
   static unitData = firestore.collection('unitData');
   static apiKeys = firestore.collection('apikeys');
}

export default CollectionRef;
