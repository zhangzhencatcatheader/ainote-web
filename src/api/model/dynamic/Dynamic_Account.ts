import type {RoleEnum, UserStatus} from '../enums/';
import type {Dynamic_AccountCompanyEntity, Dynamic_Note, Dynamic_StaticFile} from './';

export interface Dynamic_Account {
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
    readonly username?: string;
    readonly password?: string;
    readonly email?: string | undefined;
    readonly phone?: string;
    readonly status?: UserStatus;
    readonly role?: RoleEnum;
    readonly avatar?: Dynamic_StaticFile | undefined;
    readonly accountCompanies?: ReadonlyArray<Dynamic_AccountCompanyEntity>;
    readonly notes?: ReadonlyArray<Dynamic_Note>;
    readonly aboutNotes?: ReadonlyArray<Dynamic_Note>;
}
