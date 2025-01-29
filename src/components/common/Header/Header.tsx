import React, {useState} from 'react';
import styles from './Header.module.scss';
import {useAppDispatch, useAppSelector} from "../../../redux/hooks";
import {logoutUser} from "../../../redux/authSlice";
import Preloader from "../Preloader/Preloader";
import './../../../styles/_utils.scss';

const Header = () => {
    const dispatch = useAppDispatch()
    const userId = useAppSelector(state => state.auth.userId)
    const email = useAppSelector(state => state.auth.email)
    const pending = useAppSelector(state => state.auth.pending)
    const logout = () => {
        dispatch(logoutUser(userId))
    }
    const [isShown, setIsShown] = useState(false)
    return (
        <header className={styles.header}>
            {email}
            <button onClick={logout} className={"hiddenMobile"}>
                {pending ? <Preloader/> : 'Logout'}
            </button>
            <div onClick={() => {setIsShown(true)}} className={`${styles.header__burger} visibleMobile`}>
                <span></span>
                <span></span>
                <span></span>
                {isShown &&
                    <div className={styles.header__burger_menu} onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setIsShown(false)}>Close menu</button>
                        <a href="#">Fake 1</a>
                        <a href="#">Fake 2</a>
                        <button onClick={logout}>
                            {pending ? <Preloader/> : 'Logout'}
                        </button>
                    </div>
                }
            </div>
        </header>
    );
};

export default Header;