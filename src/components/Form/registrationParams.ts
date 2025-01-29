import {UseFormWatch} from "react-hook-form";

export const emailRegexp =  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const email = {
    name: "email",
    params: {
        required: {
            value: true,
            message: 'Email is required'
        },
        pattern: {
            value: emailRegexp,
            message: 'Email is invalid'
        }
    }
}

export const password = {
    name: "password",
    params: {
        required: {
            value: true,
            message: 'Password is required'
        },
        minLength: {
            value: 2,
            message: 'Password must have at least 8 characters'
        }
    }
}

export const confirmPassword = {
    name: "confirmPassword",
    params: {
        required: {
            value: true,
            message: 'You must confirm your password'
        },
        minLength: {
            value: 8,
            message: 'Password must have at least 8 characters'
        }
    },
    validate: (value: string, watch: UseFormWatch<{ password: string }>) => {
        return value === watch('password') || "Passwords don't match";
    }
}