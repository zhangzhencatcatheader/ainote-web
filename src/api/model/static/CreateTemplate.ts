export interface CreateTemplate {
    /**
     * 台账模板名称，如"安全生产巡查台账"、"设备维护台账"
     */
    readonly name: string;
    /**
     * 台账模板描述
     */
    readonly description?: string | undefined;
    /**
     * 台账类型分类，用于分类管理，如"safety"、"equipment"、"maintenance"等
     */
    readonly category?: string | undefined;
    /**
     * 图标名称或URL
     */
    readonly iconFileId?: string | undefined;
    readonly fileId?: string | undefined;
    /**
     * 排序顺序
     */
    readonly sortOrder: number;
    /**
     * 主题颜色
     */
    readonly color?: string | undefined;
}
