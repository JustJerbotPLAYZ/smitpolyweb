export interface UserDto {
    id?: number;
    firstName?: string;
    infix?: string;
    lastName?: string;
    password?: string;
    passwordHashType?: PasswordHashType;
    email?: string;
    roleID?: number;
    customerID?: number;
    refreshTokenID?: number;
    accountActive?: boolean;
    accountBlocked?: boolean;
}

export interface UserEmailDto {
    email?:string
}

export enum PasswordHashType {
    NotSet = 0,
    Salted = 1
}