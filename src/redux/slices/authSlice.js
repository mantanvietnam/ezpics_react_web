import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAuthenticated: false,
    token: "",
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        CHANGE_VALUE_TOKEN: (state, actions) => {
            state.token = actions.payload;
        },
        CHANGE_STATUS_AUTH: (state, actions) => {
            state.isAuthenticated = actions.payload;
        },
    },
});

export const { CHANGE_VALUE_TOKEN, CHANGE_STATUS_AUTH } = authSlice.actions;
export default authSlice.reducer;