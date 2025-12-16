export interface SearchTemplate {
    /**
     * 台账模板名称，如"安全生产巡查台账"、"设备维护台账"
     */
    readonly keyword?: string | undefined;
    /**
     * 台账类型分类，用于分类管理，如"safety"、"equipment"、"maintenance"等
     */
    readonly category?: string | undefined;
    /**
     * 是否启用该模板
     */
    readonly enabled?: boolean | undefined;
}
