import {combineReducers} from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import usersSlice from "./usersSlice";

export const rootReducer = combineReducers({
    auth: authSlice,
    users: usersSlice
})