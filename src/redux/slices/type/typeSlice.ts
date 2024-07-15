
import { createReducer, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface typeState {
  typeUser: string | null;
}

const initialState: typeState = {
  typeUser: "",
};

export const typeSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    REPLACE_TYPE_USER: (state, action: PayloadAction<string>) => {
      state.typeUser = action.payload;
    },
  },
});

export const { REPLACE_TYPE_USER } = typeSlice.actions;
// export const selectCount = (state: RootState) => state.login.loggedIn;
export default typeSlice.reducer;
