import { UserDto } from "../dto/UserDto";
import baseService from "./Baseservice";

export const GetUserByID = (id: number | undefined) => new Promise((resolve, reject) => {
    baseService.get(`User/${id}`).then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
});
export const GetAllUsers = () => new Promise((resolve, reject) => {
    baseService.get("User").then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
})

export const CreateNewUser = (formData: UserDto) => new Promise((resolve, reject) => {
    baseService.post("/User", {
        firstname: formData.firstName,
        infix: formData.infix,
        lastName: formData.lastName,
        password: formData.password,
        email: formData.email,
        roleID: formData.roleID,
        customerID:formData.customerID,
        accountActive: true,
    }).then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
});

export const UpdateUser = (userData: UserDto) => new Promise((resolve, reject) => {
    baseService.patch(`/User/${userData.id}`, {
        firstName: userData.firstName,
        infix: userData.infix,
        lastName: userData.lastName,
        password: userData.password,
        passwordHashType: userData.passwordHashType,
        email: userData.email,
        roleID: userData.roleID,
        customerID: userData.customerID,
        refreshTokenID: userData.refreshTokenID,
        accountActive: userData.accountActive,
        accountBlocked: userData.accountBlocked,
    }).then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
});
export default GetAllUsers;

export const DeleteUser = (id: number | undefined) => new Promise((resolve, reject) => {
    baseService.delete(`/User/${id}`).then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
});

export const UpdateUserPassword = (id: number | undefined, formData:UserDto) => new Promise((resolve, reject) => {
    baseService.patch(`User/UpdateUserPassword/${id}`, {
        password: formData.password,
        firstName: formData.firstName,
        infix: formData.infix,
        lastName: formData.lastName,
        passwordHashType: formData.passwordHashType,
        email: formData.email,
        roleID: formData.roleID,
        customerID: formData.customerID,
        refreshTokenID: formData.refreshTokenID,
        accountActive: formData.accountActive,
        accountBlocked: formData.accountBlocked,
    }).then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
});


