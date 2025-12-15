import type {Executor} from '../';
import type {Dynamic_StaticFile} from '../model/dynamic/';
import type {FileType} from '../model/enums/';

/**
 * 对象存储服务
 * 提供基于阿里云OSS的文件上传、删除和URL获取功能
 */
export class OssService {
    
    private executor: Executor

    constructor(executor: Executor) {
        this.executor = executor
    }
    
    /**
     * 删除文件
     * @parameter {OssServiceOptions['deleteFile']} options
     * - id 文件ID
     */
    readonly deleteFile: (options: OssServiceOptions['deleteFile']) => Promise<
        void
    > = async(options) => {
        let _uri = '/file/';
        _uri += encodeURIComponent(options.id);
        return (await this.executor({uri: _uri, method: 'DELETE'})) as Promise<void>;
    }
    
    /**
     * 获取所有文件
     * @return 文件列表
     */
    readonly getAllFiles: () => Promise<
        ReadonlyArray<Dynamic_StaticFile>
    > = async() => {
        let _uri = '/file';
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<ReadonlyArray<Dynamic_StaticFile>>;
    }
    
    /**
     * 根据ID获取文件信息
     * @parameter {OssServiceOptions['getFileById']} options
     * - id 文件ID
     * @return 文件信息
     */
    readonly getFileById: (options: OssServiceOptions['getFileById']) => Promise<
        Dynamic_StaticFile | undefined
    > = async(options) => {
        let _uri = '/file/';
        _uri += encodeURIComponent(options.id);
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<Dynamic_StaticFile | undefined>;
    }
    
    /**
     * 根据文件类型获取文件
     * @parameter {OssServiceOptions['getFilesByType']} options
     * - fileType 文件类型
     * @return 文件列表
     */
    readonly getFilesByType: (options: OssServiceOptions['getFilesByType']) => Promise<
        ReadonlyArray<Dynamic_StaticFile>
    > = async(options) => {
        let _uri = '/file/type/';
        _uri += encodeURIComponent(options.fileType);
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<ReadonlyArray<Dynamic_StaticFile>>;
    }
    
    /**
     * 根据上传者ID获取文件
     * @parameter {OssServiceOptions['getFilesByUploaderId']} options
     * - uploaderId 上传者ID
     * @return 文件列表
     */
    readonly getFilesByUploaderId: (options: OssServiceOptions['getFilesByUploaderId']) => Promise<
        ReadonlyArray<Dynamic_StaticFile>
    > = async(options) => {
        let _uri = '/file/uploader/';
        _uri += encodeURIComponent(options.uploaderId);
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<ReadonlyArray<Dynamic_StaticFile>>;
    }
    
    /**
     * 获取最新文件
     * @parameter {OssServiceOptions['getLatestFiles']} options
     * - limit 限制数量
     * @return 文件列表
     */
    readonly getLatestFiles: (options: OssServiceOptions['getLatestFiles']) => Promise<
        ReadonlyArray<Dynamic_StaticFile>
    > = async(options) => {
        let _uri = '/file/latest';
        let _separator = _uri.indexOf('?') === -1 ? '?' : '&';
        let _value: any = undefined;
        _value = options.limit;
        if (_value !== undefined && _value !== null) {
            _uri += _separator
            _uri += 'limit='
            _uri += encodeURIComponent(_value);
            _separator = '&';
        }
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<ReadonlyArray<Dynamic_StaticFile>>;
    }
    
    /**
     * 搜索文件
     * @parameter {OssServiceOptions['searchFiles']} options
     * - keyword 关键词
     * @return 文件列表
     */
    readonly searchFiles: (options: OssServiceOptions['searchFiles']) => Promise<
        ReadonlyArray<Dynamic_StaticFile>
    > = async(options) => {
        let _uri = '/file/search';
        let _separator = _uri.indexOf('?') === -1 ? '?' : '&';
        let _value: any = undefined;
        _value = options.keyword;
        _uri += _separator
        _uri += 'keyword='
        _uri += encodeURIComponent(_value);
        _separator = '&';
        return (await this.executor({uri: _uri, method: 'GET'})) as Promise<ReadonlyArray<Dynamic_StaticFile>>;
    }
    
    /**
     * 上传文件（从 MultipartFile）
     * @parameter {OssServiceOptions['uploadFile']} options
     * - file 多部分文件对象
     * - folder 存储文件夹名称，默认为空
     * @return 文件信息对象
     */
    readonly uploadFile: (options: OssServiceOptions['uploadFile']) => Promise<
        Dynamic_StaticFile
    > = async(options) => {
        let _uri = '/file/upload';
        let _separator = _uri.indexOf('?') === -1 ? '?' : '&';
        let _value: any = undefined;
        _value = options.folder;
        _uri += _separator
        _uri += 'folder='
        _uri += encodeURIComponent(_value);
        _separator = '&';
        const _formData = new FormData();
        const _body = options.body;
        _formData.append("file", _body.file);
        return (await this.executor({uri: _uri, method: 'POST', body: _formData})) as Promise<Dynamic_StaticFile>;
    }
}

export type OssServiceOptions = {
    'uploadFile': {
        /**
         * 存储文件夹名称，默认为空
         */
        readonly folder: string, 
        readonly body: {
            readonly file: File
        }
    }, 
    'getFileById': {
        /**
         * 文件ID
         */
        readonly id: string
    }, 
    'getAllFiles': {}, 
    'getFilesByUploaderId': {
        /**
         * 上传者ID
         */
        readonly uploaderId: string
    }, 
    'getFilesByType': {
        /**
         * 文件类型
         */
        readonly fileType: FileType
    }, 
    'searchFiles': {
        /**
         * 关键词
         */
        readonly keyword: string
    }, 
    'getLatestFiles': {
        /**
         * 限制数量
         */
        readonly limit?: number | undefined
    }, 
    'deleteFile': {
        /**
         * 文件ID
         */
        readonly id: string
    }
}
