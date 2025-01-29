import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {AuthType, LogoutUserResponseType, RegisterUserResponseType, RegisterUserType} from "../types";
import {authApi} from "../api/authApi";
import {usersApi} from "../api/usersApi";

const initialState: AuthType = {
    userId: undefined,
    email: undefined,
    isAuth: false,
    authError: null,
    pending: false,
    isCheckingAuth: false
}

export const registerUser = createAsyncThunk<RegisterUserResponseType, RegisterUserType>(
    'auth/register',
    async function (data) {
        return authApi.registerUser(data)
    }
)

export const logoutUser = createAsyncThunk<LogoutUserResponseType, string | undefined>(
    'auth/logout',
    async function (userId) {
        return authApi.logoutUser(userId)
    }
)

export const checkAuth = createAsyncThunk<any>(
    'auth/checkAuth',
    async function () {
        return usersApi.getUsers()
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError(state) {
            state.authError = null
        },
    },
    extraReducers: builder => {
        builder.addCase(registerUser.pending, (state, action) => {
            state.pending = true
        })
        builder.addCase(registerUser.fulfilled, (state, action) => {
            console.log(action.payload)
            if (action.payload.statusCode === 0) {
                state.userId = action.payload.userData.userId
                state.isAuth = action.payload.userData.isAuth
                state.email = action.payload.userData.email
                state.pending = false
            }
            else {
                state.authError = action.payload.messages[0]
                state.pending = false
            }
        })
        builder.addCase(registerUser.rejected, (state, action) => {
            state.pending = false
        })
        builder.addCase(logoutUser.pending, (state, action) => {
            state.pending = true
        })
        builder.addCase(logoutUser.fulfilled, (state, action) => {
            state.pending = false
            state.userId = undefined
            state.isAuth = false
        })
        builder.addCase(checkAuth.pending, (state, action) => {
            state.isCheckingAuth = true
        })
        builder.addCase(checkAuth.fulfilled, (state, action) => {
            state.userId = action.payload.user.userId
            state.email = action.payload.user.email
            state.isAuth = true
            state.isCheckingAuth = false
        })
        builder.addCase(checkAuth.rejected, (state, action) => {
            state.isCheckingAuth = false
        })
    }
})

export const {clearError} = authSlice.actions
export default authSlice.reducer