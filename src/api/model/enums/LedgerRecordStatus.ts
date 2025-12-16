export const LedgerRecordStatus_CONSTANTS = [
    'DRAFT', 
    'SUBMITTED', 
    'APPROVED', 
    'REJECTED'
] as const;
export type LedgerRecordStatus = typeof LedgerRecordStatus_CONSTANTS[number];
