export const RequestMethod_CONSTANTS = [
    'GET', 
    'POST', 
    'PUT', 
    'DELETE', 
    'PATCH', 
    'HEAD', 
    'OPTIONS'
] as const;
export type RequestMethod = typeof RequestMethod_CONSTANTS[number];
