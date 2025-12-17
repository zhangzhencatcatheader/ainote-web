export interface RegisterInput {
    readonly username: string;
    readonly phone?: string | undefined;
    readonly password: string;
    readonly verCode: string;
    readonly verKey: string;
}
