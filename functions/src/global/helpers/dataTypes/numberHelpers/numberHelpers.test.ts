import NumberHelpers from './numberHelpers';

describe('generateNo', () => {
   it('should generate a number of length 8', () => {
      const result = NumberHelpers.generateNo(8);
      expect(result.toString().length).toBe(8);
   });
   it('should generate a number of length 1', () => {
      const result = NumberHelpers.generateNo(1);
      expect(result.toString().length).toBe(1);
   });
});

describe('generateUniqueNo', () => {
   it('should generate a unique number of a given length not already in the existingNumbers array', () => {
      const existingNumbers = [123, 456, 789];
      const result = NumberHelpers.generateUniqueNo(3, existingNumbers);
      expect(result).not.toBe(123);
      expect(result).not.toBe(456);
      expect(result).not.toBe(789);
      expect(result.toString().length).toBe(3);
   });
   it('should generate a unique number of a given length when an empty existingNumbers array is passed through', () => {
      const existingNumbers: number[] = [];
      const result = NumberHelpers.generateUniqueNo(3, existingNumbers);
      expect(result.toString().length).toBe(3);
   });
});

// it boiler:
// 	it('should', () => {});
