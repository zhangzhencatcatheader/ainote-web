import type {Executor} from '../';
import type {
    AiChatRequest, 
    AiChatResponse, 
    CreateTemplate, 
    CreateTemplateField
} from '../model/static/';

export class AiService {
    
    constructor(private executor: Executor) {}
    
    readonly chat: (options: AiServiceOptions['chat']) => Promise<
        AiChatResponse
    > = async(options) => {
        let _uri = '/ai/chat';
        return (await this.executor({uri: _uri, method: 'POST', body: options.body})) as Promise<AiChatResponse>;
    }
    
    readonly generateTemplateFields: (options: AiServiceOptions['generateTemplateFields']) => Promise<
        ReadonlyArray<CreateTemplateField>
    > = async(options) => {
        let _uri = '/ai/template-fields';
        return (await this.executor({uri: _uri, method: 'POST', body: options.body})) as Promise<ReadonlyArray<CreateTemplateField>>;
    }
}

export type AiServiceOptions = {
    'chat': {
        readonly body: AiChatRequest
    }, 
    'generateTemplateFields': {
        readonly body: CreateTemplate
    }
}
