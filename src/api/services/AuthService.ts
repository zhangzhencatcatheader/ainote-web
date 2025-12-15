import type {Executor} from '../';
import type {AuthResponse, LoginInput, RegisterInput} from '../model/static/';

/**
 * 认证服务
 * 提供用户认证相关的REST API接口
 */
export class AuthService {
    
    private executor: Executor

    constructor(executor: Executor) {
        this.executor = executor
    }
    
    /**
     * 用户登录
     * @parameter {AuthServiceOptions['login']} options
     * - input 登录信息（用户名和密码）
     * @return 认证响应（包含token和用户信息）
     */
    readonly login: (options: AuthServiceOptions['login']) => Promise<
        AuthResponse
    > = async(options) => {
        let _uri = '/auth/login';
        let _separator = _uri.indexOf('?') === -1 ? '?' : '&';
        let _value: any = undefined;
        _value = options.input.username;
        _uri += _separator
        _uri += 'username='
        _uri += encodeURIComponent(_value);
        _separator = '&';
        _value = options.input.password;
        _uri += _separator
        _uri += 'password='
        _uri += encodeURIComponent(_value);
        _separator = '&';
        return (await this.executor({uri: _uri, method: 'POST'})) as Promise<AuthResponse>;
    }
    
    /**
     * 用户注册
     * @parameter {AuthServiceOptions['register']} options
     * - input 注册信息（用户名、密码等）
     * @return 认证响应（包含token和用户信息）
     */
    readonly register: (options: AuthServiceOptions['register']) => Promise<
        AuthResponse
    > = async(options) => {
        let _uri = '/auth/register';
        let _separator = _uri.indexOf('?') === -1 ? '?' : '&';
        let _value: any = undefined;
        _value = options.input.username;
        _uri += _separator
        _uri += 'username='
        _uri += encodeURIComponent(_value);
        _separator = '&';
        _value = options.input.phone;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'phone='
            _uri += encodeURIComponent(_value);
            _separator = '&';
        }
        _value = options.input.password;
        _uri += _separator
        _uri += 'password='
        _uri += encodeURIComponent(_value);
        _separator = '&';
        return (await this.executor({uri: _uri, method: 'POST'})) as Promise<AuthResponse>;
    }
}

export type AuthServiceOptions = {
    'login': {
        /**
         * 登录信息（用户名和密码）
         */
        readonly input: LoginInput
    }, 
    'register': {
        /**
         * 注册信息（用户名、密码等）
         */
        readonly input: RegisterInput
    }
}
