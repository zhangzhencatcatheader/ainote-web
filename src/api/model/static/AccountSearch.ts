import type {RoleEnum, UserStatus} from '../enums/';

export interface AccountSearch {
    readonly keyword?: string | undefined;
    readonly status?: UserStatus | undefined;
    readonly role?: RoleEnum | undefined;
}
