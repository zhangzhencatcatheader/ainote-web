import type {CompanyStatus} from '../enums/';

export interface CompanyAddInput {
    readonly name: string;
    readonly code: string;
    readonly phone?: string | undefined;
    readonly address?: string | undefined;
    readonly contact?: string | undefined;
    readonly status: CompanyStatus;
    readonly tenant: string;
}
