import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StageState {
  stageData: any; // Replace `any` with the actual type of your stage data
}

const initialState: StageState = {
  stageData: {
    design: {},
    initSize: {},
    designLayers: []
  },
};

const stageSlice = createSlice({
  name: 'stage',
  initialState,
  reducers: {
    setStageData: (state, action: PayloadAction<any>) => {
      state.stageData = action.payload;
    },
    addLayerImage: (state, action: PayloadAction<any>) => {
      state.stageData.designLayers = [...state.stageData.designLayers, action.payload]
    }
  },
});

export const { setStageData, addLayerImage } = stageSlice.actions;
export default stageSlice.reducer;
