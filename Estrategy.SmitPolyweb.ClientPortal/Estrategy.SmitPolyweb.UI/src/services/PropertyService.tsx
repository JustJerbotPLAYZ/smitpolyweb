import { PropertyDto } from "../dto/PropertyDto";
import baseService from "./Baseservice";

export const GetPropertyByID = (id: number) => new Promise((resolve, reject) => {
    baseService.get(`Property/${id}`).then((response) => {
        resolve(response);
    }).catch((error) => reject(error))
});

export const CreateNewProperty = (formData: PropertyDto) => new Promise((resolve, reject) => {
    console.log("createpropFormData: " + JSON.stringify(formData));
    baseService.post("Property", {
        name: formData.name,
        propertyName: formData.propertyName,
        englishName: formData.englishName,
        fieldType: formData.fieldType,
    }).then((response) => {
        console.log(response);
        resolve(response);
    }).catch((error) => {
        reject(error);
        console.log(error);
    });
});

export const UpdatePropertyByID = (id: number | undefined, formData: PropertyDto) => new Promise((resolve, reject) => {
    baseService.patch(`Property/${id}`, {
        name: formData.name,
        propertyName: formData.propertyName,
        englishName: formData.englishName,
        fieldType: formData.fieldType,
    }).then((response) => {
        console.log(response);
        resolve(response);
    }).catch((error) => {
        reject(error);
        console.log(error);
    });
});


export const GetPropertiesByID = (id: number | undefined) => new Promise((resolve, reject) => {
    baseService.get(`Certificate/Properties/${id}`).then((response) => {
        resolve(response);
        console.log(response);
    }).catch((error) => {
        reject(error);
        console.log(error);
    });
});

export const GetAllProperties = () => new Promise((resolve, reject) => {
    baseService.get("Property").then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
});

export const DeleteProperty = (id: number | undefined) => new Promise((resolve, reject) => {
    baseService.delete(`Property/${id}`).then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
});

export const GetArticleTypePropertyByPropertyID = (id: number | undefined) => new Promise((resolve, reject) => {
    baseService.get(`Property/GetArticleTypePropertyByPropertyID/${id}`).then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
});

export const GetAvailableProperties = (id:number | undefined) => new Promise((resolve, reject) => {
    baseService.get(`Property/AvailableProperties/${id}`).then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
})



