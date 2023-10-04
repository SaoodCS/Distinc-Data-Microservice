class ErrorThrower extends Error {
   constructor(
      message: string,
      public resCode: number,
   ) {
      super(message);
   }
}

export default ErrorThrower;
