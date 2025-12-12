import type {CompanyStatus} from '../enums/';

/**
 * Company entity
 */
export interface CompanySearch {
    readonly keywords?: string | undefined;
    readonly status?: CompanyStatus | undefined;
}
