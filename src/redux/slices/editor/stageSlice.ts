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
    addLayerText: (state, action: PayloadAction<any>) => {
      // Tìm giá trị sort lớn nhất hiện tại trong designLayers
      const maxSort =
        state.stageData.designLayers.length > 0
          ? Math.max(
              ...state.stageData.designLayers.map((layer: any) => layer.sort)
            )
          : 0;

      // Tạo phần tử mới với giá trị sort được cập nhật
      const newLayer = {
        ...action.payload,
        sort: maxSort + 1,
      };

      // Cập nhật state với phần tử mới
      state.stageData.designLayers = [
        ...state.stageData.designLayers,
        newLayer,
      ];
    },
    updateListLayers: (state, action: PayloadAction<any>) => {
      state.stageData.designLayers = action.payload;
    },
    removeLayer: (state, action: PayloadAction<any>) => {
      state.stageData.designLayers = state.stageData.designLayers.filter(
        (layer: any) => layer.id !== action.payload
      );
    },
    updateLayer: (state, action: PayloadAction<{ id: string; data: any }>) => {
      state.stageData.designLayers = state.stageData.designLayers.map(
        (layer: any) =>
          layer.id === action.payload.id
            ? {
                ...layer,
                content: { ...layer.content, ...action.payload.data },
              }
            : layer
      );
    },
    selectLayer: (state, action: PayloadAction<{ id: string }>) => {
      const layer = state.stageData.designLayers.find(
        (layer: any) => layer.id === action.payload.id
      );
      if (layer) {
        state.stageData.selectedLayer = { ...layer };
      }
    },
    flipLayerHorizontally: (state, action: PayloadAction<{ id: string }>) => {
      state.stageData.designLayers = state.stageData.designLayers.map(
        (layer: any) =>
          layer.id === action.payload.id
            ? {
                ...layer,
                content: {
                  ...layer.content,
                  scaleX: -layer.content.scaleX || -1,
                },
              }
            : layer
      );
    },

    flipLayerVertically: (state, action: PayloadAction<{ id: string }>) => {
      state.stageData.designLayers = state.stageData.designLayers.map(
        (layer: any) =>
          layer.id === action.payload.id
            ? {
                ...layer,
                content: {
                  ...layer.content,
                  scaleY: -layer.content.scaleY || -1,
                },
              }
            : layer
      );
    },

    moveLayerToFinal: (state, action: PayloadAction<{ id: string }>) => {
      const layerIndex = state.stageData.designLayers.findIndex(
        (layer: any) => layer.id === action.payload.id
      );
      if (layerIndex > -1) {
        const layer = state.stageData.designLayers[layerIndex];
        const updatedLayers = [
          layer,
          ...state.stageData.designLayers.filter(
            (_: any, index: any) => index !== layerIndex
          ),
        ].map((layer, index) => ({ ...layer, sort: index + 1 }));

        state.stageData.designLayers = updatedLayers;
      }
    },
    moveLayerToFront: (state, action: PayloadAction<{ id: string }>) => {
      const layerIndex = state.stageData.designLayers.findIndex(
        (layer: any) => layer.id === action.payload.id
      );
      if (layerIndex > -1) {
        const layer = state.stageData.designLayers[layerIndex];
        const updatedLayers = [
          ...state.stageData.designLayers.filter(
            (_: any, index: any) => index !== layerIndex
          ),
          layer,
        ].map((layer, index) => ({ ...layer, sort: index + 1 }));

        state.stageData.designLayers = updatedLayers;
      }
    },
    sendLayerBack: (state, action: PayloadAction<{ id: string }>) => {
      const layerIndex = state.stageData.designLayers.findIndex(
        (layer: any) => layer.id === action.payload.id
      );
      if (layerIndex > 0) {
        const updatedLayers = [...state.stageData.designLayers];
        const temp = updatedLayers[layerIndex - 1];
        updatedLayers[layerIndex - 1] = updatedLayers[layerIndex];
        updatedLayers[layerIndex] = temp;

        updatedLayers.forEach((layer, index) => {
          layer.sort = index + 1;
        });

        state.stageData.designLayers = updatedLayers;
      }
    },
    bringLayerForward: (state, action: PayloadAction<{ id: string }>) => {
      const layerIndex = state.stageData.designLayers.findIndex(
        (layer: any) => layer.id === action.payload.id
      );
      if (layerIndex < state.stageData.designLayers.length - 1) {
        const updatedLayers = [...state.stageData.designLayers];
        const temp = updatedLayers[layerIndex];
        updatedLayers[layerIndex] = updatedLayers[layerIndex + 1];
        updatedLayers[layerIndex + 1] = temp;

        updatedLayers.forEach((layer, index) => {
          layer.sort = index + 1;
        });

        state.stageData.designLayers = updatedLayers;
      }
    },
  },
});

export const {
  setStageData,
  addLayerImage,
  removeLayer,
  updateLayer,
  selectLayer,
  updateListLayers,
  moveLayerToFinal,
  moveLayerToFront,
  sendLayerBack,
  bringLayerForward,
  flipLayerHorizontally,
  flipLayerVertically,
  addLayerText,
} = stageSlice.actions;
export default stageSlice.reducer;
