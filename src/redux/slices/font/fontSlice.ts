import { IFontFamily, Resource } from "@/interfaces/editor";
import { createReducer, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface fontState {
  font: any[];
}

const initialState: fontState = {
  font: [],
};

export const fontSlice = createSlice({
  name: "font",
  initialState,
  reducers: {
    REPLACE_font: (state, action: PayloadAction<any[]>) => {
      // Gán mảng mới từ action.payload cho thuộc tính 'font'
      state.font = action.payload;
    },
  },
});

export const { REPLACE_font } = fontSlice.actions;
// export const selectCount = (state: RootState) => state.login.loggedIn;
export default fontSlice.reducer;
