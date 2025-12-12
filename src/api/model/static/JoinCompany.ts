import type {JoinCompany_TargetOf_accountCompanies} from './';

export interface JoinCompany {
    readonly id?: string | undefined;
    readonly accountCompanies: ReadonlyArray<JoinCompany_TargetOf_accountCompanies>;
}
