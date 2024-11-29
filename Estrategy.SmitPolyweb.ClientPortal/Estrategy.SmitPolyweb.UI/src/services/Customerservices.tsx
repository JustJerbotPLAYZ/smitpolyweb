import { CustomerDto, CustomerFilterDto } from "../dto/CustomerDto";
import baseService from "./Baseservice"

export const GetAllCustomers = () => new Promise((resolve, reject) => {
    baseService.get("Customer").then((response) => {
        resolve(response);
    }).catch((error) => reject(error))
});

export const GetFilteredCustomers = (formData: CustomerFilterDto) => new Promise((resolve, reject) => {
    baseService.post("Customer/FilteredCustomers", {
        email: formData.email,
        debtorNumber: formData.debtorNumber,
        searchName: formData.searchName,
        customerName: formData.customerName,
        phoneNumber: formData.phoneNumber,
        faxNumber: formData.faxNumber

    }).then((response) => {
        resolve(response);
    }).catch((error) => reject(error))
});

export const GetCustomerByID = (id: number | undefined) => new Promise((resolve, reject) => {
    baseService.get(`Customer/${id}`).then((response) => {
        resolve(response);
    }).catch((error) => reject(error))
});

export const UpdateCustomerByID = (id: number | undefined, formData: CustomerDto) => new Promise((resolve, reject) => {
    baseService.patch(`Customer/${id}`, {
        email: formData.email,
        debtorNumber: formData.debtorNumber,
        searchName: formData.searchName,
        customerName: formData.customerName,
        phoneNumber: formData.phoneNumber,
        faxNumber: formData.faxNumber,
        certificateEmailSettings: formData.certificateEmailSettings,
        certificateExpirationReminder: formData.certificateExpirationReminder,
        logoID: formData.logoID,
        addressID: formData.addressID,
    }).then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
});

export const CreateNewCustomer = (formData: CustomerDto) => new Promise((resolve, reject) => {
    baseService.post("Customer", {
        email: formData.email,
        debtorNumber: formData.debtorNumber,
        searchName: formData.searchName,
        customerName: formData.customerName,
        phoneNumber: formData.phoneNumber,
        faxNumber: formData.faxNumber,
        certificateEmailSettings: formData.certificateEmailSettings,
        certificateExpirationReminder: formData.certificateExpirationReminder,
        logoID: formData.logoID,
        addressID: formData.addressID,
    }).then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
})

export const DeleteCustomerByID = (id: number | undefined) => new Promise((resolve, reject) => {
    baseService.delete(`Customer/${id}`).then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
});

export const GetAllUsersByCustomerID = (id: number | undefined) => new Promise((resolve, reject) => {
    baseService.get(`Customer/User/GetByIDs/${id}`).then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
})

export const GetAllCustomersWithAddress = () => new Promise((resolve, reject) => {
    baseService.get("Customer/GetAllCustomersWithAddress").then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
});

