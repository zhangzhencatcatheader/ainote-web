export interface AccountService_ResetPasswordInput {
    readonly phone: string;
    readonly code: string;
    readonly scene: string;
    readonly newPassword: string;
}
