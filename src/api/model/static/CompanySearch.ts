import type {CompanyStatus} from '../enums/';

export interface CompanySearch {
    readonly keywords?: string | undefined;
    readonly contact?: string | undefined;
    readonly status?: CompanyStatus | undefined;
}
