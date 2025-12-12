import type {CompanyStatus} from '../enums/';
import type {Dynamic_Account, Dynamic_AccountCompanyEntity} from './';

export interface Dynamic_Company {
    /**
     * The time when the object was created.
     * 
     * In this example, this property is not
     * explicitly modified by business code,
     * but is automatically modified by `DraftInterceptor`
     */
    readonly createdTime?: string;
    /**
     * The time when the object was last modified
     * 
     * In this example, this property is not
     * explicitly modified by business code,
     * but is automatically modified by `DraftInterceptor`
     */
    readonly modifiedTime?: string;
    readonly id?: string;
    readonly name?: string;
    readonly code?: string;
    readonly phone?: string | undefined;
    readonly address?: string | undefined;
    readonly contact?: string | undefined;
    readonly status?: CompanyStatus;
    readonly tenant?: string;
    readonly accountCompanies?: ReadonlyArray<Dynamic_AccountCompanyEntity>;
    readonly accounts?: ReadonlyArray<Dynamic_Account>;
}
