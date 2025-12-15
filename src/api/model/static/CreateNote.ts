export interface CreateNote {
    readonly title: string;
    readonly content?: string | undefined;
    readonly filesIds: ReadonlyArray<string>;
    readonly aboutAccountIds: ReadonlyArray<string>;
}
