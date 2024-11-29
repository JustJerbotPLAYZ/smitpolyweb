import { SupplierDto } from "../dto/SupplierDto";
import baseService from "./Baseservice";

export const GetAllSuppliers = () => new Promise((resolve, reject) => {
    baseService.get("Supplier").then((response) => {
        resolve(response);
    }).catch((error) => reject(error))
});

export const GetSupplierByID = (id: number) => new Promise((resolve, reject) => {
    baseService.get(`Supplier/${id}`).then((response) => {
        resolve(response);
    }).catch((error) => reject(error))
});

export const CreateSupplier = (formData: SupplierDto) => new Promise((resolve, reject) => {
    baseService.post("Supplier", {
        name: formData.name,
        addressID: formData.addressID,
    }).then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
});

export const UpdateSupplierByID = (id: number | undefined, formData: SupplierDto) => new Promise((resolve, reject) => {
    baseService.patch(`Supplier/${id}`, {
        name: formData.name,
        addressID: formData.addressID,
    }).then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
});

export const DeleteSupplierByID = (id: number | undefined) => new Promise((resolve, reject) => {
    baseService.delete(`Supplier/${id}`).then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
});

