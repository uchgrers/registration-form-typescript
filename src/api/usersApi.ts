import {baseRequestParams} from "./apiConfig";
import {UsersType} from "../types";

export const usersApi = {
    getUsers(): Promise<UsersType> {
        return baseRequestParams.get(`/registrationFormApi${process.env.NODE_ENV === "production" ? '' : '/users'}`)
            .then(response => response.data)
    },
}