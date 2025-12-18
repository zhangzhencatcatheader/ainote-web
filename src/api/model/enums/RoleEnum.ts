export const RoleEnum_CONSTANTS = [
    'ADMIN', 
    'COMPANYADMIN', 
    'USER'
] as const;
export type RoleEnum = typeof RoleEnum_CONSTANTS[number];
