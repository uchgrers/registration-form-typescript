export type UserType = {
    userId: string,
    email: string,
    password?: string
}

export type UsersType = {
    users: Array<UserType>
}

export type AuthType = {
    userId: string | undefined,
    email: string | undefined,
    isAuth: boolean,
    authError: string | null,
    pending: boolean,
    isCheckingAuth: boolean
}

export type FormFieldsType = {
    email: string,
    password: string,
    confirmPassword?: string
}

export type RegisterUserType = {
    email: string,
    password: string,
    type: 'login' | 'register'
}

export type RegisterUserResponseType = {
    statusCode: number,
    messages: Array<string>,
    userData: {
        userId: string | undefined,
        email: string,
        isAuth: boolean,
        users: Array<{userId: string | undefined, email: string, isAuth: boolean}>
    }
}

export type LogoutUserResponseType = {
    message: string
}