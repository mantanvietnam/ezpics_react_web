import { createReducer, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";

interface MetadataVariable {
  variable: string;
  variableLabel: string;
  uppercase?: string;
}

export interface VariableState {
  metadataVariables: MetadataVariable[];
}

const initialState: VariableState = {
  metadataVariables: [],
};

export const variableSlice = createSlice({
  name: "variable",
  initialState,
  reducers: {
    REPLACE_METADATA: (state, action: PayloadAction<MetadataVariable[]>) => {
      state.metadataVariables = action.payload;
    },
  },
});

export const { REPLACE_METADATA } = variableSlice.actions;

// Add other actions if needed
// export const { REPLACE_TOKEN, REPLACE_ID_USER } = variableSlice.actions;

export const selectMetadataVariables = (state: RootState) =>
  state.variable.metadataVariables;

export default variableSlice.reducer;
