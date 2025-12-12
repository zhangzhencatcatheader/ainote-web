import type {RoleEnum} from '../enums/';
import type {Dynamic_Account, Dynamic_Company} from './';

export interface Dynamic_AccountCompanyEntity {
    readonly account?: Dynamic_Account;
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
    readonly role?: RoleEnum;
    readonly choiceFlag?: boolean;
    readonly company?: Dynamic_Company;
}
