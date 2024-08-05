import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface StageState {
  stageData: any; // Replace `any` with the actual type of your stage data
  history: any[];
  historyStep: number;
}

const initialState: StageState = {
  stageData: {
    design: {},
    initSize: {},
    designLayers: [],
    selectedLayer: {},
  },
  history: [],
  historyStep: -1,
};

const addToHistory = (state: StageState) => {
  const newHistory = [
    ...state.history.slice(0, state.historyStep + 1),
    state.stageData,
  ];
  return {
    history: newHistory,
    historyStep: newHistory.length - 1,
  };
};

const stageSlice = createSlice({
  name: "stage",
  initialState,
  reducers: {
    setStageData: (state, action: PayloadAction<any>) => {
      state.stageData = action.payload;
      const { history, historyStep } = addToHistory(state);
      state.history = history;
      state.historyStep = historyStep;
    },
    addLayerImage: (state, action: PayloadAction<any>) => {
      state.stageData.designLayers = [
        ...state.stageData.designLayers,
        action.payload,
      ];
      const { history, historyStep } = addToHistory(state);
      state.history = history;
      state.historyStep = historyStep;
    },
    addLayerText: (state, action: PayloadAction<any>) => {
      const maxSort =
        state.stageData.designLayers.length > 0
          ? Math.max(
              ...state.stageData.designLayers.map((layer: any) => layer.sort)
            )
          : 0;

      const newLayer = {
        ...action.payload,
        sort: maxSort + 1,
      };

      state.stageData.designLayers = [
        ...state.stageData.designLayers,
        newLayer,
      ];
      const { history, historyStep } = addToHistory(state);
      state.history = history;
      state.historyStep = historyStep;
    },
    updateListLayers: (state, action: PayloadAction<any>) => {
      state.stageData.designLayers = action.payload;
      const { history, historyStep } = addToHistory(state);
      state.history = history;
      state.historyStep = historyStep;
    },
    removeLayer: (state, action: PayloadAction<any>) => {
      state.stageData.designLayers = state.stageData.designLayers.filter(
        (layer: any) => layer.id !== action.payload
      );
      const { history, historyStep } = addToHistory(state);
      state.history = history;
      state.historyStep = historyStep;
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
      const { history, historyStep } = addToHistory(state);
      state.history = history;
      state.historyStep = historyStep;
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
      const { history, historyStep } = addToHistory(state);
      state.history = history;
      state.historyStep = historyStep;
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
      const { history, historyStep } = addToHistory(state);
      state.history = history;
      state.historyStep = historyStep;
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
        const { history, historyStep } = addToHistory(state);
        state.history = history;
        state.historyStep = historyStep;
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
        const { history, historyStep } = addToHistory(state);
        state.history = history;
        state.historyStep = historyStep;
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
        const { history, historyStep } = addToHistory(state);
        state.history = history;
        state.historyStep = historyStep;
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
        const { history, historyStep } = addToHistory(state);
        state.history = history;
        state.historyStep = historyStep;
      }
    },
    undo: (state) => {
      if (state.historyStep > 0) {
        state.historyStep -= 1;
        state.stageData = state.history[state.historyStep];
      }
    },
    redo: (state) => {
      if (state.historyStep < state.history.length - 1) {
        state.historyStep += 1;
        state.stageData = state.history[state.historyStep];
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
  undo,
  redo,
} = stageSlice.actions;
export default stageSlice.reducer;
