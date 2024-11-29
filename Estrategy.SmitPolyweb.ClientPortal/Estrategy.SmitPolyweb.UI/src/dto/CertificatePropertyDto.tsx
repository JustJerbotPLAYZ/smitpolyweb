import { PropertyChoiseDto } from "./PropertyDto";

export interface CertificatePropertyDto {
    id?: number | undefined,
    certificateID?: number,
    propertyID?: number,
    value?: string;
}
export interface InputsType {
    propertyID?: number;
    inputValue?: string;
    labelValue?: string;
    fieldType?: number;
    required?: boolean;
    visable?: boolean;
    propertyChoises?: PropertyChoiseDto[];
}