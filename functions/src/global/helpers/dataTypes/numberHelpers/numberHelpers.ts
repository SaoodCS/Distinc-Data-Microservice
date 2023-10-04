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
}

export default NumberHelpers;
