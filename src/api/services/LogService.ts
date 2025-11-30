import type {Executor} from '../';
import type {Dynamic_Log} from '../model/dynamic/';

/**
 * 日志服务 - 用于管理审计日志
 *  
 * 提供REST API用于查询和创建系统日志
 */
export class LogService {
    
    constructor(private executor: Executor) {}
    
    /**
     * 根据ID删除日志
     * @parameter {LogServiceOptions['delete']} options
     * - id 日志ID
     */
    readonly delete: (options: LogServiceOptions['delete']) => Promise<
        void
    > = async(options) => {
        let _uri = '/log/';
        _uri += encodeURIComponent(options.id);
        return (await this.executor({uri: _uri, method: 'DELETE'})) as Promise<void>;
    }
    
    /**
     * 获取所有日志
     * @return 日志列表
     */
    readonly findAll: () => Promise<
        ReadonlyArray<Dynamic_Log>
    > = async() => {
        let _uri = '/log';
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<ReadonlyArray<Dynamic_Log>>;
    }
    
    /**
     * 根据用户ID获取日志
     * @parameter {LogServiceOptions['findByAccountId']} options
     * - accountId 账户ID
     * @return 该用户的日志列表
     */
    readonly findByAccountId: (options: LogServiceOptions['findByAccountId']) => Promise<
        ReadonlyArray<Dynamic_Log>
    > = async(options) => {
        let _uri = '/log/account/';
        _uri += encodeURIComponent(options.accountId);
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<ReadonlyArray<Dynamic_Log>>;
    }
    
    /**
     * 根据ID获取日志
     * @parameter {LogServiceOptions['findById']} options
     * - id 日志ID
     * @return 日志对象，如果不存在则返回null
     */
    readonly findById: (options: LogServiceOptions['findById']) => Promise<
        Dynamic_Log | undefined
    > = async(options) => {
        let _uri = '/log/';
        _uri += encodeURIComponent(options.id);
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<Dynamic_Log | undefined>;
    }
    
    /**
     * 获取最新的日志（按创建时间降序）
     * @parameter {LogServiceOptions['findLatestLogs']} options
     * - limit 限制数量，默认10条
     * @return 最新的日志列表
     */
    readonly findLatestLogs: (options: LogServiceOptions['findLatestLogs']) => Promise<
        ReadonlyArray<Dynamic_Log>
    > = async(options) => {
        let _uri = '/log/latest';
        let _separator = _uri.indexOf('?') === -1 ? '?' : '&';
        let _value: any = undefined;
        _value = options.limit;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'limit='
            _uri += encodeURIComponent(_value);
            _separator = '&';
        }
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<ReadonlyArray<Dynamic_Log>>;
    }
}

export type LogServiceOptions = {
    'findAll': {}, 
    'findById': {
        /**
         * 日志ID
         */
        readonly id: string
    }, 
    'findByAccountId': {
        /**
         * 账户ID
         */
        readonly accountId: string
    }, 
    'findLatestLogs': {
        /**
         * 限制数量，默认10条
         */
        readonly limit?: number | undefined
    }, 
    'delete': {
        /**
         * 日志ID
         */
        readonly id: string
    }
}
