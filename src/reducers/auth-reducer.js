import { createSlice } from '@reduxjs/toolkit'
import { CommonData } from '../common';

export const initialState = {
   currentManager: '',
   isAdmin: false
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        changeCurrentManager: (state, action) => {
            state.currentManager = action.payload
            state.isAdmin = action.payload === CommonData.adminManager;
        },
    },
})

export const {
    changeCurrentManager
} = authSlice.actions

export default authSlice.reducer
