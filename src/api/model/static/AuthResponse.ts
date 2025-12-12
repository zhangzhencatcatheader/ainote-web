export interface AuthResponse {
    readonly id: string;
    readonly token: string;
    readonly role: string;
    readonly tenant: string;
}
