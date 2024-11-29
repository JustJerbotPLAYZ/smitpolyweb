import { PropertyChoiseDto } from "../dto/PropertyDto";
import baseService from "./Baseservice";


export const GetAllPropertyChoises = () => new Promise((resolve, reject) => {
    baseService.get("PropertyChoise").then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
});

export const GetPropertyChoiseByID = (id: number | undefined) => new Promise((resolve, reject) => {
    baseService.get(`PropertyChoise/${id}`).then((response) => {
        resolve(response);
    }).catch((error) => reject(error))
});

export const CreatePropertyChoise = (formData: PropertyChoiseDto) => new Promise((resolve, reject) => {
    baseService.post("PropertyChoise", {
        propertyID: formData.propertyID,
       value: formData.value,
    }).then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
});

export const UpdatePropertyChoiseByID = (id: number | undefined, formData: PropertyChoiseDto) => new Promise((resolve, reject) => {
    baseService.patch(`PropertyChoise/${id}`, {
        propertyID: formData.propertyID,
        value: formData.value,
    }).then((response) => {
        resolve(response);
    }).catch((error) => {
        reject(error);
    });
});

export const DeletePropertyChoiseByID = (id: number | undefined) => new Promise((resolve, reject) => {
    baseService.delete(`PropertyChoise/${id}`).then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
});

export const GetPropertyChoisesByPropertyID = (id: number | undefined) => new Promise((resolve, reject) => {
    baseService.get(`PropertyChoise/GetPropertyChoisesByPropertyID/${id}`).then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
})