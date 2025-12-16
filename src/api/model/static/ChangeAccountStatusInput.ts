import type {UserStatus} from '../enums/';

export interface ChangeAccountStatusInput {
    readonly id?: string | undefined;
    readonly status: UserStatus;
}
