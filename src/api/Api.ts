import type {Executor} from './';
import {
    AccountService, 
    AuthService, 
    CompanyService, 
    LogService, 
    NoteService, 
    OssService
} from './services/';

export class Api {
    
    readonly accountService: AccountService
    
    readonly authService: AuthService
    
    readonly companyService: CompanyService
    
    readonly logService: LogService
    
    readonly noteService: NoteService
    
    readonly ossService: OssService
    
    constructor(executor: Executor) {
        this.accountService = new AccountService(executor);
        this.authService = new AuthService(executor);
        this.companyService = new CompanyService(executor);
        this.logService = new LogService(executor);
        this.noteService = new NoteService(executor);
        this.ossService = new OssService(executor);
    }
}