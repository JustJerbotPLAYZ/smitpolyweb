import { CertificateTypeDto } from "../dto/CertificateTypeDto";
import baseService from "./Baseservice";

export const GetAllCertificateTypes = () => new Promise((resolve, reject) => {
    baseService.get("CertificateType").then((response) => {
        resolve(response);
    }).catch((error) => reject(error))
});

export const GetCertificateTypeByID = (id: number) => new Promise((resolve, reject) => {
    baseService.get(`CertificateType/${id}`).then((response) => {
        resolve(response);
    }).catch((error) => reject(error))
});

export const CreateCertificateType = (formData: CertificateTypeDto) => new Promise((resolve, reject) => {
    baseService.post("CertificateType", {
        name: formData.name,
        description: formData.description,
    }).then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
});

export const UpdateCertificateTypeByID = (id: number | undefined, formData: CertificateTypeDto) => new Promise((resolve, reject) => {
    baseService.patch(`CertificateType/${id}`, {
        name: formData.name,
        description: formData.description,
    }).then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
});

export const DeleteCertificateTypeByID = (id: number | undefined) => new Promise((resolve, reject) => {
    baseService.delete(`CertificateType/${id}`).then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
});