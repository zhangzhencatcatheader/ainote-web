import type {Executor} from '../';
import type {LedgerTemplateDto} from '../model/dto/';
import type {Dynamic_LedgerTemplate} from '../model/dynamic/';
import type {
    ChangeTemplateStatus, 
    CreateTemplate, 
    CreateTemplateField, 
    KSimpleSaveResult, 
    Page, 
    SearchTemplate, 
    UpdateTemplate
} from '../model/static/';

/**
 * 模版
 */
export class TemplateService {
    
    constructor(private executor: Executor) {}
    
    /**
     * 创建模板
     */
    readonly add: (options: TemplateServiceOptions['add']) => Promise<
        string
    > = async(options) => {
        let _uri = '/template/add';
        return (await this.executor({uri: _uri, method: 'POST', body: options.body})) as Promise<string>;
    }
    
    /**
     * 修改模板状态
     */
    readonly changeStatus: (options: TemplateServiceOptions['changeStatus']) => Promise<
        KSimpleSaveResult<Dynamic_LedgerTemplate>
    > = async(options) => {
        let _uri = '/template/changeStatus';
        return (await this.executor({uri: _uri, method: 'PUT', body: options.body})) as Promise<KSimpleSaveResult<Dynamic_LedgerTemplate>>;
    }
    
    /**
     * 确认字段创建
     */
    readonly createFields: (options: TemplateServiceOptions['createFields']) => Promise<
        string
    > = async(options) => {
        let _uri = '/template/updateFields';
        return (await this.executor({uri: _uri, method: 'POST', body: options.body})) as Promise<string>;
    }
    
    /**
     * 删除模板
     */
    readonly delete: (options: TemplateServiceOptions['delete']) => Promise<
        void
    > = async(options) => {
        let _uri = '/template/';
        _uri += encodeURIComponent(options.id);
        return (await this.executor({uri: _uri, method: 'DELETE'})) as Promise<void>;
    }
    
    /**
     * 获取模板详情
     */
    readonly detail: (options: TemplateServiceOptions['detail']) => Promise<
        LedgerTemplateDto['TemplateService/SIMPLE_TEMPLATE'] | undefined
    > = async(options) => {
        let _uri = '/template/';
        _uri += encodeURIComponent(options.id);
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<LedgerTemplateDto['TemplateService/SIMPLE_TEMPLATE'] | undefined>;
    }
    
    /**
     * ai识别文档生成字段
     */
    readonly generateFields: (options: TemplateServiceOptions['generateFields']) => Promise<
        ReadonlyArray<CreateTemplateField>
    > = async(options) => {
        let _uri = '/template/generateFields';
        return (await this.executor({uri: _uri, method: 'POST', body: options.body})) as Promise<ReadonlyArray<CreateTemplateField>>;
    }
    
    /**
     * 分页获取当前用户可见的模板列表（带搜索）
     */
    readonly myTemplatePage: (options: TemplateServiceOptions['myTemplatePage']) => Promise<
        Page<LedgerTemplateDto['TemplateService/LIST_TEMPLATE']>
    > = async(options) => {
        let _uri = '/template/myTemplatePage';
        let _separator = _uri.indexOf('?') === -1 ? '?' : '&';
        let _value: any = undefined;
        _value = options.search.keyword;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'keyword='
            _uri += encodeURIComponent(_value);
            _separator = '&';
        }
        _value = options.search.category;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'category='
            _uri += encodeURIComponent(_value);
            _separator = '&';
        }
        _value = options.search.enabled;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'enabled='
            _uri += encodeURIComponent(_value);
            _separator = '&';
        }
        _value = options.pageIndex;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'pageIndex='
            _uri += encodeURIComponent(_value);
            _separator = '&';
        }
        _value = options.pageSize;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'pageSize='
            _uri += encodeURIComponent(_value);
            _separator = '&';
        }
        _value = options.sort;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'sort='
            _uri += encodeURIComponent(_value);
            _separator = '&';
        }
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<Page<LedgerTemplateDto['TemplateService/LIST_TEMPLATE']>>;
    }
    
    /**
     * 分页查询当前租户下的全部模板（带搜索）
     */
    readonly tenantTemplatePage: (options: TemplateServiceOptions['tenantTemplatePage']) => Promise<
        Page<LedgerTemplateDto['TemplateService/LIST_TEMPLATE']>
    > = async(options) => {
        let _uri = '/template/tenantTemplatePage';
        let _separator = _uri.indexOf('?') === -1 ? '?' : '&';
        let _value: any = undefined;
        _value = options.search.keyword;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'keyword='
            _uri += encodeURIComponent(_value);
            _separator = '&';
        }
        _value = options.search.category;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'category='
            _uri += encodeURIComponent(_value);
            _separator = '&';
        }
        _value = options.search.enabled;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'enabled='
            _uri += encodeURIComponent(_value);
            _separator = '&';
        }
        _value = options.pageIndex;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'pageIndex='
            _uri += encodeURIComponent(_value);
            _separator = '&';
        }
        _value = options.pageSize;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'pageSize='
            _uri += encodeURIComponent(_value);
            _separator = '&';
        }
        _value = options.sort;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'sort='
            _uri += encodeURIComponent(_value);
            _separator = '&';
        }
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<Page<LedgerTemplateDto['TemplateService/LIST_TEMPLATE']>>;
    }
}

export type TemplateServiceOptions = {
    'add': {
        readonly body: CreateTemplate
    }, 
    'generateFields': {
        readonly body: CreateTemplate
    }, 
    'createFields': {
        readonly body: UpdateTemplate
    }, 
    'myTemplatePage': {
        readonly pageIndex?: number | undefined, 
        readonly pageSize?: number | undefined, 
        readonly sort?: string | undefined, 
        readonly search: SearchTemplate
    }, 
    'tenantTemplatePage': {
        readonly pageIndex?: number | undefined, 
        readonly pageSize?: number | undefined, 
        readonly sort?: string | undefined, 
        readonly search: SearchTemplate
    }, 
    'detail': {
        readonly id: string
    }, 
    'changeStatus': {
        readonly body: ChangeTemplateStatus
    }, 
    'delete': {
        readonly id: string
    }
}
