import type {Dynamic_Account, Dynamic_StaticFile} from './';

export interface Dynamic_Note {
    readonly account?: Dynamic_Account;
    /**
     * The tenant to which the current object belongs.
     * 
     * In this example, this property is not
     * explicitly modified by business code,
     * but is automatically modified by `DraftInterceptor`
     */
    readonly tenant?: string;
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
    readonly title?: string;
    readonly content?: string | undefined;
    readonly files?: ReadonlyArray<Dynamic_StaticFile>;
    readonly lat?: number | undefined;
    readonly lng?: number | undefined;
    readonly aboutAccount?: ReadonlyArray<Dynamic_Account>;
}
