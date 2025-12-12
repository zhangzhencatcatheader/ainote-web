import type {UpdateInput_TargetOf_accountCompanies} from './';

export interface UpdateInput {
    readonly id?: string | undefined;
    readonly username: string;
    readonly phone?: string | undefined;
    readonly accountCompanies: ReadonlyArray<UpdateInput_TargetOf_accountCompanies>;
}
