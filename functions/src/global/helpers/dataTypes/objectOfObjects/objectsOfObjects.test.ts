import ObjectOfObjects from './objectOfObjects';

describe('findObjectByKeyValue', () => {
   it('should return the object that matches the key value pair passed through', () => {
      const resCodes = {
         OK: {
            code: 200,
            prefix: 'Success',
         },
         BAD_REQUEST: {
            code: 400,
            prefix: 'Client (Bad Request)',
         },
         GATEWAY_TIMEOUT: {
            code: 504,
            prefix: 'Server (Gateway Timeout)',
         },
      };
      const result = ObjectOfObjects.findObjectByKeyValue(resCodes, 'code', 200);
      expect(result).toEqual({
         code: 200,
         prefix: 'Success',
      });
   });
   it('should return an object with an error prop if there are no objects that match the key value pair', () => {
      const resCodes = {
         OK: {
            code: 200,
            prefix: 'Success',
         },
         BAD_REQUEST: {
            code: 400,
            prefix: 'Client (Bad Request)',
         },
         GATEWAY_TIMEOUT: {
            code: 504,
            prefix: 'Server (Gateway Timeout)',
         },
      };
      const result = ObjectOfObjects.findObjectByKeyValue(resCodes, 'code', 201);
      expect(result).toEqual({
         error: `findObjectByKeyValue: No object found with key '${String(
            'code',
         )}' and value '${201}'`,
      });
   });
});
