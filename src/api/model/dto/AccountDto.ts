import type {FileType, RoleEnum} from '../enums/';

export type AccountDto = {
    'AccountService/SIMPLE_ACCOUNT': {
        readonly id: string;
        readonly username: string;
        readonly phone?: string | undefined;
        readonly role: RoleEnum;
        readonly avatar?: {
            readonly id: string;
            /**
             * 文件路径（OSS中的完整路径）
             */
            readonly filePath: string;
            /**
             * 文件名（存储在OSS中的名称）
             */
            readonly fileName: string;
            /**
             * 文件类型枚举
             */
            readonly fileType?: FileType | undefined;
        } | undefined;
        readonly accountCompanies: ReadonlyArray<{
            readonly id: string;
            readonly choiceFlag: boolean;
            readonly role: RoleEnum;
            readonly company: {
                readonly id: string;
                readonly tenant: string;
                readonly name: string;
            };
        }>;
    }
}
