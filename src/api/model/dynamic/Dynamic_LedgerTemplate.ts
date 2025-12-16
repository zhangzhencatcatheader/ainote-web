import type {
    Dynamic_Account, 
    Dynamic_LedgerRecord, 
    Dynamic_LedgerTemplateField, 
    Dynamic_StaticFile
} from './';

export interface Dynamic_LedgerTemplate {
    readonly account?: Dynamic_Account;
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
    /**
     * The tenant to which the current object belongs.
     * 
     * In this example, this property is not
     * explicitly modified by business code,
     * but is automatically modified by `DraftInterceptor`
     */
    readonly tenant?: string;
    readonly id?: string;
    /**
     * 台账模板名称，如"安全生产巡查台账"、"设备维护台账"
     */
    readonly name?: string;
    /**
     * 台账模板描述
     */
    readonly description?: string | undefined;
    /**
     * 台账类型分类，用于分类管理，如"safety"、"equipment"、"maintenance"等
     */
    readonly category?: string | undefined;
    /**
     * 模板版本号，用于追踪模板变更
     */
    readonly version?: number;
    /**
     * 是否启用该模板
     */
    readonly enabled?: boolean;
    /**
     * 图标名称或URL
     */
    readonly icon?: Dynamic_StaticFile | undefined;
    readonly file?: Dynamic_StaticFile | undefined;
    /**
     * 主题颜色
     */
    readonly color?: string | undefined;
    /**
     * 排序顺序
     */
    readonly sortOrder?: number;
    /**
     * 模板的字段定义集合
     * 一对多关系：一个模板包含多个字段
     */
    readonly fields?: ReadonlyArray<Dynamic_LedgerTemplateField>;
    /**
     * 基于此模板创建的记录
     */
    readonly records?: ReadonlyArray<Dynamic_LedgerRecord>;
}
