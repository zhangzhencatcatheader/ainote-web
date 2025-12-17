export type AllErrors = {
        family: 'ACCOUNT', 
        code: 'USERNAME_ALREADY_EXISTS'
    } | {
        family: 'ACCOUNT', 
        code: 'USERNAME_DOES_NOT_EXIST'
    } | {
        family: 'ACCOUNT', 
        code: 'UNAUTHORIZED'
    } | {
        family: 'ACCOUNT', 
        code: 'PASSWORD_IS_ERROR'
    } | {
        family: 'ACCOUNT', 
        code: 'CAPTCHA_IS_ERROR'
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
