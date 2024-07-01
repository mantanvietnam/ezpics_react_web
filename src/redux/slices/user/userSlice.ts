import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface TokenState {
  info: any[]; // Assuming info is an array of strings
}

const initialState: TokenState = {
  info: [],
};

export const infoSlice = createSlice({
  name: 'info',
  initialState,
  reducers: {
    CHANGE_VALUE_USER: (state, action: PayloadAction<string>) => {
      state.info = [...state.info, action.payload];
    },
    DELETE_ALL_VALUES: (state) => {
      state.info = [];
    },
  },
});

// Exporting actions
export const { CHANGE_VALUE_USER, DELETE_ALL_VALUES } = infoSlice.actions;

// Exporting reducer
export default infoSlice.reducer;
