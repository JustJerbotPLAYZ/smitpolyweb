import { AddressDto } from "./AddressDto";

export interface SupplierDto {
    id: number;
    name: string;
    address: AddressDto;
    addressID: number;
}