import { CertificatePropertyDto } from "../dto/CertificatePropertyDto";
import { PropertyDataDto } from "../dto/PropertyDto";
import baseService from "./Baseservice"

export const GetAllCertificateProperties = () => new Promise((resolve, reject) => {
    baseService.get("CertificateProperty").then((response) => {
        resolve(response);
    }).catch((error) => reject(error))
});

export const GetCertificatePropertyByID = (id: number | undefined) => new Promise((resolve, reject) => {
    baseService.get(`CertificateProperty/${id}`).then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
});

export const UpdateCertificatePropertyByID = (id: number | undefined, formData: CertificatePropertyDto) => new Promise((resolve, reject) => {
    baseService.patch(`CertificateProperty/${id}`, {
        certificateID: formData.certificateID,
        propertyID: formData.propertyID,
        value: formData.value

    }).then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
});

export const DeleteCertificatePropertyByID = (id: number | undefined) => new Promise((resolve, reject) => {
    baseService.delete(`CertificateProperty/${id}`).then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
})

export const CreateCertificateProperty = (formData: CertificatePropertyDto) => new Promise((resolve, reject) => {
    console.log(JSON.stringify(formData));
    baseService.post("CertificateProperty/", {
        certificateID: formData.certificateID,
        propertyID: formData.propertyID,
        value: formData.value

    }).then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
});

export const GetCertificatePropertiesByCertificateID = (id: number | undefined) => new Promise((resolve, reject) => {
    baseService.get(`CertificateProperty/GetCertificatePropertiesByCertificateID/${id}`).then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
});

export const GetAllCertificatePropertyData = (formData:PropertyDataDto) => new Promise((resolve, reject) => {
    baseService.post("CertificateProperty/GetAllCertificatePropertyData", {
        certificateID: formData.certificateID,
        articleTypeID: formData.articleTypeID
    }).then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
});


