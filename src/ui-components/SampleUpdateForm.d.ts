/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextAreaFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type SampleUpdateFormInputValues = {
    device_id?: string;
    sample_time?: number;
    device_data?: string;
};
export declare type SampleUpdateFormValidationValues = {
    device_id?: ValidationFunction<string>;
    sample_time?: ValidationFunction<number>;
    device_data?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type SampleUpdateFormOverridesProps = {
    SampleUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    device_id?: PrimitiveOverrideProps<TextFieldProps>;
    sample_time?: PrimitiveOverrideProps<TextFieldProps>;
    device_data?: PrimitiveOverrideProps<TextAreaFieldProps>;
} & EscapeHatchProps;
export declare type SampleUpdateFormProps = React.PropsWithChildren<{
    overrides?: SampleUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    sample?: any;
    onSubmit?: (fields: SampleUpdateFormInputValues) => SampleUpdateFormInputValues;
    onSuccess?: (fields: SampleUpdateFormInputValues) => void;
    onError?: (fields: SampleUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: SampleUpdateFormInputValues) => SampleUpdateFormInputValues;
    onValidate?: SampleUpdateFormValidationValues;
} & React.CSSProperties>;
export default function SampleUpdateForm(props: SampleUpdateFormProps): React.ReactElement;
