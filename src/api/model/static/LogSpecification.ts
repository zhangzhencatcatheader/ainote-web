import type {RequestMethod} from '../enums/';

export interface LogSpecification {
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
}
