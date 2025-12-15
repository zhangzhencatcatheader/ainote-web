import type {Executor} from '../';
import type {AccountDto} from '../model/dto/';
import type {Dynamic_Account} from '../model/dynamic/';
import type {
    AccountSearch, 
    JoinCompany, 
    KSimpleSaveResult, 
    Page, 
    UpdateInput
} from '../model/static/';

/**
 * 用户服务
 * 提供用户认证相关的REST API接口
 */
export class AccountService {
    
    private executor: Executor

    constructor(executor: Executor) {
        this.executor = executor
    }
    
    /**
     * 加入企业
     */
    readonly joinCompany: (options: AccountServiceOptions['joinCompany']) => Promise<
        string
    > = async(options) => {
        let _uri = '/account/joinCompany';
        return (await this.executor({uri: _uri, method: 'POST', body: options.body})) as Promise<string>;
    }
    
    /**
     * 获取我的个人信息
     */
    readonly me: () => Promise<
        AccountDto['AccountService/SIMPLE_ACCOUNT'] | undefined
    > = async() => {
        let _uri = '/account/me';
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<AccountDto['AccountService/SIMPLE_ACCOUNT'] | undefined>;
    }
    
    readonly page: (options: AccountServiceOptions['page']) => Promise<
        Page<AccountDto['AccountService/SIMPLE_ACCOUNT']>
    > = async(options) => {
        let _uri = '/account/page';
        let _separator = _uri.indexOf('?') === -1 ? '?' : '&';
        let _value: any = undefined;
        _value = options.search.keyword;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'keyword='
            _uri += encodeURIComponent(_value);
            _separator = '&';
        }
        _value = options.search.status;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'status='
            _uri += encodeURIComponent(_value);
            _separator = '&';
        }
        _value = options.search.role;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'role='
            _uri += encodeURIComponent(_value);
            _separator = '&';
        }
        _value = options.pageIndex;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'pageIndex='
            _uri += encodeURIComponent(_value);
            _separator = '&';
        }
        _value = options.pageSize;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'pageSize='
            _uri += encodeURIComponent(_value);
            _separator = '&';
        }
        _value = options.sortCode;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'sortCode='
            _uri += encodeURIComponent(_value);
            _separator = '&';
        }
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<Page<AccountDto['AccountService/SIMPLE_ACCOUNT']>>;
    }
    
    /**
     * 修改个人信息
     */
    readonly update: (options: AccountServiceOptions['update']) => Promise<
        KSimpleSaveResult<Dynamic_Account>
    > = async(options) => {
        let _uri = '/account/update';
        return (await this.executor({uri: _uri, method: 'PUT', body: options.body})) as Promise<KSimpleSaveResult<Dynamic_Account>>;
    }
}

export type AccountServiceOptions = {
    'me': {}, 
    'page': {
        readonly pageIndex?: number | undefined, 
        readonly pageSize?: number | undefined, 
        readonly sortCode?: string | undefined, 
        readonly search: AccountSearch
    }, 
    'update': {
        readonly body: UpdateInput
    }, 
    'joinCompany': {
        readonly body: JoinCompany
    }
}
