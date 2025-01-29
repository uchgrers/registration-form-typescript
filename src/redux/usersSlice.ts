import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {UsersType} from "../types";
import {usersApi} from "../api/usersApi";

const initialState: UsersType = {
    users: []
}

export const getUsers = createAsyncThunk<UsersType, void>(
    'users/getUsers',
    async function () {
        return await usersApi.getUsers()
    }
)

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(getUsers.fulfilled, (state, action) => {
            state.users = action.payload.users
        })
    }
})

export const {} = usersSlice.actions
export default usersSlice.reducer