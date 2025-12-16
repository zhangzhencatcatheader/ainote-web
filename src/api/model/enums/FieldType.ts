export const FieldType_CONSTANTS = [
    'TEXT', 
    'TEXTAREA', 
    'NUMBER', 
    'INTEGER', 
    'DECIMAL', 
    'DATE', 
    'DATETIME', 
    'TIME', 
    'BOOLEAN', 
    'SELECT', 
    'MULTISELECT', 
    'FILE', 
    'EMAIL', 
    'PHONE', 
    'URL'
] as const;
export type FieldType = typeof FieldType_CONSTANTS[number];
