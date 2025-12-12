import type {Executor} from '../';
import type {AccountDto} from '../model/dto/';
import type {Dynamic_Account} from '../model/dynamic/';
import type {JoinCompany, KSimpleSaveResult, UpdateInput} from '../model/static/';

/**
 * 用户服务
 * 提供用户认证相关的REST API接口
 */
export class AccountService {
    
    constructor(private executor: Executor) {}
    
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
    'update': {
        readonly body: UpdateInput
    }, 
    'joinCompany': {
        readonly body: JoinCompany
    }
}
