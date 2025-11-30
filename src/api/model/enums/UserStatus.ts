export const UserStatus_CONSTANTS = [
    'INACTIVE', 
    'ACTIVE', 
    'LOCKED', 
    'PENDING', 
    'DELETED'
] as const;
export type UserStatus = typeof UserStatus_CONSTANTS[number];
