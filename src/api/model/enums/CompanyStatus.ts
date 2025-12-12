export const CompanyStatus_CONSTANTS = [
    'INACTIVE', 
    'ACTIVE', 
    'SUSPENDED', 
    'PENDING', 
    'DELETED'
] as const;
export type CompanyStatus = typeof CompanyStatus_CONSTANTS[number];
