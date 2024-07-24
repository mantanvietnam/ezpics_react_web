import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface StageState {
  stageData: any; // Replace `any` with the actual type of your stage data
}

const initialState: StageState = {
  stageData: {
    design: {},
    initSize: {},
    designLayers: [],
    selectedLayer: {},
  },
};

const stageSlice = createSlice({
  name: "stage",
  initialState,
  reducers: {
    setStageData: (state, action: PayloadAction<any>) => {
      state.stageData = action.payload;
    },
    addLayerImage: (state, action: PayloadAction<any>) => {
      state.stageData.designLayers = [
        ...state.stageData.designLayers,
        action.payload,
      ];
    },
    removeLayer: (state, action: PayloadAction<any>) => {
      state.stageData.designLayers = state.stageData.designLayers.filter(
        (layer: any) => layer.id !== action.payload
      );
    },
    updateLayer: (state, action: PayloadAction<{ id: string, data: any }>) => {
      state.stageData.designLayers = state.stageData.designLayers.map((layer: any) =>
        layer.id === action.payload.id ? { ...layer, content: { ...layer.content, ...action.payload.data } } : layer
      );
    },
    selectLayer: (state, action: PayloadAction<{ id: string }>) => {
      const layer = state.stageData.designLayers.find((layer: any) => layer.id === action.payload.id);
      if (layer) {
        state.stageData.selectedLayer = { ...layer };
      }
    },
    flipLayerHorizontally: (state, action: PayloadAction<{ id: string }>) => {
      state.stageData.designLayers = state.stageData.designLayers.map((layer: any) =>
        layer.id === action.payload.id
          ? { ...layer, content: { ...layer.content, scaleX: -layer.content.scaleX || -1 } }
          : layer
      );
    },
  },
});

export const { setStageData, addLayerImage, removeLayer, updateLayer, selectLayer, flipLayerHorizontally } = stageSlice.actions;
export default stageSlice.reducer;
