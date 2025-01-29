import React, {useCallback, useEffect} from 'react';
import {FormFieldsType, RegisterUserType} from "../../types";
import Link from "../common/Link/Link";
import {Navigate, useLocation} from "react-router-dom";
import styles from './Form.module.scss';
import {SubmitHandler, useForm} from "react-hook-form";
import {confirmPassword, email, password} from "./registrationParams";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {clearError, registerUser} from "../../redux/authSlice";
import Preloader from "../common/Preloader/Preloader";
import ErrorMessage from "../common/ErrorMessage/ErrorMessage";

const Form = () => {
    const location = useLocation().pathname
    const dispatch = useAppDispatch()
    const isAuth = useAppSelector(state => state.auth.isAuth)
    const authError = useAppSelector(state => state.auth.authError)
    const pending = useAppSelector(state => state.auth.pending)
    const { register, watch, handleSubmit, formState: { errors } } = useForm<FormFieldsType>()

    const fieldsCount = location === '/login' ? 2 : 3
    const fieldsLabelsAndHookParams = [
        {
            name: 'Email:',
            type: 'email',
            hookParams: { name: email.name, params: email.params },
            validate: undefined
        },
        {
            name: 'Password:',
            type: 'password',
            hookParams: { name: password.name, params: password.params },
            validate: undefined
        },
        {
            name: 'Confirm password:',
            type: 'password',
            hookParams: { name: confirmPassword.name, params: confirmPassword.params },
            validate: (value: string | undefined) => {
                const passwordValue = watch('password')
                return value === passwordValue || 'Passwords don\'t match'
            }
        }
    ]

    const fields = [];
    for (let i = 0; i < fieldsCount; i++) {
        fields.push({
            sequenceNumber: i,
            ...fieldsLabelsAndHookParams[i],
        });
    }

    const onSubmit: SubmitHandler<FormFieldsType> = useCallback((data) => {
        const type = location === '/login' ? 'login' : 'register'
        dispatch(registerUser({
            email: data.email,
            password: data.password,
            type
        }))
    }, [dispatch, location])

    useEffect(() => {
        dispatch(clearError())
    }, [dispatch, location])

    return (
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            {isAuth && <Navigate to='/home'/>}
            {fields.map(field => (
                <div className={styles.form__field} key={field.sequenceNumber}>
                    <label htmlFor={field.name}>{field.name}</label>
                    <input
                        id={field.name}
                        placeholder={field.name}
                        type={field.type}
                        {...register(field.hookParams.name as keyof FormFieldsType, {
                            ...field.hookParams.params,
                            validate: field.validate
                        })}
                    />
                    {errors[field.hookParams.name as keyof FormFieldsType]?.message && (
                        <ErrorMessage message={String(errors[field.hookParams.name as keyof FormFieldsType]?.message)}/>
                    )}
                </div>
            ))}
            <ErrorMessage message={authError}/>
            <Link
                action={location === '/login' ? 'Register' : 'Login'}
                location={location === '/login' ? '/register' : '/login'}
            />
            <button type="submit" className={styles.form__button}>
                {pending ? <Preloader/> : 'Submit'}
            </button>
        </form>
    );
};

export default Form;