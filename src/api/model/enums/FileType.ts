export const FileType_CONSTANTS = [
    'IMAGE', 
    'VIDEO', 
    'AUDIO', 
    'DOCUMENT', 
    'SPREADSHEET', 
    'PRESENTATION', 
    'ARCHIVE', 
    'CODE', 
    'OTHER'
] as const;
export type FileType = typeof FileType_CONSTANTS[number];
