import type {Executor} from '../';

/**
 * 笔记服务
 * 提供笔记增删改查相关的REST API接口
 *  
 * 这是一个示例服务，用于演示项目结构
 * 您可以根据实际需要扩展或替换此服务
 */
export class NoteService {
    
    constructor(private executor: Executor) {}
}

export type NoteServiceOptions = {
}
