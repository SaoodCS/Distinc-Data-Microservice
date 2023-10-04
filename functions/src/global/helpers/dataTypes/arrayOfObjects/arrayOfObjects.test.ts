import ArrayOfObjects from './arrayOfObjects';

describe('objectsWithVal', () => {
   it('1. should return an array of object(s) that include a predefined value', () => {
      const microservices = [
         { service: 'user', url: '/user', los: 2 },
         { service: 'registration', url: '/registration', los: 1 },
         { service: 'billing', url: '/billing', los: 1 },
      ];

      const result = ArrayOfObjects.objectsWithVal(microservices, 'user');
      expect(result).toEqual([{ service: 'user', url: '/user', los: 2 }]);
   });

   it('2. should return an error object if no objects include a predefined value', () => {
      const microservices = [
         { service: 'user', url: '/user', los: 2 },
         { service: 'registration', url: '/registration', los: 1 },
         { service: 'billing', url: '/billing', los: 1 },
      ];

      const result = ArrayOfObjects.objectsWithVal(microservices, 'dummy');
      expect(result).toHaveProperty('error');
   });
});

describe('objectWithVal', () => {
   it('1. should return an object that includes a predefined value', () => {
      const microservices = [
         { service: 'user', url: '/user', los: 2 },
         { service: 'registration', url: '/registration', los: 1 },
         { service: 'billing', url: '/billing', los: 1 },
      ];

      const result = ArrayOfObjects.objectWithVal(microservices, 'user');
      expect(result).toEqual({ service: 'user', url: '/user', los: 2 });
   });

   it('2. should return an error object if no objects include a predefined value', () => {
      const microservices = [
         { service: 'user', url: '/user', los: 2 },
         { service: 'registration', url: '/registration', los: 1 },
         { service: 'billing', url: '/billing', los: 1 },
      ];

      const result = ArrayOfObjects.objectWithVal(microservices, 'dummy');
      expect(result).toHaveProperty('error');
   });

   it('3. should return an error object if there is more than one object with the predefined property value', () => {
      const microservices = [
         { service: 'user', url: '/user', los: 2 },
         { service: 'registration', url: '/registration', los: 1 },
         { service: 'billing', url: '/billing', los: 1 },
         { service: 'user', url: '/user', los: 1 },
      ];

      const result = ArrayOfObjects.objectWithVal(microservices, 'user');
      expect(result).toEqual({
         error: 'Multiple Objects Found With Val: user.',
      });
   });
});
