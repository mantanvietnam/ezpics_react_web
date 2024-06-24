import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface colorState {
  colorList: any[];
}

const initialState: colorState = {
  colorList: [],
};

export const colorSlice = createSlice({
  name: "color",
  initialState,
  reducers: {
    REPLACE_color: (state, action: PayloadAction<any[]>) => {
      state.colorList = action.payload;
    },
    ADD_COLOR: (state, action: PayloadAction<any[]>) => {
      state.colorList.push(action.payload);
    },
  },
});

export const { REPLACE_color, ADD_COLOR } = colorSlice.actions;
// export const selectCount = (state: RootState) => state.login.loggedIn;
export default colorSlice.reducer;
