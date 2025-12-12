import type {Executor} from '../';
import type {CreateNote} from '../model/static/';

/**
 * 笔记服务
 */
export class NoteService {
    
    constructor(private executor: Executor) {}
    
    /**
     * 创建一条笔记
     */
    readonly add: (options: NoteServiceOptions['add']) => Promise<
        string
    > = async(options) => {
        let _uri = '/note/add';
        return (await this.executor({uri: _uri, method: 'POST', body: options.body})) as Promise<string>;
    }
}

export type NoteServiceOptions = {
    'add': {
        readonly body: CreateNote
    }
}
