import React, {useEffect} from 'react';
import './App.scss';
import {Route, Routes} from "react-router-dom";
import HomePage from "./components/HomePage/HomePage";
import Form from "./components/Form/Form";
import {useAppDispatch, useAppSelector} from "./redux/hooks";
import {checkAuth} from "./redux/authSlice";
import Preloader from "./components/common/Preloader/Preloader";

function App() {

    const dispatch = useAppDispatch()
    const isCheckingAuth = useAppSelector(state => state.auth.isCheckingAuth)

    useEffect(() => {
        dispatch(checkAuth())
    }, [dispatch])

    if (isCheckingAuth) {
        return <Preloader/>
    }

    return (
        <div className="App">
            <Routes>
                <Route path='/' element={<HomePage/>}/>
                <Route path='/home' element={<HomePage/>}/>
                <Route path='/login' element={<Form/>}/>
                <Route path='/register' element={<Form/>}/>
                <Route path='/*' element={<div>Page not found</div>}/>
            </Routes>
        </div>
    );
}

export default App;
