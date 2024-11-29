import { UserDto } from "../dto/UserDto";

export default function GetUserFullName(user: UserDto) {
    const infix = user.infix !== null ? ` ${user.infix} ` : "";
    return `${user.firstName} ${infix}${user.lastName}`.trim();
}