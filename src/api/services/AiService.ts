import type {Executor} from '../';
import type {AiChatRequest, AiChatResponse} from '../model/static/';

export class AiService {
    
    constructor(private executor: Executor) {}
    
    readonly chat: (options: AiServiceOptions['chat']) => Promise<
        AiChatResponse
    > = async(options) => {
        let _uri = '/ai/chat';
        return (await this.executor({uri: _uri, method: 'POST', body: options.body})) as Promise<AiChatResponse>;
    }
}

export type AiServiceOptions = {
    'chat': {
        readonly body: AiChatRequest
    }
}
