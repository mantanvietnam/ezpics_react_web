import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StageState {
  stageData: any; // Replace `any` with the actual type of your stage data
}

const initialState: StageState = {
  stageData: null,
};

const stageSlice = createSlice({
  name: 'stage',
  initialState,
  reducers: {
    setStageData: (state, action: PayloadAction<any>) => {
      state.stageData = action.payload;
    },
  },
});

export const { setStageData } = stageSlice.actions;
export default stageSlice.reducer;
