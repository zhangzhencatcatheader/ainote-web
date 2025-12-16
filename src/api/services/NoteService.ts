import type {Executor} from '../';
import type {NoteDto} from '../model/dto/';
import type {CreateNote, NoteSearch, Page} from '../model/static/';

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
    
    /**
     * 删除笔记
     */
    readonly delete: (options: NoteServiceOptions['delete']) => Promise<
        void
    > = async(options) => {
        let _uri = '/note/';
        _uri += encodeURIComponent(options.id);
        return (await this.executor({uri: _uri, method: 'DELETE'})) as Promise<void>;
    }
    
    /**
     * 获取笔记详情
     */
    readonly detail: (options: NoteServiceOptions['detail']) => Promise<
        NoteDto['NoteService/LIST_NOTE'] | undefined
    > = async(options) => {
        let _uri = '/note/';
        _uri += encodeURIComponent(options.id);
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<NoteDto['NoteService/LIST_NOTE'] | undefined>;
    }
    
    /**
     * 分页获取当前用户的笔记列表（带搜索）
     */
    readonly myNotePage: (options: NoteServiceOptions['myNotePage']) => Promise<
        Page<NoteDto['NoteService/LIST_NOTE']>
    > = async(options) => {
        let _uri = '/note/myNotePage';
        let _separator = _uri.indexOf('?') === -1 ? '?' : '&';
        let _value: any = undefined;
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
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<Page<NoteDto['NoteService/LIST_NOTE']>>;
    }
    
    /**
     * 分页查询当前租户下的全部笔记（带搜索）
     */
    readonly tenantNotePage: (options: NoteServiceOptions['tenantNotePage']) => Promise<
        Page<NoteDto['NoteService/LIST_NOTE']>
    > = async(options) => {
        let _uri = '/note/tenantNotePage';
        let _separator = _uri.indexOf('?') === -1 ? '?' : '&';
        let _value: any = undefined;
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
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<Page<NoteDto['NoteService/LIST_NOTE']>>;
    }
}

export type NoteServiceOptions = {
    'add': {
        readonly body: CreateNote
    }, 
    'myNotePage': {
        readonly pageIndex?: number | undefined, 
        readonly pageSize?: number | undefined, 
        readonly sort?: string | undefined, 
        readonly search: NoteSearch
    }, 
    'tenantNotePage': {
        readonly pageIndex?: number | undefined, 
        readonly pageSize?: number | undefined, 
        readonly sort?: string | undefined, 
        readonly search: NoteSearch
    }, 
    'detail': {
        readonly id: string
    }, 
    'delete': {
        readonly id: string
    }
}
