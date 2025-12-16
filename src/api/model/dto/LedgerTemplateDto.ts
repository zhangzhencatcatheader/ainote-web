import type {FieldType, FileType} from '../enums/';

export type LedgerTemplateDto = {
    'TemplateService/LIST_TEMPLATE': {
        readonly id: string;
        /**
         * 台账模板名称，如"安全生产巡查台账"、"设备维护台账"
         */
        readonly name: string;
        /**
         * 台账类型分类，用于分类管理，如"safety"、"equipment"、"maintenance"等
         */
        readonly category?: string | undefined;
        /**
         * 台账模板描述
         */
        readonly description?: string | undefined;
        /**
         * 是否启用该模板
         */
        readonly enabled: boolean;
        /**
         * 图标名称或URL
         */
        readonly icon?: {
            readonly id: string;
            /**
             * The time when the object was created.
             * 
             * In this example, this property is not
             * explicitly modified by business code,
             * but is automatically modified by `DraftInterceptor`
             */
            readonly createdTime: string;
            /**
             * The time when the object was last modified
             * 
             * In this example, this property is not
             * explicitly modified by business code,
             * but is automatically modified by `DraftInterceptor`
             */
            readonly modifiedTime: string;
            /**
             * 文件名（存储在OSS中的名称）
             */
            readonly fileName: string;
            /**
             * 原始文件名
             */
            readonly originalName: string;
            /**
             * 文件大小（字节）
             */
            readonly fileSize: number;
            /**
             * 文件路径（OSS中的完整路径）
             */
            readonly filePath: string;
            /**
             * MIME类型
             */
            readonly mimeType?: string | undefined;
            /**
             * 文件类型枚举
             */
            readonly fileType?: FileType | undefined;
        } | undefined;
    }, 
    'TemplateService/SIMPLE_TEMPLATE': {
        readonly id: string;
        /**
         * 台账模板名称，如"安全生产巡查台账"、"设备维护台账"
         */
        readonly name: string;
        /**
         * 台账类型分类，用于分类管理，如"safety"、"equipment"、"maintenance"等
         */
        readonly category?: string | undefined;
        /**
         * 台账模板描述
         */
        readonly description?: string | undefined;
        /**
         * 是否启用该模板
         */
        readonly enabled: boolean;
        /**
         * 图标名称或URL
         */
        readonly icon?: {
            readonly id: string;
            /**
             * The time when the object was created.
             * 
             * In this example, this property is not
             * explicitly modified by business code,
             * but is automatically modified by `DraftInterceptor`
             */
            readonly createdTime: string;
            /**
             * The time when the object was last modified
             * 
             * In this example, this property is not
             * explicitly modified by business code,
             * but is automatically modified by `DraftInterceptor`
             */
            readonly modifiedTime: string;
            /**
             * 文件名（存储在OSS中的名称）
             */
            readonly fileName: string;
            /**
             * 原始文件名
             */
            readonly originalName: string;
            /**
             * 文件大小（字节）
             */
            readonly fileSize: number;
            /**
             * 文件路径（OSS中的完整路径）
             */
            readonly filePath: string;
            /**
             * MIME类型
             */
            readonly mimeType?: string | undefined;
            /**
             * 文件类型枚举
             */
            readonly fileType?: FileType | undefined;
        } | undefined;
        readonly file?: {
            readonly id: string;
            /**
             * The time when the object was created.
             * 
             * In this example, this property is not
             * explicitly modified by business code,
             * but is automatically modified by `DraftInterceptor`
             */
            readonly createdTime: string;
            /**
             * The time when the object was last modified
             * 
             * In this example, this property is not
             * explicitly modified by business code,
             * but is automatically modified by `DraftInterceptor`
             */
            readonly modifiedTime: string;
            /**
             * 文件名（存储在OSS中的名称）
             */
            readonly fileName: string;
            /**
             * 原始文件名
             */
            readonly originalName: string;
            /**
             * 文件大小（字节）
             */
            readonly fileSize: number;
            /**
             * 文件路径（OSS中的完整路径）
             */
            readonly filePath: string;
            /**
             * MIME类型
             */
            readonly mimeType?: string | undefined;
            /**
             * 文件类型枚举
             */
            readonly fileType?: FileType | undefined;
        } | undefined;
        /**
         * 模板的字段定义集合
         * 一对多关系：一个模板包含多个字段
         */
        readonly fields: ReadonlyArray<{
            readonly id: string;
            /**
             * The time when the object was created.
             * 
             * In this example, this property is not
             * explicitly modified by business code,
             * but is automatically modified by `DraftInterceptor`
             */
            readonly createdTime: string;
            /**
             * The time when the object was last modified
             * 
             * In this example, this property is not
             * explicitly modified by business code,
             * but is automatically modified by `DraftInterceptor`
             */
            readonly modifiedTime: string;
            /**
             * 字段名称（英文标识），用于程序识别
             */
            readonly fieldName: string;
            /**
             * 字段标签（显示名称），用于界面展示
             */
            readonly fieldLabel: string;
            /**
             * 字段类型：TEXT, TEXTAREA, NUMBER, DATE, DATETIME, SELECT等
             */
            readonly fieldType: FieldType;
            /**
             * 字段选项（JSON格式），用于SELECT、MULTISELECT等类型
             * 例如：["选项1", "选项2", "选项3"]
             */
            readonly fieldOptions?: string | undefined;
            /**
             * 默认值
             */
            readonly defaultValue?: string | undefined;
            /**
             * 占位符提示
             */
            readonly placeholder?: string | undefined;
            /**
             * 帮助说明文本
             */
            readonly helpText?: string | undefined;
            /**
             * 是否必填
             */
            readonly required: boolean;
            /**
             * 最小长度（用于文本类型）
             */
            readonly minLength?: number | undefined;
            /**
             * 最大长度（用于文本类型）
             */
            readonly maxLength?: number | undefined;
            /**
             * 最小值（用于数字类型）
             */
            readonly minValue?: number | undefined;
            /**
             * 最大值（用于数字类型）
             */
            readonly maxValue?: number | undefined;
            /**
             * 正则表达式验证模式
             */
            readonly pattern?: string | undefined;
            /**
             * 字段排序顺序
             */
            readonly sortOrder: number;
            /**
             * 字段宽度（如"50%"、"200px"）
             */
            readonly width?: string | undefined;
            /**
             * 是否可见
             */
            readonly visible: boolean;
            /**
             * 是否可编辑
             */
            readonly editable: boolean;
            /**
             * 是否可搜索
             */
            readonly searchable: boolean;
        }>;
        /**
         * 主题颜色
         */
        readonly color?: string | undefined;
    }
}
