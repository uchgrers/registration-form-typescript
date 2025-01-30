import {baseRequestParams} from "./apiConfig";
import {LogoutUserResponseType, RegisterUserResponseType, RegisterUserType} from "../types";

export const authApi = {
    registerUser(data: RegisterUserType): Promise<RegisterUserResponseType> {
        return baseRequestParams.post('registrationFormApi/auth', data)
            .then(response => response.data)
    },
    logoutUser(userId: string | undefined): Promise<LogoutUserResponseType> {
        return baseRequestParams.post('registrationFormApi/logout',{userId: userId})
            .then(response => response.data)
    }
}