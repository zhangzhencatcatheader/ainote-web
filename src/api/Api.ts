import type {Executor} from './';
import {
    AuthService, 
    LogService, 
    NoteService, 
    OssService
} from './services/';

export class Api {
    
    readonly authService: AuthService
    
    readonly logService: LogService
    
    readonly noteService: NoteService
    
    readonly ossService: OssService
    
    constructor(executor: Executor) {
        this.authService = new AuthService(executor);
        this.logService = new LogService(executor);
        this.noteService = new NoteService(executor);
        this.ossService = new OssService(executor);
    }
}