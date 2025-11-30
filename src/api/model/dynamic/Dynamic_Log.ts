import type {RequestMethod} from '../enums/';
import type {Dynamic_Account} from './';

export interface Dynamic_Log {
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
     * 执行操作的账户
     */
    readonly accountId?: string | undefined;
    /**
     * 执行的操作（例如：CREATE、UPDATE、DELETE、LOGIN）
     */
    readonly action?: string;
    /**
     * 受操作影响的目标实体类型
     */
    readonly targetEntity?: string | undefined;
    /**
     * 受操作影响的实体ID
     */
    readonly entityId?: string | undefined;
    /**
     * 请求的IP地址
     */
    readonly ipAddress?: string | undefined;
    /**
     * 请求的User Agent
     */
    readonly userAgent?: string | undefined;
    /**
     * HTTP请求方法
     */
    readonly requestMethod?: RequestMethod | undefined;
    /**
     * 请求URL
     */
    readonly requestUrl?: string | undefined;
    /**
     * HTTP响应状态码
     */
    readonly responseStatus?: number | undefined;
    /**
     * 错误信息（如有）
     */
    readonly errorMessage?: string | undefined;
    /**
     * 账户关系（可选）
     */
    readonly account?: Dynamic_Account | undefined;
}
