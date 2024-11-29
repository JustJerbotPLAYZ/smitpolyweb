import { RoleDto } from "../dto/RoleDto";
import baseService from "./Baseservice";

export const GetAllRoles = () => new Promise((resolve, reject) => {
    baseService.get("Role").then((response) => {
        resolve(response);
    }).catch((error) => reject(error))
});

export const GetRoleByID = (id: number | undefined) => new Promise((resolve, reject) => {
    baseService.get(`Role/${id}`).then((response) => {
        resolve(response);
    }).catch((error) => reject(error))
});

export const CreateRole = (formData: RoleDto) => new Promise((resolve, reject) => {
    baseService.post("Role", {
        name: formData.name,
        permissions: formData.permissions,
    }).then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
});

export const UpdateRoleByID = (id: number | undefined, formData: RoleDto) => new Promise((resolve, reject) => {
    baseService.post(`Role/${id}`, {
        name: formData.name,
        permissions: formData.permissions,
    }).then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
});

export const DeleteRoleByID = (id: number | undefined) => new Promise((resolve, reject) => {
    baseService(`Role/${id}`).then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
});