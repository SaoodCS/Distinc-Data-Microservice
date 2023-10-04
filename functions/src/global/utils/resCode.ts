export const resCodes = {
   OK: {
      code: 200,
      prefix: 'Success',
   },
   BAD_REQUEST: {
      code: 400,
      prefix: 'Client (Bad Request)',
   },
   UNAUTHORIZED: {
      code: 401,
      prefix: 'Client (Unauthorized)',
   },
   NOT_FOUND: {
      code: 404,
      prefix: 'Client (Not Found)',
   },
   INTERNAL_SERVER: {
      code: 500,
      prefix: 'Server (Internal Server)',
   },
   BAD_GATEWAY: {
      code: 502,
      prefix: 'Server (Bad Gateway)',
   },
   GATEWAY_TIMEOUT: {
      code: 504,
      prefix: 'Server (Gateway Timeout)',
   },
};
