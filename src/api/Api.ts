import type {Executor} from './';
import {
    AccountService, 
    AiService, 
    AuthService, 
    CompanyService, 
    LogService, 
    NoteService, 
    OssService, 
    TemplateService
} from './services/';

export class Api {
    
    readonly accountService: AccountService
    
    readonly aiService: AiService
    
    readonly authService: AuthService
    
    readonly companyService: CompanyService
    
    readonly logService: LogService
    
    readonly noteService: NoteService
    
    readonly ossService: OssService
    
    readonly templateService: TemplateService
    
    constructor(executor: Executor) {
        this.accountService = new AccountService(executor);
        this.aiService = new AiService(executor);
        this.authService = new AuthService(executor);
        this.companyService = new CompanyService(executor);
        this.logService = new LogService(executor);
        this.noteService = new NoteService(executor);
        this.ossService = new OssService(executor);
        this.templateService = new TemplateService(executor);
    }
}