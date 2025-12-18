import type {Executor} from '../';
import type {
    AuthResponse, 
    AuthService_CaptchaResponse, 
    LoginInput, 
    RegisterInput, 
    SendSmsCodeInput, 
    SmsLoginInput, 
    SmsVerifyCodeService_SmsSendResult
} from '../model/static/';

/**
 * 认证服务
 * 提供用户认证相关的REST API接口
 */
export class AuthService {
    
    constructor(private executor: Executor) {}
    
    readonly captcha: () => Promise<
        AuthService_CaptchaResponse
    > = async() => {
        let _uri = '/auth/captcha';
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<AuthService_CaptchaResponse>;
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
        return (await this.executor({uri: _uri, method: 'POST', body: options.body})) as Promise<AuthResponse>;
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
        return (await this.executor({uri: _uri, method: 'POST', body: options.body})) as Promise<AuthResponse>;
    }
    
    readonly sendSms: (options: AuthServiceOptions['sendSms']) => Promise<
        SmsVerifyCodeService_SmsSendResult
    > = async(options) => {
        let _uri = '/auth/sms/send';
        return (await this.executor({uri: _uri, method: 'POST', body: options.body})) as Promise<SmsVerifyCodeService_SmsSendResult>;
    }
    
    readonly smsLogin: (options: AuthServiceOptions['smsLogin']) => Promise<
        AuthResponse
    > = async(options) => {
        let _uri = '/auth/sms/login';
        return (await this.executor({uri: _uri, method: 'POST', body: options.body})) as Promise<AuthResponse>;
    }
}

export type AuthServiceOptions = {
    'login': {
        /**
         * 登录信息（用户名和密码）
         */
        readonly body: LoginInput
    }, 
    'register': {
        /**
         * 注册信息（用户名、密码等）
         */
        readonly body: RegisterInput
    }, 
    'sendSms': {
        readonly body: SendSmsCodeInput
    }, 
    'smsLogin': {
        readonly body: SmsLoginInput
    }, 
    'captcha': {}
}
