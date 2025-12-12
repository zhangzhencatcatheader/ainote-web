import type {RequestMethod} from '../enums/';

/**
 * 日志实体，用于系统审计和操作跟踪
 */
export interface LogSpecification {
    /**
     * 执行的操作（例如：CREATE、UPDATE、DELETE、LOGIN）
     */
    readonly action?: string | undefined;
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
}
