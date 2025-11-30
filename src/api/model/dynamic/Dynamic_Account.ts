import type {RoleEnum, UserStatus} from '../enums/';

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
    readonly phone?: string | undefined;
    readonly status?: UserStatus;
    readonly role?: RoleEnum;
}
