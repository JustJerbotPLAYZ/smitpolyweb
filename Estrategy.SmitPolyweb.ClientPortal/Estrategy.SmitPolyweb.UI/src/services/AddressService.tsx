import { AddressDto } from "../dto/AddressDto";
import baseService from "./Baseservice";


export const GetAllAddresses = () => new Promise((resolve, reject) => {
    baseService.get("Address").then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
});

export const GetAddressByID = (id: number | undefined) => new Promise((resolve, reject) => {
    baseService.get(`Address/${id}`).then((response) => {
        resolve(response);
    }).catch((error) => reject(error))
});

export const CreateAddress = (formData: AddressDto) => new Promise((resolve, reject) => {
    baseService.post("Address", {
        streetName: formData.streetName,
        houseNumber: formData.houseNumber,
        addition: formData.addition,
        postalCode: formData.postalCode,
        city: formData.city,
        country: formData.country,
    }).then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
});

export const UpdateAddressByID = (id: number | undefined, formData: AddressDto) => new Promise((resolve, reject) => {
    baseService.patch(`Address/${id}`, {
        streetName: formData.streetName,
        houseNumber: formData.houseNumber,
        addition: formData.addition,
        postalCode: formData.postalCode,
        city: formData.city,
        country: formData.country,
    }).then((response) => {
        resolve(response);
    }).catch((error) => {
        reject(error);
    });
});

export const DeleteAddressByID = (id: number | undefined) => new Promise((resolve, reject) => {
    baseService.delete(`Address/${id}`).then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
});
