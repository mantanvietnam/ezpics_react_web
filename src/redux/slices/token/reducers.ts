
import { createReducer, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface tokenState {
  token: string;
  id: string;
  proUser: boolean;
}

const initialState: tokenState = {
  token: "",
  id: "",
  proUser: false,
};

export const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    REPLACE_TOKEN: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    REPLACE_ID_USER: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
    REPLACE_PRO_USER: (state, action: PayloadAction<boolean>) => {
      state.proUser = action.payload;
    },
  },
});

export const { REPLACE_TOKEN, REPLACE_ID_USER, REPLACE_PRO_USER } =
  tokenSlice.actions;
// export const selectCount = (state: RootState) => state.login.loggedIn;
export default tokenSlice.reducer;
