/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserEmailDto } from "../dto/UserDto";
import AuthService from "./AuthService";
import baseService from "./Baseservice";

export const Authorize = (userDto: { email: string; password: string; }) => new Promise((resolve, reject) => {

    baseService.post("Auth/Login", {
        email: userDto.email,
        password: userDto.password

    }).then((response) => {

        const { accessTokenValue, refreshTokenValue } = response.data;

        const auth = AuthService.getAuth();
        auth.refreshToken = refreshTokenValue;
        auth.accessToken = accessTokenValue;

        AuthService.setAuth(auth);

        resolve(response)
    }).catch((error) => reject(error));
    
});

export const GetUserByEmail = (formData:UserEmailDto) => new Promise((resolve, reject) => {
    baseService.post("Auth/GetByMail", {
        email: formData.email,
    }).then((response: any) => {
        console.log(response);
        resolve(response);
    }).catch((error) => {
        reject(error);
        console.log(error);
    });
})

