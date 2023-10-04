export function isRunningLocally(): boolean {
   return process.env.FUNCTIONS_EMULATOR === 'true';
}
