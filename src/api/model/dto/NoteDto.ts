import type {FileType, RoleEnum, UserStatus} from '../enums/';

export type NoteDto = {
    'NoteService/LIST_NOTE': {
        readonly id: string;
        /**
         * The tenant to which the current object belongs.
         * 
         * In this example, this property is not
         * explicitly modified by business code,
         * but is automatically modified by `DraftInterceptor`
         */
        readonly tenant: string;
        /**
         * The time when the object was created.
         * 
         * In this example, this property is not
         * explicitly modified by business code,
         * but is automatically modified by `DraftInterceptor`
         */
        readonly createdTime: string;
        /**
         * The time when the object was last modified
         * 
         * In this example, this property is not
         * explicitly modified by business code,
         * but is automatically modified by `DraftInterceptor`
         */
        readonly modifiedTime: string;
        readonly title: string;
        readonly content?: string | undefined;
        readonly lat?: number | undefined;
        readonly lng?: number | undefined;
        readonly files: ReadonlyArray<{
            readonly id: string;
            /**
             * The time when the object was created.
             * 
             * In this example, this property is not
             * explicitly modified by business code,
             * but is automatically modified by `DraftInterceptor`
             */
            readonly createdTime: string;
            /**
             * The time when the object was last modified
             * 
             * In this example, this property is not
             * explicitly modified by business code,
             * but is automatically modified by `DraftInterceptor`
             */
            readonly modifiedTime: string;
            /**
             * 文件名（存储在OSS中的名称）
             */
            readonly fileName: string;
            /**
             * 原始文件名
             */
            readonly originalName: string;
            /**
             * 文件大小（字节）
             */
            readonly fileSize: number;
            /**
             * 文件路径（OSS中的完整路径）
             */
            readonly filePath: string;
            /**
             * MIME类型
             */
            readonly mimeType?: string | undefined;
            /**
             * 文件类型枚举
             */
            readonly fileType?: FileType | undefined;
        }>;
        readonly aboutAccount: ReadonlyArray<{
            readonly id: string;
            /**
             * The time when the object was created.
             * 
             * In this example, this property is not
             * explicitly modified by business code,
             * but is automatically modified by `DraftInterceptor`
             */
            readonly createdTime: string;
            /**
             * The time when the object was last modified
             * 
             * In this example, this property is not
             * explicitly modified by business code,
             * but is automatically modified by `DraftInterceptor`
             */
            readonly modifiedTime: string;
            readonly username: string;
            readonly password: string;
            readonly email?: string | undefined;
            readonly phone: string;
            readonly status: UserStatus;
            readonly role: RoleEnum;
        }>;
    }
}
