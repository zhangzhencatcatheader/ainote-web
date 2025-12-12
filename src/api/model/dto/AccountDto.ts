import type {RoleEnum} from '../enums/';

export type AccountDto = {
    'AccountService/SIMPLE_ACCOUNT': {
        readonly id: string;
        readonly username: string;
        readonly phone?: string | undefined;
        readonly role: RoleEnum;
        readonly companies: ReadonlyArray<{
            readonly id: string;
            readonly name: string;
        }>;
        readonly accountCompanies: ReadonlyArray<{
            readonly id: string;
            readonly role: RoleEnum;
            readonly company: {
                readonly id: string;
                readonly name: string;
            };
        }>;
    }
}
