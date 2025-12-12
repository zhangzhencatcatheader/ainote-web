export interface KSimpleSaveResult<E> {
    readonly isRowAffected: boolean;
    readonly totalAffectedRowCount: number;
    readonly affectedRowCountMap: {readonly [key:string]: number};
    readonly originalEntity: E;
    readonly modifiedEntity: E;
    readonly isModified: boolean;
}
