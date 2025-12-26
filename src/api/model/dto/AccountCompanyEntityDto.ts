import type {RoleEnum} from '../enums/';

export type AccountCompanyEntityDto = {
    'CompanyService/COMPANY_MEMBER': {
        readonly id: string;
        readonly role: RoleEnum;
        readonly account: {
            readonly id: string;
            readonly username: string;
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
            } | undefined;
        };
    }
}
