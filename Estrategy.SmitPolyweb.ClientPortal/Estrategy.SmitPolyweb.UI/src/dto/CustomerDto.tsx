import { AddressDto } from "./AddressDto";

export enum ExpirationReminderSetting {
    singleEmail = 0,
    individualEmails = 1
}

export interface CustomerDto {
    id?: number;
    email?: string;
    debtorNumber?: string;
    searchName?: string
    customerName?: string;
    phoneNumber?: string;
    faxNumber?: string;
    certificateEmailSettings?: ExpirationReminderSetting;
    certificateExpirationReminder?: number;
    logoID?: number;
    addressID?: number;
    address?: AddressDto;
}

export interface CustomerFilterDto {
    email?: string;
    debtorNumber?: string;
    searchName?: string
    customerName?: string;
    phoneNumber?: string;
    faxNumber?: string;
}

export interface CustomerWithAddressDto {
    id?: number;
    email?: string;
    debtorNumber?: string;
    searchName?: string
    customerName?: string;
    phoneNumber?: string;
    faxNumber?: string;
    certificateEmailSettings?: ExpirationReminderSetting;
    certificateExpirationReminder?: number;
    logoID?: number;
    addressID?: number;
    streetName?: string;
    houseNumber?: number;
    addition?: string;
    postalCode?: string;
    city?: string;
    country?: string;
}