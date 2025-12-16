import type {UpdateTemplate_TargetOf_fields} from './';

export interface UpdateTemplate {
    readonly id?: string | undefined;
    /**
     * 模板的字段定义集合
     * 一对多关系：一个模板包含多个字段
     */
    readonly fields: ReadonlyArray<UpdateTemplate_TargetOf_fields>;
}
