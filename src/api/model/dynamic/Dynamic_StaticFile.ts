import type {FileType} from '../enums/';
import type {Dynamic_Account} from './';

export interface Dynamic_StaticFile {
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
    /**
     * 文件名（存储在OSS中的名称）
     */
    readonly fileName?: string;
    /**
     * 原始文件名
     */
    readonly originalName?: string;
    /**
     * 文件大小（字节）
     */
    readonly fileSize?: number;
    /**
     * 文件路径（OSS中的完整路径）
     */
    readonly filePath?: string;
    /**
     * MIME类型
     */
    readonly mimeType?: string | undefined;
    /**
     * 文件类型枚举
     */
    readonly fileType?: FileType | undefined;
    /**
     * 上传者ID（关联到Account）
     */
    readonly uploaderId?: string | undefined;
    /**
     * 上传者关系（可选）
     */
    readonly uploader?: Dynamic_Account | undefined;
}
