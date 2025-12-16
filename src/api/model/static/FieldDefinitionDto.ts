import type {FieldType} from '../enums/';

export interface FieldDefinitionDto {
    readonly fieldName: string;
    readonly fieldLabel: string;
    readonly fieldType: FieldType;
    readonly fieldOptions?: ReadonlyArray<string> | undefined;
    readonly defaultValue?: string | undefined;
    readonly placeholder?: string | undefined;
    readonly helpText?: string | undefined;
    readonly required: boolean;
    readonly minLength?: number | undefined;
    readonly maxLength?: number | undefined;
    readonly minValue?: number | undefined;
    readonly maxValue?: number | undefined;
    readonly pattern?: string | undefined;
    readonly sortOrder: number;
    readonly width?: string | undefined;
    readonly visible: boolean;
    readonly editable: boolean;
    readonly searchable: boolean;
}
