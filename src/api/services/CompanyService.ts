import type {Executor} from '../';
import type {CompanyDto} from '../model/dto/';
import type {CompanyAddInput, CompanySearch, Page} from '../model/static/';

export class CompanyService {
    
    private executor: Executor

    constructor(executor: Executor) {
        this.executor = executor
    }
    
    /**
     * 管理员添加企业
     */
    readonly add: (options: CompanyServiceOptions['add']) => Promise<
        string
    > = async(options) => {
        let _uri = '/company/add';
        let _separator = _uri.indexOf('?') === -1 ? '?' : '&';
        let _value: any = undefined;
        _value = options.input.name;
        _uri += _separator
        _uri += 'name='
        _uri += encodeURIComponent(_value);
        _separator = '&';
        _value = options.input.code;
        _uri += _separator
        _uri += 'code='
        _uri += encodeURIComponent(_value);
        _separator = '&';
        _value = options.input.phone;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'phone='
            _uri += encodeURIComponent(_value);
            _separator = '&';
        }
        _value = options.input.address;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'address='
            _uri += encodeURIComponent(_value);
            _separator = '&';
        }
        _value = options.input.contact;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'contact='
            _uri += encodeURIComponent(_value);
            _separator = '&';
        }
        _value = options.input.status;
        _uri += _separator
        _uri += 'status='
        _uri += encodeURIComponent(_value);
        _separator = '&';
        _value = options.input.tenant;
        _uri += _separator
        _uri += 'tenant='
        _uri += encodeURIComponent(_value);
        _separator = '&';
        return (await this.executor({uri: _uri, method: 'POST'})) as Promise<string>;
    }
    
    /**
     * 管理员删除企业
     */
    readonly delete: (options: CompanyServiceOptions['delete']) => Promise<
        void
    > = async(options) => {
        let _uri = '/company/delete';
        let _separator = _uri.indexOf('?') === -1 ? '?' : '&';
        let _value: any = undefined;
        _value = options.id;
        _uri += _separator
        _uri += 'id='
        _uri += encodeURIComponent(_value);
        _separator = '&';
        return (await this.executor({uri: _uri, method: 'POST'})) as Promise<void>;
    }
    
    /**
     * 查询我加入的企业
     */
    readonly myCompany: () => Promise<
        ReadonlyArray<CompanyDto['CompanyService/COMPANY_NAME']>
    > = async() => {
        let _uri = '/company/my';
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<ReadonlyArray<CompanyDto['CompanyService/COMPANY_NAME']>>;
    }
    
    /**
     * 获取全部企业
     */
    readonly pageCompany: (options: CompanyServiceOptions['pageCompany']) => Promise<
        Page<CompanyDto['CompanyService/LIST_COMPANY']>
    > = async(options) => {
        let _uri = '/company/page';
        let _separator = _uri.indexOf('?') === -1 ? '?' : '&';
        let _value: any = undefined;
        _value = options.search.keywords;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'keywords='
            _uri += encodeURIComponent(_value);
            _separator = '&';
        }
        _value = options.search.contact;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'contact='
            _uri += encodeURIComponent(_value);
            _separator = '&';
        }
        _value = options.search.status;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'status='
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
        _value = options.sortCode;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'sortCode='
            _uri += encodeURIComponent(_value);
            _separator = '&';
        }
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<Page<CompanyDto['CompanyService/LIST_COMPANY']>>;
    }
}

export type CompanyServiceOptions = {
    'pageCompany': {
        readonly pageIndex?: number | undefined, 
        readonly pageSize?: number | undefined, 
        readonly sortCode?: string | undefined, 
        readonly search: CompanySearch
    }, 
    'add': {
        readonly input: CompanyAddInput
    }, 
    'delete': {
        readonly id: string
    }, 
    'myCompany': {}
}
