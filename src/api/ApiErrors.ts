export type AllErrors = {
        family: 'ACCOUNT', 
        code: 'USERNAME_ALREADY_EXISTS'
    } | {
        family: 'ACCOUNT', 
        code: 'USERNAME_DOES_NOT_EXIST'
    } | {
        family: 'ACCOUNT', 
        code: 'PHONE_DOES_NOT_EXIST'
    } | {
        family: 'ACCOUNT', 
        code: 'UNAUTHORIZED'
    } | {
        family: 'ACCOUNT', 
        code: 'PASSWORD_IS_ERROR'
    } | {
        family: 'ACCOUNT', 
        code: 'CAPTCHA_IS_ERROR'
    } | {
        family: 'ACCOUNT', 
        code: 'SMS_SEND_TOO_FREQUENT'
    } | {
        family: 'ACCOUNT', 
        code: 'SMS_CODE_EXPIRED'
    } | {
        family: 'ACCOUNT', 
        code: 'SMS_CODE_IS_ERROR'
    } | {
        family: 'ACCOUNT', 
        code: 'USER_IS_THIS_COMPANY_ADMIN'
    } | {
        family: 'ACCOUNT', 
        code: 'NOT_IN_COMPANY'
    };
export type ApiErrors = {
    'accountService': {
    }, 
    'aiService': {
    }, 
    'authService': {
        'login': AllErrors & ({
                family: 'ACCOUNT', 
                code: 'USERNAME_ALREADY_EXISTS', 
                readonly [key:string]: any
            } | {
                family: 'ACCOUNT', 
                code: 'USERNAME_DOES_NOT_EXIST', 
                readonly [key:string]: any
            } | {
                family: 'ACCOUNT', 
                code: 'PHONE_DOES_NOT_EXIST', 
                readonly [key:string]: any
            } | {
                family: 'ACCOUNT', 
                code: 'UNAUTHORIZED', 
                readonly [key:string]: any
            } | {
                family: 'ACCOUNT', 
                code: 'PASSWORD_IS_ERROR', 
                readonly [key:string]: any
            } | {
                family: 'ACCOUNT', 
                code: 'CAPTCHA_IS_ERROR', 
                readonly [key:string]: any
            } | {
                family: 'ACCOUNT', 
                code: 'SMS_SEND_TOO_FREQUENT', 
                readonly [key:string]: any
            } | {
                family: 'ACCOUNT', 
                code: 'SMS_CODE_EXPIRED', 
                readonly [key:string]: any
            } | {
                family: 'ACCOUNT', 
                code: 'SMS_CODE_IS_ERROR', 
                readonly [key:string]: any
            } | {
                family: 'ACCOUNT', 
                code: 'USER_IS_THIS_COMPANY_ADMIN', 
                readonly [key:string]: any
            } | {
                family: 'ACCOUNT', 
                code: 'NOT_IN_COMPANY', 
                readonly [key:string]: any
            })
    }, 
    'companyService': {
    }, 
    'logService': {
    }, 
    'noteService': {
    }, 
    'ossService': {
    }, 
    'templateService': {
    }
};
