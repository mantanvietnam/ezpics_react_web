import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import infoSlice from "./slices/infoUser";
import ipv4Slice from "./slices/networkSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    user: infoSlice,
    ipv4: ipv4Slice,
  },
});
