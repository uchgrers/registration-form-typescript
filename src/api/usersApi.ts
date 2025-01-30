import {baseRequestParams} from "./apiConfig";
import {UsersType} from "../types";

export const usersApi = {
    getUsers(): Promise<UsersType> {
        return baseRequestParams.get('/users')
            .then(response => response.data)
    },
}