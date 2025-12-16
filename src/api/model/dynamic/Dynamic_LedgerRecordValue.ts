import type {FieldDefinitionDto} from '../static/';
import type {Dynamic_LedgerRecord} from './';

export interface Dynamic_LedgerRecordValue {
    /**
     * The time when the object was created.
     * 
     * In this example, this property is not
     * explicitly modified by business code,
     * but is automatically modified by `DraftInterceptor`
     */
    readonly createdTime?: string;
    /**
     * The time when the object was last modified
     * 
     * In this example, this property is not
     * explicitly modified by business code,
     * but is automatically modified by `DraftInterceptor`
     */
    readonly modifiedTime?: string;
    readonly id?: string;
    /**
     * 所属记录
     */
    readonly record?: Dynamic_LedgerRecord | undefined;
    readonly fieldDefinition?: FieldDefinitionDto;
    /**
     * 字段值（所有类型统一存储为文本，前端根据 field.fieldType 解析）
     *  
     * 存储格式说明：
     * - TEXT/TEXTAREA: 直接存储文本
     * - NUMBER/INTEGER/DECIMAL: 存储数字的字符串形式
     * - DATE: "yyyy-MM-dd"
     * - DATETIME: "yyyy-MM-dd HH:mm:ss"
     * - TIME: "HH:mm:ss"
     * - BOOLEAN: "true" 或 "false"
     * - SELECT: 存储选中的值
     * - MULTISELECT: JSON数组格式，如 ["选项1", "选项2"]
     * - FILE: JSON数组格式，存储文件ID列表，如 ["uuid1", "uuid2"]
     */
    readonly fieldValue?: string | undefined;
}
