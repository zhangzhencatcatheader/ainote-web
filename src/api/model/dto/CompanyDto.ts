import type {RoleEnum} from '../enums/';

export type CompanyDto = {
    'CompanyService/COMPANY_NAME': {
        readonly id: string;
        readonly name: string;
    }, 
    'CompanyService/LIST_COMPANY': {
        readonly id: string;
        readonly name: string;
        readonly code: string;
        readonly address?: string | undefined;
        readonly tenant: string;
        readonly contact?: string | undefined;
        readonly accountCompanies: ReadonlyArray<{
            readonly id: string;
            readonly account: {
                readonly id: string;
                readonly username: string;
            };
            readonly role: RoleEnum;
        }>;
    }
}
