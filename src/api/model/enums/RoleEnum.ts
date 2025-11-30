export const RoleEnum_CONSTANTS = [
    'ADMIN', 
    'USER'
] as const;
export type RoleEnum = typeof RoleEnum_CONSTANTS[number];
