import { CertificateDto, FilteredCertificateDto, ReminderDto } from "../dto/CertificateDto";
import baseService from "./Baseservice"

export const GetAllCertificates = () => new Promise((resolve, reject) => {
    baseService.get("Certificate").then((response) => {
        resolve(response);
    }).catch((error) => reject(error))
});

export const GetCertificateByID = (id: number) => new Promise((resolve, reject) => {
    baseService.get(`Certificate/${id}`).then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
})

export const GetFilteredCertificates = (formData: FilteredCertificateDto) => new Promise((resolve, reject) => {
    baseService.post("Certificate/Certificate", {
        amount: formData.amount,
        toskip: formData.toskip,

        registrationNumber: formData.registrationNumber,
        debtorNumber: formData.debtorNumber,
        customerSearchName: formData.customerSearchName,
        customerReferenceNumber: formData.customerReferenceNumber,
        description: formData.description,
        extraInfo: formData.extraInfo,
        searchDate: formData.searchDate,
        allCertificates: formData.allCertificates,
        afterMonth: formData.afterMonth,
        duringMonth: formData.duringMonth,
        expired: formData.expired,
        disapproved: formData.disapproved,
        outofOrder: formData.outofOrder
    }).then((response) => {
        resolve(response);
    }).catch((error) => reject(error))
});

export const CreateNewCertificate = (formData: CertificateDto) => new Promise((resolve, reject) => {
    baseService.post("Certificate", {
        ...formData
    }).then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
});

export const DeleteCertificateByID = (id: number | undefined) => new Promise((resolve, reject) => {
    baseService.delete(`/Certificate/${id}`).then((response) => {
        resolve(response);
    }).catch((error) => reject(error))
});

export const UpdateCertificateByID = (id: number | undefined, formData: CertificateDto) => new Promise((resolve, reject) => {
    baseService.patch(`/Certificate/${id}`, {
        ...formData
    }).then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
});

export const GetReminders = (formData: ReminderDto) => new Promise((resolve, reject) => {
    baseService.post("Certificate/CertificateReminder", {
        debtorNumber: formData.debtorNumber,
        startSearchDate: formData.startSearchDate,
        endSearchDate: formData.endSearchDate,
        thisMonth: formData.thisMonth,
        nextMonth: formData.nextMonth,
        lastMonth: formData.lastMonth
    }).then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
});

export const GetAllCertificateDataByID = (id: number | undefined) => new Promise((resolve, reject) => {
    baseService.get(`Certificate/CertificateData/${id}`,).then((response) => {
        resolve(response);
    }).catch((error => {
        reject(error)
    }));
});
