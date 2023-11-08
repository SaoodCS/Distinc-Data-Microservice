class NumberHelpers {
   public static generateNo(lengthOfNo: number): number {
      const minNumber = Math.pow(10, lengthOfNo - 1);
      const maxNumber = Math.pow(10, lengthOfNo) - 1;
      const random = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
      return random;
   }

   public static generateUniqueNo(numberLength: number, existingNumbers: number[]): number {
      const randomNumber = NumberHelpers.generateNo(numberLength);
      if (existingNumbers.includes(randomNumber)) {
         return NumberHelpers.generateUniqueNo(numberLength, existingNumbers);
      }
      return randomNumber;
   }

   public static isStringNumber(str: string): boolean {
      // check if the string ONLY contains numbers in it. e.g. '123' is true, '0112' is true but '01a2' is false
      return /^\d+$/.test(str);
   }
}

export default NumberHelpers;
