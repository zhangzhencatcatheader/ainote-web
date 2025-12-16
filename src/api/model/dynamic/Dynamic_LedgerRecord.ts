import type {LedgerRecordStatus} from '../enums/';
import type {
    Dynamic_Account, 
    Dynamic_Company, 
    Dynamic_LedgerRecordValue, 
    Dynamic_LedgerTemplate
} from './';

export interface Dynamic_LedgerRecord {
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
     * 所属模板
     */
    readonly template?: Dynamic_LedgerTemplate | undefined;
    /**
     * 记录编号（可自定义规则生成）
     */
    readonly recordNo?: string | undefined;
    /**
     * 记录日期
     */
    readonly recordDate?: string;
    /**
     * 记录状态：DRAFT草稿、SUBMITTED已提交、APPROVED已审批、REJECTED已驳回
     */
    readonly status?: LedgerRecordStatus;
    /**
     * 关联的公司（可选）
     */
    readonly company?: Dynamic_Company | undefined;
    /**
     * 提交人
     */
    readonly submitter?: Dynamic_Account | undefined;
    /**
     * 提交时间
     */
    readonly submittedTime?: string | undefined;
    /**
     * 审批人
     */
    readonly approver?: Dynamic_Account | undefined;
    /**
     * 审批时间
     */
    readonly approvedTime?: string | undefined;
    /**
     * 审批意见
     */
    readonly approvalComment?: string | undefined;
    /**
     * 备注信息
     */
    readonly remark?: string | undefined;
    /**
     * 记录的字段值集合
     */
    readonly values?: ReadonlyArray<Dynamic_LedgerRecordValue>;
}
