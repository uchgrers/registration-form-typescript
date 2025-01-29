import React, {useEffect} from 'react';
import Header from "../common/Header/Header";
import styles from './HomePage.module.scss';
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {Navigate} from "react-router-dom";
import {getUsers} from "../../redux/usersSlice";
import Preloader from "../common/Preloader/Preloader";

const HomePage = () => {

    const dispatch = useAppDispatch()
    const isAuth = useAppSelector(state => state.auth.isAuth)
    const isCheckingAuth = useAppSelector(state => state.auth.isCheckingAuth)
    const users = useAppSelector(state => state.users.users)

    useEffect(() => {
        dispatch(getUsers())
    }, [])

    if (isCheckingAuth) {
        return <Preloader/>
    }

    return (
        <div className={styles.home}>
            {!isAuth && <Navigate to='/login'/>}
            <Header/>
            <div className={styles.home__content}>{users.map(u => {
                return <div key={u.userId}>
                    {u.userId + '. ' + u.email}
                </div>
            })}</div>
        </div>
    );
};

export default HomePage;