import { Moment } from "moment";
import { CustomerDto } from "./CustomerDto";
import { CertificateTypeDto } from "./CertificateTypeDto";
import { AddressDto } from "./AddressDto";
import { ArticleDto } from "./ArticleDto";
import { ArticleTypeDto } from "./ArticleTypeDto";
import { SupplierDto } from "./SupplierDto";
import { CertificatePropertyDto } from "./CertificatePropertyDto";
export interface FilteredCertificateDto {
    amount?: number;
    toskip?: number;

    description?: string;
    registrationNumber?: number;
    certificateTypeID?: number;
    customerSearchName?: string;
    customerReferenceNumber?: string;
    extraInfo?: string;
    debtorNumber?: string;
    searchDate?: string;
    allCertificates?: boolean;
    afterMonth?: boolean;
    duringMonth?: boolean;
    expired?: boolean;
    disapproved?: boolean;
    outofOrder?: boolean;
    dateOfInspection?: Moment;
}

export interface CertificateDto {
    id?: number;
    certificateTypeID?: number;
    customerID?: number;
    supplierID?: number;
    workType?: string;
    supplyDate?: Moment;
    status?: Status;
    extraInfo?: string;
    customerReferenceNumber?: string;
    customerSearchName?: string;
    description?: string;
    expirationDate?: string;
    registrationNumber?: number;
    debtorNumber?: string;
    articleID?: number;
    supplierAddressID?: number;
    customerAddressID?: number;
    articleTypeID?: number;
    dateOfInspection?: Moment;

    customer?: CustomerDto;
    certificateType?: CertificateTypeDto;
    supplierAddress?: AddressDto;
    customerAddress?: AddressDto;
    supplier?: SupplierDto;
    article?: ArticleDto;
    articleType?: ArticleTypeDto;
    properties?: CertificatePropertyDto[];
}

export interface ReminderDto {
    debtorNumber?: string;
    startSearchDate?: string;
    endSearchDate?: string;
    thisMonth?: boolean;
    nextMonth?: boolean;
    lastMonth?: boolean;
}

export enum Status {
    Expired = 0,
    Disapproved = 1,
    OutofOrder = 2,
    Valid = 3
}