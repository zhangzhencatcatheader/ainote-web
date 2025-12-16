import type {FieldType} from '../enums/';

export interface UpdateTemplate_TargetOf_fields {
    readonly id?: string | undefined;
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
     * 字段宽度（如"50%%"、"200px"）
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
}
