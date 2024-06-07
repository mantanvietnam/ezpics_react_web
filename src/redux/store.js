import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import infoSlice from "./slices/infoUser";

export const store = configureStore({
    reducer: {
        auth: authSlice,
        info: infoSlice
    }
})
